"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { wroteRecently } from "@/components/admin-pass-key";
import { createClient } from "@/lib/supabase/client";
import { DEVICE_COOKIE } from "@/lib/device";

/** A burst of writes (several lines of one sale, a till catching up) is one refresh once it settles. */
const DEBOUNCE_MS = 1000;

function thisDevice(): string | undefined {
  return document.cookie
    .split("; ")
    .find((c) => c.startsWith(`${DEVICE_COOKIE}=`))
    ?.slice(DEVICE_COOKIE.length + 1);
}

/** The writer's device, as the cloud put it: on the payload itself or a "payload" object inside it. */
function writerOf(message: Record<string, unknown>): string | undefined {
  const p = message.payload as { device?: unknown; payload?: { device?: unknown } } | undefined;
  const d = p?.device ?? p?.payload?.device;
  return typeof d === "string" ? d : undefined;
}

/**
 * Keeps the open store live: a sale rung up on a till, an order placed on the marketplace or a
 * change made in another tab shows here within seconds, without reloading.
 *
 * The web counterpart of the desktop app's RealtimeSync. The cloud sends one "change" message
 * per store per write transaction on the private topic store:<id> (private.broadcast_store_change),
 * which only store keepers may join (realtime.messages policy store_keepers_receive_store_changes).
 * The message says only which store changed, so the page re-renders its server data with
 * router.refresh(), which keeps form input and other client state.
 *
 * A message carries the writer's device id (lib/device). One from this browser, right after this
 * tab saved something, is the echo of that save, which already re-rendered the page, so it's
 * ignored. One from this browser otherwise came from another of its tabs, and is applied.
 *
 * A message sent while the socket was down is lost, so every rejoin after the first refreshes to
 * catch up. A tab in the background doesn't refresh; it does so once it's looked at again.
 */
export function LiveStore({ storeId }: { storeId: string }) {
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    let cancelled = false;
    let joined = false;
    let stale = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let channel: ReturnType<typeof supabase.channel> | undefined;

    const refreshNow = () => {
      if (document.visibilityState === "visible") {
        stale = false;
        router.refresh();
      } else {
        stale = true;
      }
    };
    const refreshSoon = () => {
      clearTimeout(timer);
      timer = setTimeout(refreshNow, DEBOUNCE_MS);
    };
    const onVisible = () => {
      if (stale && document.visibilityState === "visible") refreshNow();
    };
    document.addEventListener("visibilitychange", onVisible);

    (async () => {
      // A private channel is authorised with the signed-in user's token; supabase-js keeps it
      // current as the session refreshes.
      await supabase.realtime.setAuth();
      if (cancelled) return;
      channel = supabase
        .channel(`store:${storeId}`, { config: { private: true } })
        .on("broadcast", { event: "change" }, (message) => {
          const writer = writerOf(message);
          if (writer && writer === thisDevice() && wroteRecently()) return;
          refreshSoon();
        })
        .subscribe((status) => {
          if (status !== "SUBSCRIBED") return;
          // The page was just rendered on the first join; a later join may have missed messages.
          if (joined) refreshSoon();
          joined = true;
        });
    })();

    return () => {
      cancelled = true;
      clearTimeout(timer);
      document.removeEventListener("visibilitychange", onVisible);
      if (channel) supabase.removeChannel(channel);
    };
  }, [storeId, router]);

  return null;
}
