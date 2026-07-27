import React from "react";
import { AuthHero } from "@/features/auth/components/auth-hero";
import { AuthCard } from "@/features/auth/components/auth-card";
import { AuthFeatureGrid } from "@/features/auth/components/auth-feature-grid";
import { getServerSession } from "@/features/auth/actions";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function Home() {
  const session = await getServerSession();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen bg-[#0b0b0d] text-zinc-100 selection:bg-zinc-800 selection:text-zinc-100 flex flex-col justify-center py-12 px-6 lg:px-12">
      <div className="mx-auto max-w-7xl w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7">
          <AuthHero />
        </div>
        <div className="lg:col-span-5 flex flex-col gap-8">
          <AuthCard />
          <div id="features" className="pt-4">
            <AuthFeatureGrid />
          </div>
        </div>
      </div>
    </main>
  );
}

