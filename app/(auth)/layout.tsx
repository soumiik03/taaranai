import { requireUnauth } from "@/features/auth/actions";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireUnauth();

  return (
    <div className="min-h-screen w-full bg-[#0a0a0c] text-zinc-100 flex flex-col justify-between selection:bg-zinc-800 selection:text-white relative overflow-x-hidden">
      {/* Background glow & subtle ambient grid */}
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.12),rgba(255,255,255,0))]" />
      <div className="relative z-10 flex-1 flex flex-col w-full">
        {children}
      </div>
    </div>
  );
}