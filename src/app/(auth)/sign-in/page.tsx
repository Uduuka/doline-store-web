import type { Metadata } from "next";
import { OtpFlow } from "../otp-flow";

export const metadata: Metadata = { title: "Sign in" };

export default async function SignInPage({ searchParams }: { searchParams: Promise<{ next?: string; error?: string }> }) {
  const { next, error } = await searchParams;
  return <OtpFlow mode="sign-in" next={next} error={error} />;
}
