import type { Metadata } from "next";
import { OtpFlow } from "../otp-flow";

export const metadata: Metadata = { title: "Create your store" };

export default async function SignUpPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  return <OtpFlow mode="sign-up" error={error} />;
}
