'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  Command,
  ArrowRight,
  GitBranch,
  History,
  FileText,
  Menu,
  X,
} from 'lucide-react'

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#111111] antialiased selection:bg-[#111111] selection:text-white relative overflow-x-hidden" style={{ fontFamily: 'var(--font-sans), Inter, system-ui, sans-serif' }}>
      {/* TECHNICAL GRID BACKGROUND */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-[linear-gradient(to_right,rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.03)_1px,transparent_1px)] [background-size:32px_32px] [mask-image:linear-gradient(to_bottom,black_40%,transparent_100%)]" />

      {/* ─── NAVBAR ─── */}
      <header className="fixed top-0 left-0 right-0 z-50 w-full h-14 bg-[#FAFAFA]/80 backdrop-blur-xl border-b border-[#E8E8E8]">
        <div className="max-w-6xl mx-auto h-full px-6 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-[22px] h-[22px] bg-[#111111] text-white flex items-center justify-center rounded-none">
              <Command className="w-3 h-3" />
            </div>
            <span className="text-[13px] font-semibold tracking-[-0.01em] text-[#111111]">
              Taarana
            </span>
          </Link>

          {/* Center Nav */}
          <nav className="hidden md:flex items-center gap-7 absolute left-1/2 -translate-x-1/2">
            <a href="#capabilities" className="text-[13px] font-medium text-[#999999] hover:text-[#111111] transition-colors">
              Features
            </a>
            <a href="#workflow" className="text-[13px] font-medium text-[#999999] hover:text-[#111111] transition-colors">
              How it works
            </a>
          </nav>

          {/* Right CTA */}
          <div className="hidden md:flex items-center gap-3 shrink-0">
            <Link
              href="/dashboard"
              className="group inline-flex items-center gap-1.5 bg-[#111111] text-white text-[12px] font-medium px-4 py-[7px] rounded-none hover:bg-black transition-colors"
            >
              Open Workspace
              <ArrowRight className="w-3 h-3 text-gray-500 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {/* Mobile Menu */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-[#111111] p-1 focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* MOBILE MENU OVERLAY */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-[#FAFAFA]/98 backdrop-blur-xl flex flex-col items-center justify-center">
          <div className="flex flex-col gap-6 text-center">
            <a href="#capabilities" onClick={() => setMobileMenuOpen(false)} className="text-lg font-semibold text-[#111111]">
              Features
            </a>
            <a href="#workflow" onClick={() => setMobileMenuOpen(false)} className="text-lg font-semibold text-[#111111]">
              How it works
            </a>
            <div className="w-10 h-px bg-[#E5E5E5] mx-auto my-1" />
            <Link
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-semibold text-white bg-[#111111] px-6 py-2.5 rounded-none"
            >
              Open Workspace →
            </Link>
          </div>
        </div>
      )}

      {/* MAIN CONTENT */}
      <main className="z-10 flex flex-col w-full relative pt-14">

        {/* ─── HERO ─── */}
        <section className="relative px-6 md:px-12 lg:px-20 pt-20 pb-16 max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left */}
            <div className="lg:col-span-6 space-y-7">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-none bg-white border border-[#E5E5E5] shadow-xs">
                <span className="w-1.5 h-1.5 rounded-none bg-emerald-500" />
                <span className="text-[11px] font-mono font-medium text-[#888888] tracking-tight">
                  Live · Request → Review → Ship
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-bold tracking-[-0.025em] text-[#111111] leading-[1.08]">
                Feature requests, reviewed <br />
                <span className="text-[#999999]">and shipped automatically.</span>
              </h1>

              <p className="text-[15px] text-[#666666] leading-relaxed max-w-md">
                Describe what to build. AI creates the plan, breaks it into tasks, and reviews every PR against exactly what was asked for.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <Link
                  href="/dashboard"
                  className="group inline-flex items-center gap-2 bg-[#111111] text-white text-[13px] font-medium px-5 py-2.5 rounded-none shadow-xs hover:bg-black transition-colors"
                >
                  Get Started
                  <ArrowRight className="w-3.5 h-3.5 text-gray-400 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>

            </div>

            {/* Right — Task Grounding Diagram */}
            <div className="lg:col-span-6 w-full">
              <div className="bg-white border border-[#E5E5E5] rounded-none shadow-xs p-6 md:p-8 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-[#F0F0F0] pb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-none bg-[#111111]" />
                    <span className="text-xs font-mono font-bold text-[#111111] tracking-wider uppercase">
                      HOW A REVIEW IS BUILT
                    </span>
                  </div>
                  <span className="text-[11px] font-mono font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 border border-emerald-200 rounded-none">
                    Checked against real code
                  </span>
                </div>

                {/* SVG Diagram — untouched */}
                <div className="w-full bg-[#FAFAFA] border border-[#F0F0F0] rounded-none p-6 flex justify-center items-center">
                  <svg className="w-full h-auto max-w-[460px]" viewBox="0 0 460 220" fill="none">
                    <path
                      d="M 50 110 C 110 110, 110 50, 170 50 C 230 50, 230 170, 290 170 C 350 170, 350 110, 410 110"
                      stroke="#111111"
                      strokeWidth="2"
                    />
                    <g transform="translate(50, 110)">
                      <circle r="7" fill="#111111" />
                      <text x="0" y="24" textAnchor="middle" fill="#111111" fontSize="11" fontWeight="600" fontFamily="sans-serif">
                        01. Feature Spec
                      </text>
                    </g>
                    <g transform="translate(170, 50)">
                      <rect x="-55" y="-16" width="110" height="32" rx="0" fill="#FFFFFF" stroke="#111111" strokeWidth="1.5" />
                      <text x="0" y="4" textAnchor="middle" fill="#111111" fontSize="11" fontWeight="600" fontFamily="sans-serif">
                        02. Kanban Task
                      </text>
                    </g>
                    <g transform="translate(290, 170)">
                      <rect x="-55" y="-16" width="110" height="32" rx="0" fill="#FFFFFF" stroke="#111111" strokeWidth="1.5" />
                      <text x="0" y="4" textAnchor="middle" fill="#111111" fontSize="11" fontWeight="600" fontFamily="sans-serif">
                        03. Diff Chunk (+)
                      </text>
                    </g>
                    <g transform="translate(410, 110)">
                      <circle r="10" fill="#111111" />
                      <text x="0" y="26" textAnchor="middle" fill="#111111" fontSize="11" fontWeight="600" fontFamily="sans-serif">
                        04. PR Review
                      </text>
                    </g>
                  </svg>
                </div>

                {/* Stat Row */}
                <div className="grid grid-cols-3 gap-4 pt-2 text-center font-mono border-t border-[#F0F0F0]">
                  <div>
                    <div className="text-[10px] text-[#888888] uppercase tracking-wider">Reviews only real changes</div>
                    <div className="text-xs font-bold text-[#111111] mt-0.5">Task-linked, line-by-line</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-[#888888] uppercase tracking-wider">Never invents issues</div>
                    <div className="text-xs font-bold text-[#111111] mt-0.5">Reviews only added lines</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-[#888888] uppercase tracking-wider">Never reviews forever</div>
                    <div className="text-xs font-bold text-[#111111] mt-0.5">3 passes, then it stops</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── INTEGRATIONS BANNER ─── */}
        <section className="border-y border-[#E5E5E5] bg-white py-6">
          <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <span className="text-[10px] font-mono font-bold tracking-widest text-[#BBBBBB] uppercase">
              BUILT WITH
            </span>
            <div className="flex flex-wrap items-center justify-center md:justify-end gap-x-6 gap-y-2 font-mono text-[11px] font-semibold text-[#AAAAAA]">
              <span>NEXT.JS</span>
              <span className="text-[#DDDDDD]">·</span>
              <span>INNGEST</span>
              <span className="text-[#DDDDDD]">·</span>
              <span>PRISMA</span>
              <span className="text-[#DDDDDD]">·</span>
              <span>GITHUB</span>
              <span className="text-[#DDDDDD]">·</span>
              <span>OPENROUTER</span>
            </div>
          </div>
        </section>

        {/* ─── CAPABILITIES ─── */}
        <section id="capabilities" className="py-24 px-6 md:px-12 lg:px-20 max-w-7xl mx-auto w-full space-y-14">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-[#E5E5E5] pb-8">
            <div className="space-y-2">
              <span className="text-[10px] font-mono font-bold tracking-widest text-[#AAAAAA] uppercase">
                CAPABILITIES
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-[-0.02em] text-[#111111]">
                Reviews grounded in your plan. <br />
                <span className="text-[#999999]">Not guesses.</span>
              </h2>
            </div>
            <Link href="/dashboard" className="text-[11px] font-mono font-bold text-[#111111] hover:underline flex items-center gap-1">
              <span>EXPLORE →</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="bg-white border border-[#E5E5E5] rounded-none p-7 space-y-4 shadow-xs flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-9 h-9 bg-[#FAFAFA] border border-[#E5E5E5] rounded-none flex items-center justify-center text-[#111111]">
                  <GitBranch className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-[#111111]">
                  Line-Anchored Detection
                </h3>
                <p className="text-[13px] text-[#666666] leading-relaxed">
                  Every reported issue points to a real changed line — never a guess about code it can&apos;t see.
                </p>
              </div>
              <div className="pt-4 border-t border-[#F0F0F0] text-[10px] font-mono font-semibold text-emerald-600">
                100% GROUNDED IN DIFF
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white border border-[#E5E5E5] rounded-none p-7 space-y-4 shadow-xs flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-9 h-9 bg-[#FAFAFA] border border-[#E5E5E5] rounded-none flex items-center justify-center text-[#111111]">
                  <History className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-[#111111]">
                  Memory-Aware Re-Reviews
                </h3>
                <p className="text-[13px] text-[#666666] leading-relaxed">
                  Fixed something? AI remembers. Resolved issues are never re-flagged.
                </p>
              </div>
              <div className="pt-4 border-t border-[#F0F0F0] text-[10px] font-mono font-semibold text-[#111111]">
                UP TO 3 PASSES MAX
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white border border-[#E5E5E5] rounded-none p-7 space-y-4 shadow-xs flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-9 h-9 bg-[#FAFAFA] border border-[#E5E5E5] rounded-none flex items-center justify-center text-[#111111]">
                  <FileText className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-[#111111]">
                  PRD & Task Decomposition
                </h3>
                <p className="text-[13px] text-[#666666] leading-relaxed">
                  Feature request → clear spec → concrete tasks. Automatically.
                </p>
              </div>
              <div className="pt-4 border-t border-[#F0F0F0] text-[10px] font-mono font-semibold text-[#111111]">
                CAPPED AT 4 TASKS / FEATURE
              </div>
            </div>
          </div>
        </section>

        {/* ─── WORKFLOW ─── */}
        <section id="workflow" className="py-24 px-6 md:px-12 lg:px-20 bg-white border-t border-[#E5E5E5]">
          <div className="max-w-5xl mx-auto space-y-12">
            <div className="text-center max-w-md mx-auto space-y-2">
              <span className="text-[10px] font-mono font-bold tracking-widest text-[#AAAAAA] uppercase">
                HOW IT WORKS
              </span>
              <h2 className="text-3xl font-bold tracking-[-0.02em] text-[#111111]">
                Three steps. Zero handoffs.
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="p-6 border border-[#E5E5E5] rounded-none bg-[#FAFAFA] space-y-2.5">
                <span className="font-mono text-[10px] font-bold text-[#AAAAAA]">01 // CLARIFY</span>
                <h4 className="font-bold text-sm text-[#111111]">Describe the feature</h4>
                <p className="text-[13px] text-[#666666] leading-relaxed">
                  Submit a request. AI asks a few sharp questions, then generates a PRD and tasks.
                </p>
              </div>

              <div className="p-6 border border-[#E5E5E5] rounded-none bg-[#FAFAFA] space-y-2.5">
                <span className="font-mono text-[10px] font-bold text-[#AAAAAA]">02 // REVIEW</span>
                <h4 className="font-bold text-sm text-[#111111]">AI reviews every PR</h4>
                <p className="text-[13px] text-[#666666] leading-relaxed">
                  Code diffs are checked against the task board — grounded in real changed lines.
                </p>
              </div>

              <div className="p-6 border border-[#E5E5E5] rounded-none bg-[#FAFAFA] space-y-2.5">
                <span className="font-mono text-[10px] font-bold text-[#AAAAAA]">03 // SHIP</span>
                <h4 className="font-bold text-sm text-[#111111]">You approve, it ships</h4>
                <p className="text-[13px] text-[#666666] leading-relaxed">
                  Review the AI verdict, approve with one click, and ship with full audit history.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ─── FOOTER ─── */}
        <footer className="bg-[#111111] text-white py-14 px-6 md:px-12 border-t border-[#222222]">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-[22px] h-[22px] bg-white text-[#111111] flex items-center justify-center rounded-none">
                  <Command className="w-3 h-3" />
                </div>
                <span className="text-[13px] font-semibold tracking-tight text-white">
                  Taarana
                </span>
              </div>
              <p className="text-[12px] text-gray-500 max-w-xs leading-relaxed">
                From feature request to reviewed, shipped code — automatically.
              </p>
            </div>

            <div className="flex gap-6 text-[11px] font-mono text-gray-500 uppercase">
              <Link href="/dashboard" className="hover:text-white transition-colors">
                Dashboard
              </Link>
              <Link href="/dashboard/pull-requests" className="hover:text-white transition-colors">
                PRs
              </Link>
              <Link href="/dashboard/feature-requests" className="hover:text-white transition-colors">
                Requests
              </Link>
            </div>
          </div>

          <div className="max-w-6xl mx-auto mt-10 pt-5 border-t border-white/[0.06] flex flex-col md:flex-row justify-between items-center text-[10px] text-gray-600 font-mono">
            <span>© {new Date().getFullYear()} Taarana</span>
            <span>AUTONOMOUS CODE REVIEW INFRASTRUCTURE</span>
          </div>
        </footer>
      </main>
    </div>
  )
}
