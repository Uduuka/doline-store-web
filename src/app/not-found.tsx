import Link from "next/link";
import { Logo } from "@/components/logo";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-ground p-6 text-center">
      <Logo />
      <h1 className="m-0 text-3xl font-extrabold">This page isn&apos;t here</h1>
      <p className="m-0 max-w-md text-ink-2">The link may be old, or the page has moved.</p>
      <div className="flex flex-wrap justify-center gap-3">
        <Link href="/" className="btn btn-default">
          Home
        </Link>
        <Link href="/dashboard" className="btn btn-primary">
          Go to dashboard
        </Link>
      </div>
    </div>
  );
}
