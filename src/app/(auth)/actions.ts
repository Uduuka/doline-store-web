"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/**
 * Sign-in and sign-up are passwordless, as in the apps: a one-time code emailed to the address,
 * or Google. Step one sends the code (signInWithOtp), step two checks it (verifyOtp).
 */
export type OtpState =
  | { step: "email"; error?: string }
  | { step: "code"; email: string; message?: string; error?: string }
  | undefined;

/** Only same-site paths: never an absolute URL someone put in ?next=. */
function safeNext(next: FormDataEntryValue | string | null | undefined, fallback = "/dashboard"): string {
  const v = typeof next === "string" ? next : "";
  return v.startsWith("/") && !v.startsWith("//") ? v : fallback;
}

async function siteUrl(): Promise<string> {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}

function friendly(message: string): string {
  if (/signups? not allowed|user not found/i.test(message)) return "No account uses that email yet. Create your store instead.";
  if (/expired|invalid/i.test(message)) return "That code is wrong or has expired. Check it, or send a new one.";
  if (/rate limit|security purposes|too many/i.test(message)) return "Too many codes asked for. Wait a minute, then try again.";
  if (/email address .* invalid|invalid email/i.test(message)) return "That email address doesn't look right.";
  return message;
}

const isEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

/** Step one: email a sign-in code. `mode` sign-up creates the account; sign-in only for existing ones. */
export async function sendCode(prev: OtpState, form: FormData): Promise<OtpState> {
  const mode = String(form.get("mode")) === "sign-up" ? "sign-up" : "sign-in";
  const email = String(form.get("email") ?? (prev?.step === "code" ? prev.email : "")).trim().toLowerCase();
  const fullName = String(form.get("full_name") ?? "").trim();
  const phone = String(form.get("phone") ?? "").trim();

  if (!isEmail(email)) return { step: "email", error: "Enter a valid email address." };
  if (mode === "sign-up" && !fullName) return { step: "email", error: "Enter your name." };

  const supabase = await createClient();
  const next = mode === "sign-up" ? "/onboarding" : safeNext(form.get("next"));
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: mode === "sign-up",
      data: mode === "sign-up" ? { full_name: fullName, phone: phone || null } : undefined,
      // The same email also carries a link, for anyone who'd rather tap than type.
      emailRedirectTo: `${await siteUrl()}/auth/confirm?next=${encodeURIComponent(next)}`,
    },
  });
  if (error) {
    return prev?.step === "code" ? { step: "code", email, error: friendly(error.message) } : { step: "email", error: friendly(error.message) };
  }
  return { step: "code", email, message: `We sent a code to ${email}.` };
}

/** Step two: check the code and start the session. */
export async function verifyCode(prev: OtpState, form: FormData): Promise<OtpState> {
  const email = String(form.get("email") ?? "").trim().toLowerCase();
  const token = String(form.get("token") ?? "").replace(/\D/g, "");
  const mode = String(form.get("mode")) === "sign-up" ? "sign-up" : "sign-in";
  if (token.length < 6) return { step: "code", email, error: "Enter the code from the email." };

  const supabase = await createClient();
  const { error } = await supabase.auth.verifyOtp({ email, token, type: "email" });
  if (error) return { step: "code", email, error: friendly(error.message) };

  redirect(mode === "sign-up" ? "/onboarding" : safeNext(form.get("next")));
}

export async function signInWithGoogle(form: FormData) {
  const supabase = await createClient();
  const next = safeNext(form.get("next"));
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: `${await siteUrl()}/auth/confirm?next=${encodeURIComponent(next)}` },
  });
  if (error || !data.url) redirect(`/sign-in?error=${encodeURIComponent("Google sign-in isn't available right now. Use your email instead.")}`);
  redirect(data.url);
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/sign-in");
}
