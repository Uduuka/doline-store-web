"use client";

import Link from "next/link";
import { useActionState, useEffect, useState } from "react";
import { sendCode, signInWithGoogle, verifyCode, type OtpState } from "./actions";
import { Field, FormMessage, SubmitButton } from "@/components/form-bits";
import { GoogleMark } from "@/components/google-mark";

/**
 * Passwordless sign-in and sign-up: Google, or an emailed one-time code.
 * Step one asks for the email (and, to sign up, a name); step two asks for the code.
 */
export function OtpFlow({ mode, next, error }: { mode: "sign-in" | "sign-up"; next?: string; error?: string }) {
  const signUp = mode === "sign-up";
  const [sent, send] = useActionState<OtpState, FormData>(sendCode, error ? { step: "email", error } : undefined);
  const [checked, check] = useActionState<OtpState, FormData>(verifyCode, undefined);
  const [step, setStep] = useState<"email" | "code">("email");
  const [email, setEmail] = useState("");
  const [cooldown, setCooldown] = useState(0);

  // Move to the code step once a code has gone out, and hold "Send again" for 60 seconds.
  useEffect(() => {
    if (sent?.step === "code") {
      setEmail(sent.email);
      setStep("code");
      setCooldown(60);
    }
  }, [sent]);
  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const codeState = checked?.error ? checked : sent?.step === "code" ? sent : undefined;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="m-0 text-[32px] leading-tight font-extrabold">
          {step === "code" ? "Check your email" : signUp ? "Create your store" : "Sign in"}
        </h1>
        {step === "code" ? (
          <p className="m-0 text-[15px] leading-relaxed text-ink-2">
            Enter the code we sent to <strong className="text-ink">{email}</strong>. It works for a few minutes.
          </p>
        ) : (
          <p className="m-0 text-[15px] text-ink-2">
            {signUp ? "Already have an account? " : "New to Doline Store? "}
            <Link href={signUp ? "/sign-in" : "/sign-up"} className="font-bold text-primary">
              {signUp ? "Sign in" : "Create a store"}
            </Link>
          </p>
        )}
      </div>

      {signUp && (
        <ol aria-label="Steps" className="m-0 flex list-none gap-2 p-0">
          <li className="flex flex-1 flex-col gap-2">
            <span className="h-1 rounded-sm bg-primary" />
            <span className="text-[13px] font-bold text-primary">1 · Your account</span>
          </li>
          <li className="flex flex-1 flex-col gap-2">
            <span className="h-1 rounded-sm bg-outline-variant" />
            <span className="text-[13px] font-bold text-ink-2">2 · Your store</span>
          </li>
        </ol>
      )}

      {step === "email" ? (
        <>
          <form action={signInWithGoogle}>
            <input type="hidden" name="next" value={signUp ? "/onboarding" : (next ?? "")} />
            <button type="submit" className="btn btn-default w-full text-ink">
              <GoogleMark /> {signUp ? "Sign up with Google" : "Continue with Google"}
            </button>
          </form>

          <div className="flex items-center gap-3 text-[13px] text-ink-2">
            <span className="h-px flex-1 bg-outline-variant" />
            or with your email
            <span className="h-px flex-1 bg-outline-variant" />
          </div>

          <form action={send} className="flex flex-col gap-6">
            <input type="hidden" name="mode" value={mode} />
            <input type="hidden" name="next" value={next ?? ""} />
            <FormMessage state={sent?.step === "email" ? sent : undefined} />
            {signUp && <Field id="full_name" label="Full name" autoComplete="name" placeholder="Your name" required />}
            <Field id="email" label="Email" type="email" autoComplete="email" placeholder="you@shop.com" defaultValue={email} required />
            {signUp && <Field id="phone" label="Phone" type="tel" autoComplete="tel" placeholder="+256 7XX XXX XXX" hint="Optional. For your store's contact details." />}
            <SubmitButton pendingText="Sending code…">Email me a code</SubmitButton>
          </form>
        </>
      ) : (
        <>
          <form action={check} className="flex flex-col gap-6">
            <input type="hidden" name="mode" value={mode} />
            <input type="hidden" name="next" value={next ?? ""} />
            <input type="hidden" name="email" value={email} />
            <FormMessage state={codeState} />
            <div className="flex flex-col gap-1">
              <label htmlFor="token" className="label">
                Code
              </label>
              <input
                id="token"
                name="token"
                inputMode="numeric"
                autoComplete="one-time-code"
                pattern="[0-9]*"
                maxLength={8}
                placeholder="123456"
                required
                autoFocus
                className="field text-center text-2xl font-bold tracking-[0.4em]"
              />
            </div>
            <SubmitButton pendingText="Checking…">{signUp ? "Verify and continue" : "Sign in"}</SubmitButton>
          </form>

          <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
            <button type="button" onClick={() => setStep("email")} className="min-h-11 font-bold text-primary">
              Use a different email
            </button>
            <form action={send}>
              <input type="hidden" name="mode" value={mode} />
              <input type="hidden" name="next" value={next ?? ""} />
              <input type="hidden" name="email" value={email} />
              <button type="submit" disabled={cooldown > 0} className="min-h-11 font-bold text-primary disabled:text-ink-2">
                {cooldown > 0 ? `Send again in ${cooldown}s` : "Send a new code"}
              </button>
            </form>
          </div>
        </>
      )}

      <p className="m-0 text-[13px] leading-relaxed text-ink-2">
        By continuing you agree to the{" "}
        <Link href="/terms" className="font-bold text-primary">
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link href="/privacy" className="font-bold text-primary">
          Privacy Policy
        </Link>
        .
      </p>
    </div>
  );
}
