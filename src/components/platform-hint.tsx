"use client";

import { useSyncExternalStore } from "react";

type Os = "android" | "ios" | "windows" | "mac" | "other";

/** The browser's operating system, from Client Hints where offered, else the user agent. */
function detect(): Os {
  const nav = navigator as Navigator & { userAgentData?: { platform?: string } };
  const hint = nav.userAgentData?.platform?.toLowerCase() ?? "";
  const ua = navigator.userAgent.toLowerCase();
  if (hint === "android" || ua.includes("android")) return "android";
  if (hint === "ios" || /iphone|ipad|ipod/.test(ua) || (ua.includes("macintosh") && navigator.maxTouchPoints > 1)) return "ios";
  if (hint === "windows" || ua.includes("windows")) return "windows";
  if (hint === "macos" || ua.includes("mac os")) return "mac";
  return "other";
}

const subscribe = () => () => {};

/**
 * A line under the download page's heading that speaks to the device it's read on. The server
 * can't see the device, so nothing shows until the page has loaded.
 */
export function PlatformHint({ available }: { available: string[] }) {
  const os = useSyncExternalStore<Os | null>(subscribe, detect, () => null);
  if (!os) return null;

  let text: string;
  if (available.includes(os)) text = `You're on ${os === "android" ? "an Android device" : "Windows"} — your download is below.`;
  else if (os === "ios") text = "Doline Store isn't on iPhone or iPad yet. Open this page on an Android phone or tablet to install it.";
  else text = "Doline Store runs on Android phones and tablets. Open this page on one to install it, or download the file here and copy it over.";

  return <p className="m-0 rounded-sm bg-primary-container px-4 py-3 text-[15px] font-semibold text-on-primary-container">{text}</p>;
}
