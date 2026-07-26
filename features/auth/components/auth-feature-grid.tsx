import React from "react";

interface FeatureCardProps {
  label: string;
  description: string;
}

const features: FeatureCardProps[] = [
  {
    label: "SCALE",
    description: "High-volume analysis for pull requests, microservices, and marketing systems.",
  },
  {
    label: "BRAND & ARCHITECTURE",
    description: "Custom models that keep team standards and architectural patterns intact at speed.",
  },
  {
    label: "PRIVACY & SECURITY",
    description: "Isolated workflows designed for serious engineering teams and sensitive codebases.",
  },
  {
    label: "ENTERPRISE SUPPORT",
    description: "Production guidance and dedicated SLAs when AI becomes part of your primary dev stack.",
  },
];

export function AuthFeatureGrid() {
  return (
    <div className="flex flex-col gap-4">
      {features.map((feature, idx) => (
        <div
          key={idx}
          className="group relative rounded-xl border border-zinc-800/80 bg-zinc-950/40 p-5 transition-all duration-300 hover:border-zinc-700/80 hover:bg-zinc-900/30"
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-block size-1.5 rounded-full bg-zinc-500 group-hover:bg-zinc-300 transition-colors" />
            <span className="text-[11px] font-mono tracking-widest text-zinc-400 uppercase font-medium">
              {feature.label}
            </span>
          </div>
          <p className="text-sm text-zinc-400 font-light leading-relaxed group-hover:text-zinc-300 transition-colors">
            {feature.description}
          </p>
        </div>
      ))}
    </div>
  );
}
