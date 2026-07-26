import React from "react";
import type { Metadata } from "next";
import { BrandLogo } from "@/components/ui/brand-logo";
import { GithubSignInForm } from "@/features/auth/components/github-sign-in-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldSet,
} from "@/components/ui/field";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in with your GitHub account.",
};

type SignInPageProps = {
  searchParams: Promise<{ callbackUrl?: string }>;
};

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const { callbackUrl } = await searchParams;

  return (
    <Card className="border-zinc-800/80 bg-[#1f1f23]/90 text-zinc-100 shadow-2xl shadow-black/60 rounded-2xl p-2 border">
      <CardHeader className="items-center text-center pb-2 pt-6">
        <div className="mb-4 flex justify-center">
          <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800/80 flex items-center justify-center text-white shadow-inner">
            <BrandLogo size={36} />
          </div>
        </div>
        <CardTitle className="text-2xl font-serif font-normal tracking-tight text-zinc-100">
          Welcome back
        </CardTitle>
        <CardDescription className="text-zinc-400 text-sm font-light mt-1.5 px-2">
          Sign in with GitHub to review and manage your code.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4 pb-6">
        <FieldSet>
          <FieldGroup>
            <Field>
              <GithubSignInForm callbackUrl={callbackUrl} />
              <FieldDescription className="text-center text-xs text-zinc-500 font-light mt-4 leading-relaxed px-1">
                We only request the permissions needed to identify your
                account. You can revoke access anytime from GitHub settings.
              </FieldDescription>
            </Field>
          </FieldGroup>
        </FieldSet>
      </CardContent>
    </Card>
  );
}