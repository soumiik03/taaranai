"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/lib/auth-client";

export function GitHubIcon({ className = "size-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

type GithubSignInFormProps = {
  /** Optional post-login redirect path (e.g. GitHub install callback). */
  callbackURL?: string;
};

export function GithubSignInForm({ callbackURL }: GithubSignInFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    await authClient.signIn.social({
      provider: "github",
      callbackURL: callbackURL || "/dashboard",
    });
  };

  return (
    <form onSubmit={handleSignIn} className="w-full">
      {callbackURL ? (
        <input type="hidden" name="callbackURL" value={callbackURL} />
      ) : null}
      <Button
        type="submit"
        disabled={isLoading}
        className="relative group w-full h-11 px-5 rounded-lg bg-zinc-100 text-zinc-950 hover:bg-white font-medium text-sm transition-all duration-200 shadow-sm cursor-pointer flex items-center justify-center gap-2.5 overflow-hidden"
      >
        {isLoading ? (
          <>
            <Spinner className="size-4 text-zinc-950 animate-spin" />
            <span>Redirecting to GitHub...</span>
          </>
        ) : (
          <>
            <GitHubIcon className="size-4 transition-transform group-hover:scale-110" />
            <span>Continue with GitHub</span>
          </>
        )}
      </Button>
    </form>
  );
}
