import React from "react";
import type { Metadata } from "next";
import { BrandLogo } from "@/components/ui/brand-logo";
import { AuthHero } from "@/features/auth/components/auth-hero";
import { AuthFeatureGrid } from "@/features/auth/components/auth-feature-grid";
import { AuthCard } from "@/features/auth/components/auth-card";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Sign In — Taaran AI",
  description: "Sign in with GitHub to access automated code reviews and repository intelligence.",
};

type SignInPageProps = {
  searchParams: Promise<{ callbackUrl?: string }>;
};

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const { callbackUrl } = await searchParams;

  return (
    <div className="w-full min-h-screen flex flex-col justify-between px-6 sm:px-10 lg:px-16 py-8 max-w-7xl mx-auto">
      {/* Navigation Header */}
      <header className="flex items-center justify-between py-4 border-b border-zinc-800/60 mb-8 sm:mb-12">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-100">
            <BrandLogo size={24} />
          </div>
          <span className="text-lg font-serif tracking-tight text-zinc-100 font-normal">
            Taaran AI
          </span>
        </div>

        <nav className="hidden sm:flex items-center gap-6 text-xs font-mono tracking-wider text-zinc-400 uppercase">
          <a href="#features" className="hover:text-zinc-200 transition-colors">
            Platform
          </a>
          <a href="#security" className="hover:text-zinc-200 transition-colors">
            Security
          </a>
          <a href="#docs" className="hover:text-zinc-200 transition-colors">
            Docs
          </a>
        </nav>
      </header>

      {/* Main Grid Content */}
      <main className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center my-auto py-4">
        {/* Left Editorial Section (Cols 1-7) */}
        <div className="lg:col-span-7">
          <AuthHero />
        </div>

        {/* Right Auth & Feature Showcase Column (Cols 8-12) */}
        <div className="lg:col-span-5 flex flex-col gap-8">
          <AuthCard callbackUrl={callbackUrl} />
          <AuthFeatureGrid />
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 sm:mt-24 pt-8 border-t border-zinc-800/40 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 font-mono gap-4">
        <div>© {new Date().getFullYear()} Taaran AI Inc. All rights reserved.</div>
        <div className="flex items-center gap-6">
          <a href="#privacy" className="hover:text-zinc-400 transition-colors">
            Privacy Policy
          </a>
          <a href="#terms" className="hover:text-zinc-400 transition-colors">
            Terms of Service
          </a>
          <a href="#status" className="hover:text-zinc-400 transition-colors">
            System Status
          </a>
        </div>
      </footer>
    </div>
  );
}