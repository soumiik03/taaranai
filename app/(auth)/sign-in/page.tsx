import type { Metadata } from "next";
import { GithubSignInForm, GitHubIcon } from "@/features/auth/components/github-sign-in-form";
import { Code2 } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Sign in - Taaran AI",
  description: "Sign in to your Taaran AI workspace.",
};

type SignInPageProps = {
  searchParams: Promise<{ callbackURL?: string }>;
};

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const { callbackURL } = await searchParams;

  return (
    <div className="w-full space-y-6 text-center font-sans">
      {/* Title */}
      <div className="space-y-1.5">
        <h1 className="text-xl font-bold tracking-tight text-[#FAFAFA]">
          Sign In to Taaran AI
        </h1>
        <p className="text-xs text-[#8B8B92]">
          Select your provider to log into your workspace
        </p>
      </div>

      {/* Provider Selector Boxes (Plain #262626 border, rounded-none) */}
      <div className="grid grid-cols-2 gap-2 pt-1">
        <div className="flex items-center justify-center gap-2 p-2.5 rounded-none border border-[#262626] bg-[#1F1F23] text-xs font-semibold text-[#FAFAFA]">
          <GitHubIcon className="size-4 text-[#FAFAFA]" />
          <span>GitHub</span>
        </div>
        <div className="flex items-center justify-center gap-2 p-2.5 rounded-none border border-[#262626] bg-[#0D0D0F] text-xs font-medium text-[#8B8B92] opacity-60 cursor-not-allowed">
          <Code2 className="size-4 text-[#8B8B92]" />
          <span>GitLab</span>
        </div>
      </div>

      {/* Main Action Container (Flat #0D0D0F surface, 1px #262626 border, rounded-none) */}
      <div className="rounded-none border border-[#262626] bg-[#0D0D0F] p-5 space-y-4 text-left">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-[#FAFAFA] block">
            Authentication Provider
          </label>
          <p className="text-xs text-[#8B8B92]">
            Authenticate using your GitHub account permissions.
          </p>
        </div>

        <GithubSignInForm callbackURL={callbackURL} />

        <div className="pt-1 text-center space-y-1.5">
          <p className="text-[11px] text-[#8B8B92]">
            Need an account?{" "}
            <Link href="/sign-in" className="text-[#6C5DD3] hover:underline font-medium">
              Sign up
            </Link>
          </p>
          <p className="text-[11px] text-[#8B8B92]">
            By signing in, you agree to our{" "}
            <a href="#" className="text-[#6C5DD3] hover:underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-[#6C5DD3] hover:underline">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}