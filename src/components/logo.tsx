import Image from "next/image";
import Link from "next/link";

/**
 * The Doline Store lockup: the app's own launcher mark (white house and pin on brand blue) and
 * the name, always written "Doline Store".
 *  - "color": the blue mark, for light grounds and the dark footer.
 *  - "white": the white knockout mark, for a brand-blue ground.
 */
export function Logo({
  href = "/",
  variant = "color",
  size = 40,
  textClass = "text-[26px] text-primary",
}: {
  href?: string;
  variant?: "color" | "white";
  size?: number;
  textClass?: string;
}) {
  return (
    <Link href={href} className="flex items-center gap-2.5 no-underline">
      {variant === "color" ? (
        <Image src="/logo.png" alt="" width={size} height={size} className="rounded-sm" priority />
      ) : (
        <Image src="/logo-white.png" alt="" width={Math.round(size * 0.85)} height={Math.round(size * 0.85 * (309 / 304))} priority />
      )}
      <span className={`font-display font-extrabold tracking-[-0.01em] whitespace-nowrap ${textClass}`}>Doline Store</span>
    </Link>
  );
}
