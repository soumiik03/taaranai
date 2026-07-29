import React from "react";

export function AuthHero() {
  return (
    <div className="flex flex-col justify-between h-full py-4 lg:py-8 pr-0 lg:pr-8">
      {/* Top Tagline */}
      <div className="space-y-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/60 px-3 py-1 text-xs text-zinc-400 font-mono">
          <span className="relative flex size-2">
            <span className="absolute inline-flex h-full w-full animate-pulse rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
          </span>
          AI Code Intelligence Platform
        </div>

        {/* Large Editorial Serif Display Heading */}
        <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight leading-[1.02] text-zinc-100 font-normal">
          Built for teams <br />
          <span className="italic font-normal text-zinc-300">with standards.</span>
        </h1>

        {/* Lead Description */}
        <p className="text-zinc-400 text-base sm:text-lg leading-relaxed max-w-xl font-light">
          Private workflows, automated pull request analysis, custom models, and production support for teams that need code generation and review to become reliable.
        </p>
      </div>

      {/* Partners / Trust Ticker Bar */}
      <div className="mt-12 lg:mt-24 space-y-8">
        <div className="flex flex-wrap items-center gap-x-8 gap-y-4 text-xs font-mono text-zinc-500 tracking-widest uppercase opacity-80">
          <span className="hover:text-zinc-300 transition-colors">VISTAPRINT</span>
          <span className="hover:text-zinc-300 transition-colors font-bold tracking-wider">GAMMA</span>
          <span className="hover:text-zinc-300 transition-colors font-serif italic capitalize text-sm">Canva</span>
          <span className="hover:text-zinc-300 transition-colors font-bold">NETFLIX</span>
          <span className="hover:text-zinc-300 transition-colors font-semibold">ADOBE</span>
        </div>

        {/* Bottom Pill Action Buttons */}
        <div className="flex items-center gap-3">
          <a
            href="#features"
            className="px-5 py-2.5 rounded-full border border-zinc-800 bg-zinc-950/80 text-zinc-300 text-sm font-medium hover:border-zinc-700 hover:text-white transition-all duration-200"
          >
            Learn more
          </a>
          <a
            href="mailto:contact@taaran.ai"
            className="px-5 py-2.5 rounded-full bg-zinc-100 text-zinc-950 text-sm font-medium hover:bg-white transition-all duration-200 shadow-sm"
          >
            Contact sales
          </a>
        </div>
      </div>
    </div>
  );
}
