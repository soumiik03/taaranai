import React from "react";
import { GithubSignInForm } from "./github-sign-in-form";

type AuthCardProps = {
  callbackURL?: string;
};

export function AuthCard({ callbackURL }: AuthCardProps) {
  return (
    <div className="w-full max-w-md mx-auto rounded-none border border-[#262626] bg-[#0D0D0F] p-5 space-y-4 font-sans">
      <div className="space-y-1 text-center">
        <h2 className="text-lg font-bold tracking-tight text-[#FAFAFA]">
          Sign In to Taaran AI
        </h2>
        <p className="text-xs text-[#8B8B92]">
          Connect your account to manage pull requests and AI code reviews.
        </p>
      </div>

      <div className="space-y-3">
        <GithubSignInForm callbackURL={callbackURL} />

        <p className="text-center text-[11px] text-[#8B8B92]">
          We only request permissions required to inspect code repositories.
        </p>
      </div>
    </div>
  );
}
