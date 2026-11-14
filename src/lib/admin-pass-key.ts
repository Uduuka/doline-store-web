import { createHash, pbkdf2Sync, timingSafeEqual } from "node:crypto";
import { getContext } from "@/lib/store";

/** The form field the web's pass key prompt adds to every write (see components/admin-pass-key). */
export const ADMIN_PASS_KEY_FIELD = "admin_pass_key";

/*
 * The admin pass key the Doline Store apps set up on a device's first sign-in, checked here before
 * the web writes anything. It lives on the account's admin store_staff rows; any admin's key will do.
 *
 * Hashes are read in every format the apps have written (PassKeyCrypto.kt, StaffRepository.verifyPassKey):
 *  - "pbkdf2-sha256:<iterations>:<hex>" with a hex salt (current);
 *  - bare hex with a salt: PBKDF2 at the old fixed 120,000 iterations;
 *  - no salt at all: an unsalted SHA-256 digest.
 * The web never rewrites a hash; the apps upgrade old ones on their next unlock.
 *
 * Wrong guesses lock the key the way the apps do (5 tries, then 30 s doubling to 15 min), counted
 * on the cloud rows' failed_attempts / locked_until, which the apps don't sync, so a lockout here
 * doesn't lock a till.
 */

const LEGACY_ITERATIONS = 120_000;
const MAX_ATTEMPTS = 5;
const BASE_LOCKOUT_MS = 30_000;
const MAX_LOCKOUT_MS = 15 * 60_000;

export type PassKeyCheck = { ok: true } | { ok: false; error: string };

function derive(passKey: string, salt: string, iterations: number): string {
  return pbkdf2Sync(passKey, Buffer.from(salt, "hex"), iterations, 32, "sha256").toString("hex");
}

function sameHex(a: string, b: string): boolean {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

function matches(passKey: string, hash: string, salt: string | null): boolean {
  if (!hash) return false;
  if (!salt) return sameHex(createHash("sha256").update(passKey).digest("hex"), hash);
  const parts = hash.split(":");
  if (parts.length === 3 && parts[0] === "pbkdf2-sha256") {
    const iterations = Number(parts[1]);
    if (!Number.isInteger(iterations) || iterations <= 0) return false;
    return sameHex(derive(passKey, salt, iterations), parts[2]!);
  }
  return sameHex(derive(passKey, salt, LEGACY_ITERATIONS), hash);
}

const wait = (ms: number) => {
  const s = Math.ceil(ms / 1000);
  return s < 60 ? `${s} seconds` : `${Math.ceil(s / 60)} minutes`;
};

/** Checks the signed-in account's admin pass key, counting a wrong one towards the lockout. */
export async function checkAdminPassKey(raw: unknown): Promise<PassKeyCheck> {
  const passKey = typeof raw === "string" ? raw.trim() : "";
  if (!/^\d{6}$/.test(passKey)) return { ok: false, error: "Enter the admin pass key: 6 digits." };

  const { supabase, user } = await getContext();
  const { data: admins, error } = await supabase
    .from("store_staff")
    .select("id, pass_key_hash, pass_key_salt, failed_attempts, locked_until")
    .eq("keeper_id", user.id)
    .eq("is_admin", true)
    .is("deleted_at", null);
  if (error) return { ok: false, error: "Couldn't check the pass key. Check your connection and try again." };
  const keyed = (admins ?? []).filter((a) => a.pass_key_hash);
  if (!keyed.length) return { ok: false, error: "This account has no admin pass key yet. Set one in the Doline Store app first." };

  const now = Date.now();
  const lockedUntil = Math.max(0, ...keyed.map((a) => (a.locked_until ? Date.parse(a.locked_until) : 0)));
  if (lockedUntil > now) return { ok: false, error: `Too many wrong tries. Try again in ${wait(lockedUntil - now)}.` };

  const ids = keyed.map((a) => a.id);
  const failed = Math.max(0, ...keyed.map((a) => a.failed_attempts ?? 0));

  if (keyed.some((a) => matches(passKey, a.pass_key_hash!, a.pass_key_salt))) {
    if (failed > 0 || lockedUntil > 0) {
      await supabase.from("store_staff").update({ failed_attempts: 0, locked_until: null }).in("id", ids).eq("keeper_id", user.id);
    }
    return { ok: true };
  }

  const attempts = failed + 1;
  let until: string | null = null;
  if (attempts >= MAX_ATTEMPTS) {
    const overshoot = Math.min(4, Math.floor((attempts - MAX_ATTEMPTS) / MAX_ATTEMPTS));
    until = new Date(now + Math.min(BASE_LOCKOUT_MS * 2 ** overshoot, MAX_LOCKOUT_MS)).toISOString();
  }
  await supabase.from("store_staff").update({ failed_attempts: attempts, locked_until: until }).in("id", ids).eq("keeper_id", user.id);
  if (until) return { ok: false, error: `Wrong pass key. Too many tries: wait ${wait(Date.parse(until) - now)} before trying again.` };
  const left = MAX_ATTEMPTS - attempts;
  return { ok: false, error: `Wrong pass key. ${left} ${left === 1 ? "try" : "tries"} left before it locks.` };
}

/** For a write action: the error to show, or null when the form carried the right admin pass key. */
export async function passKeyError(form: FormData): Promise<string | null> {
  const r = await checkAdminPassKey(form.get(ADMIN_PASS_KEY_FIELD));
  return r.ok ? null : r.error;
}
