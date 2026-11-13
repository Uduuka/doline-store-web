"use client";

import { useSyncExternalStore } from "react";
import { Icon } from "@/components/icons";

export const ANDROID_APK_URL =
  process.env.NEXT_PUBLIC_ANDROID_APK_URL ||
  "https://okpjiokdkxpduvhoxcyk.supabase.co/storage/v1/object/public/apps/android/doline-store-1.6.5.apk";

type Platform = "Android" | "iOS" | "Windows" | "macOS" | "ChromeOS" | "Linux" | "your device";

/** The browser's operating system, from Client Hints where offered, else the user agent. */
function detectPlatform(): Platform {
  const nav = navigator as Navigator & { userAgentData?: { platform?: string } };
  const hint = nav.userAgentData?.platform?.toLowerCase() ?? "";
  const ua = navigator.userAgent.toLowerCase();

  if (hint === "android" || ua.includes("android")) return "Android";
  if (hint === "ios" || /iphone|ipad|ipod/.test(ua)) return "iOS";
  // iPadOS reports itself as a Mac; a touch screen gives it away.
  if (ua.includes("macintosh") && navigator.maxTouchPoints > 1) return "iOS";
  if (hint === "windows" || ua.includes("windows")) return "Windows";
  if (hint === "macos" || ua.includes("mac os")) return "macOS";
  if (hint === "chrome os" || hint === "chromeos" || ua.includes("cros")) return "ChromeOS";
  if (hint === "linux" || ua.includes("linux")) return "Linux";
  return "your device";
}

const subscribe = () => () => {};

/**
 * On an Android phone, a button that downloads the app's .apk. Anywhere else, a disabled
 * "Coming soon" button naming the platform. The server can't see the device, so it renders a
 * neutral disabled button that becomes the right one once the page loads.
 */
export function DownloadButton({ className = "" }: { className?: string }) {
  const platform = useSyncExternalStore<Platform | null>(subscribe, detectPlatform, () => null);
  const base = `btn h-[52px] px-6 text-base ${className}`;

  if (platform === "Android") {
    return (
      <a href={ANDROID_APK_URL} download className={`${base} btn-tonal`} style={{ letterSpacing: 1 }}>
        <Icon name="download" size={20} strokeWidth={2.5} /> Download for Android
      </a>
    );
  }

  return (
    <button
      type="button"
      disabled
      aria-disabled="true"
      className={`${base} btn-default cursor-not-allowed opacity-60`}
      style={{ letterSpacing: 1 }}
    >
      <Icon name="download" size={20} strokeWidth={2.5} />
      {platform ? `Coming soon on ${platform}` : "Get the app"}
    </button>
  );
}
