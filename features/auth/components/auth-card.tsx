import React from "react";
import { BrandLogo } from "@/components/ui/brand-logo";
import { GithubSignInForm } from "./github-sign-in-form";

type AuthCardProps = {
  callbackURL?: string;
};

export function AuthCard({ callbackURL }: AuthCardProps) {
  return (
    <div className="relative group w-full max-w-md mx-auto">
      {/* Subtle outer glow effect */}
      <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-b from-zinc-700/40 via-zinc-800/10 to-transparent opacity-75 blur-sm transition duration-500 group-hover:opacity-100" />

      {/* Main obsidian glass container */}
      <div className="relative flex flex-col items-center rounded-2xl border border-zinc-800/90 bg-[#111114]/90 p-8 sm:p-10 backdrop-blur-xl shadow-2xl shadow-black/90">
        
        {/* Brand Icon Header */}
        <div className="relative mb-8 flex items-center justify-center px-5 py-3.5 rounded-xl bg-zinc-900/90 border border-zinc-800 shadow-inner">
          <BrandLogo size={36} className="text-zinc-100" />
        </div>

        {/* Title & Subtitle */}
        <div className="text-center space-y-2 mb-8">
          <h2 className="text-2xl font-serif text-zinc-100 tracking-tight">
            Welcome back
          </h2>
          <p className="text-sm text-zinc-400 font-light leading-relaxed max-w-xs mx-auto">
            Sign in with GitHub to review, analyze, and manage your code repositories.
          </p>
        </div>

        {/* Form Action */}
        <div className="w-full space-y-6">
          <GithubSignInForm callbackURL={callbackURL} />

          {/* Footnote */}
          <p className="text-center text-xs text-zinc-500 font-light leading-relaxed px-2">
            We only request permissions needed to identify your account. You can revoke access anytime from GitHub settings.
          </p>
        </div>

        {/* Divider & Privacy tag */}
        <div className="mt-8 pt-6 w-full border-t border-zinc-800/60 flex items-center justify-between text-[11px] text-zinc-500 font-mono">
          <span className="flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-emerald-500 inline-block" />
            256-bit Encrypted
          </span>
          <span>SOC2 Compliant</span>
        </div>
      </div>
    </div>
  );
}
