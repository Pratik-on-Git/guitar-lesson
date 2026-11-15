"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import { ArrowRight, Eye, EyeOff, LoaderCircle } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthShowcase } from "./auth-showcase";
import { safeReturnTo } from "@/lib/auth-navigation";
import "./auth.css";

export function AuthForm({ mode, googleEnabled }: { mode: "sign-in" | "sign-up"; googleEnabled: boolean }) {
  const signup = mode === "sign-up";
  const params = useSearchParams();
  const destination = safeReturnTo(params.get("next"));
  const nextQuery = destination === "/" ? "" : `?next=${encodeURIComponent(destination)}`;
  const [visible, setVisible] = useState(false);
  const [pending, setPending] = useState<"email" | "google" | null>(null);
  const [error, setError] = useState("");
  const { data: session, isPending: checking } = authClient.useSession();
  const oauthError = params.has("error") ? "Google sign-in was cancelled or could not be completed. Please try again." : "";

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email")).trim().toLowerCase();
    const password = String(form.get("password"));
    const name = String(form.get("name") ?? "").trim();
    setError("");
    if (signup && name.length < 2) { setError("Please enter a name with at least 2 characters."); return; }
    if (signup && password !== form.get("confirmPassword")) { setError("Your passwords don’t match."); return; }
    setPending("email");
    try {
      const result = signup
        ? await authClient.signUp.email({ name, email, password })
        : await authClient.signIn.email({ email, password });
      if (result.error) {
        setError(result.error.status === 429 ? "Too many attempts. Please wait a minute and try again." : signup ? "We couldn’t create your account. This email may already be registered. Try signing in." : "We couldn’t sign you in. Check your email and password and try again.");
      } else {
        window.location.replace(destination);
      }
    } catch { setError("Unable to connect. Please check your connection and try again."); }
    finally { setPending(null); }
  }

  async function google() {
    setPending("google"); setError("");
    try {
      const result = await authClient.signIn.social({ provider: "google", callbackURL: destination, errorCallbackURL: `/${mode}?error=google&next=${encodeURIComponent(destination)}` });
      if (result.error) { setError("Google sign-in could not start. Please try again."); setPending(null); }
    } catch { setError("Unable to connect to Google. Please try again."); setPending(null); }
  }

  return <div className="auth-layout">
    <AuthShowcase />
    <section className="auth-panel" aria-labelledby={`${mode}-title`}>
      <div className="auth-form-wrap">
        <p className="text-primary text-xs font-medium">Your personal study companion</p>
        <h1 id={`${mode}-title`} className="mt-2 text-3xl font-semibold tracking-tight">{signup ? "Create your account" : "Welcome back"}</h1>
        <p className="text-muted-foreground mt-3 text-sm leading-relaxed">{signup ? "A space for your musical journey. Let’s get started." : "Sign in to your Guitar Notes account."}</p>
        {!checking && session ? <div className="mt-8 space-y-4"><p className="text-sm">You’re signed in as {session.user.email}.</p><Link href={destination} className={buttonVariants()}>Enter your study space<ArrowRight aria-hidden /></Link></div> : <>
          <Button variant="outline" className="mt-7 w-full" onClick={google} disabled={!googleEnabled || pending !== null} aria-describedby={!googleEnabled ? "google-unavailable" : undefined}>
            {pending === "google" ? <LoaderCircle className="animate-spin" aria-hidden /> : <GoogleIcon />}Continue with Google
          </Button>
          {!googleEnabled && <p id="google-unavailable" className="text-muted-foreground mt-2 text-xs">Google sign-in will be available soon. You can use email below.</p>}
          <div className="auth-divider"><span />or continue with email<span /></div>
          <form onSubmit={submit} className="space-y-4" aria-busy={pending !== null}>
            {signup && <div className="space-y-2"><label htmlFor={`${mode}-name`} className="text-sm font-medium">Full name</label><Input id={`${mode}-name`} name="name" autoComplete="name" placeholder="Your name" required minLength={2} maxLength={100} disabled={pending !== null} /></div>}
            <div className="space-y-2"><label htmlFor={`${mode}-email`} className="text-sm font-medium">Email address</label><Input id={`${mode}-email`} name="email" type="email" autoComplete="email" placeholder="you@example.com" required maxLength={254} disabled={pending !== null} /></div>
            <div className="space-y-2"><label htmlFor={`${mode}-password`} className="text-sm font-medium">Password</label><div className="relative"><Input id={`${mode}-password`} name="password" type={visible ? "text" : "password"} autoComplete={signup ? "new-password" : "current-password"} required minLength={signup ? 8 : 1} maxLength={128} className="pr-12" aria-describedby={signup ? "password-help" : undefined} disabled={pending !== null} /><button type="button" onClick={() => setVisible(!visible)} className="auth-password-toggle" aria-label={visible ? "Hide password" : "Show password"}>{visible ? <EyeOff aria-hidden /> : <Eye aria-hidden />}</button></div>{signup && <p id="password-help" className="text-muted-foreground text-xs">Use at least 8 characters.</p>}</div>
            {signup && <div className="space-y-2"><label htmlFor={`${mode}-confirmPassword`} className="text-sm font-medium">Confirm password</label><Input id={`${mode}-confirmPassword`} name="confirmPassword" type={visible ? "text" : "password"} autoComplete="new-password" required minLength={8} maxLength={128} disabled={pending !== null} /></div>}
            {(error || oauthError) && <p role="alert" className="rounded-md border border-destructive/25 bg-destructive/10 p-3 text-sm text-destructive">{error || oauthError}</p>}
            <Button type="submit" className="w-full" disabled={pending !== null}>{pending === "email" ? <LoaderCircle className="animate-spin" aria-hidden /> : null}{pending === "email" ? "Please wait…" : signup ? "Create account" : "Sign in"}<ArrowRight aria-hidden /></Button>
          </form>
          <p className="text-muted-foreground mt-6 text-center text-sm">{signup ? "Already have an account?" : "New to Guitar Notes?"} <Link href={`${signup ? "/sign-in" : "/sign-up"}${nextQuery}`} className="text-primary font-medium underline-offset-4 hover:underline">{signup ? "Sign in" : "Create an account"}</Link></p>
        </>}
        <p className="text-muted-foreground mt-8 border-t pt-5 text-xs leading-relaxed">Sign in to explore your lessons and practice tools. Study progress and practice sessions are currently saved in this browser.</p>
      </div>
    </section>
  </div>;
}

function GoogleIcon() {
  return <svg viewBox="0 0 24 24" className="size-4" aria-hidden><path fill="#4285F4" d="M21.6 12.23c0-.71-.06-1.39-.18-2.05H12v3.88h5.38a4.6 4.6 0 0 1-2 3.02v2.51h3.24c1.9-1.75 2.98-4.32 2.98-7.36Z" /><path fill="#34A853" d="M12 22c2.7 0 4.96-.9 6.62-2.41l-3.24-2.51c-.9.6-2.05.96-3.38.96-2.6 0-4.8-1.76-5.59-4.12H3.07v2.59A10 10 0 0 0 12 22Z" /><path fill="#FBBC05" d="M6.41 13.92a6 6 0 0 1 0-3.84V7.49H3.07a10 10 0 0 0 0 9.02l3.34-2.59Z" /><path fill="#EA4335" d="M12 5.96c1.47 0 2.79.5 3.82 1.5l2.86-2.87A9.6 9.6 0 0 0 12 2a10 10 0 0 0-8.93 5.49l3.34 2.59A5.99 5.99 0 0 1 12 5.96Z" /></svg>;
}
