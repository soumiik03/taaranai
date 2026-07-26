import { requireUnauth } from "@/features/auth/actions";

export const dynamic = "force-dynamic";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireUnauth();

  return (
    <div className="flex min-h-screen flex-1 flex-col items-center justify-center bg-[#171719] text-zinc-100 px-4 py-12 selection:bg-zinc-800 selection:text-white">
      <div className="w-full max-w-sm">{children}</div>
    </div>
  );
}