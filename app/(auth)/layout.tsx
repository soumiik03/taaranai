import { requireUnauth } from "@/features/auth/actions";
import Link from "next/link";
import { Command } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireUnauth();

  return (
    <div className="flex min-h-screen flex-col bg-[#0A0A0A] text-[#FAFAFA] font-sans antialiased">
      {/* Top Header Logo (Plain monochrome icon/wordmark, no colored background box) */}
      <header className="flex h-14 items-center px-6 border-b border-[#262626]">
        <Link href="/" className="flex items-center gap-2">
          <Command className="size-4 text-[#FAFAFA]" />
          <span className="text-sm font-semibold tracking-tight text-[#FAFAFA]">
            Taaran AI
          </span>
        </Link>
      </header>

      {/* Centered Auth Content */}
      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm">{children}</div>
      </main>
    </div>
  );
}