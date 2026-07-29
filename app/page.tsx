'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  Command,
  ArrowRight,
  GitBranch,
  History,
  FileText,
  CheckCircle2,
  Menu,
  X,
  ShieldCheck,
  Zap,
} from 'lucide-react'

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#111111] font-sans antialiased selection:bg-[#111111] selection:text-white relative overflow-x-hidden">
      {/* TECHNICAL GRID BACKGROUND */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-[linear-gradient(to_right,rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.03)_1px,transparent_1px)] [background-size:32px_32px] [mask-image:linear-gradient(to_bottom,black_40%,transparent_100%)]" />

      {/* HEADER / NAVIGATION */}
      <header className="fixed top-0 left-0 right-0 z-50 w-full px-6 md:px-12 h-16 flex justify-between items-center bg-[#FAFAFA]/90 backdrop-blur-md border-b border-[#E5E5E5]">
        {/* Command Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-6 h-6 bg-[#111111] text-white flex items-center justify-center rounded">
            <Command className="w-3.5 h-3.5" />
          </div>
          <span className="font-sans text-sm font-bold tracking-tight text-[#111111]">
            Taaran AI
          </span>
        </Link>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-medium text-[#666666]">
          <a href="#capabilities" className="hover:text-[#111111] transition-colors">
            Capabilities
          </a>
          <a href="#workflow" className="hover:text-[#111111] transition-colors">
            Workflow
          </a>
          <a href="#integrations" className="hover:text-[#111111] transition-colors">
            Integrations
          </a>
        </nav>

        {/* Desktop Action */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/dashboard"
            className="group inline-flex items-center gap-2 bg-[#111111] text-white text-xs font-semibold px-4 py-2 rounded hover:bg-black transition-colors"
          >
            <span>Open Workspace</span>
            <ArrowRight className="w-3.5 h-3.5 text-gray-400 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-[#111111] p-1.5 focus:outline-none"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* MOBILE MENU OVERLAY */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-[#FAFAFA]/98 backdrop-blur-xl flex flex-col items-center justify-center">
          <div className="flex flex-col gap-6 text-center">
            <a href="#capabilities" onClick={() => setMobileMenuOpen(false)} className="text-lg font-bold text-[#111111]">
              Capabilities
            </a>
            <a href="#workflow" onClick={() => setMobileMenuOpen(false)} className="text-lg font-bold text-[#111111]">
              Workflow
            </a>
            <a href="#integrations" onClick={() => setMobileMenuOpen(false)} className="text-lg font-bold text-[#111111]">
              Integrations
            </a>
            <div className="w-12 h-[1px] bg-[#E5E5E5] mx-auto my-2" />
            <Link
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-bold text-white bg-[#111111] px-6 py-2.5 rounded"
            >
              Open Workspace →
            </Link>
          </div>
        </div>
      )}

      {/* MAIN CONTENT WRAPPER */}
      <main className="z-10 flex flex-col w-full relative pt-16">
        {/* HERO SECTION */}
        <section className="relative px-6 md:px-12 lg:px-20 pt-20 pb-16 max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-6 space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-white border border-[#E5E5E5] shadow-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-[11px] font-mono font-medium text-[#666666] tracking-tight">
                  System v4.0 Active  ·  Autonomous PR Review
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#111111] leading-[1.08]">
                Autonomous <br />
                <span className="text-[#666666]">Code Reviews.</span>
              </h1>

              <p className="text-sm sm:text-base text-[#666666] leading-relaxed max-w-lg font-normal">
                The reasoning layer for engineering teams. Clarify requirements, map PRDs into Kanban tasks, and anchor GitHub PR reviews strictly to changed diff lines with zero hallucinations.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  href="/dashboard"
                  className="group inline-flex items-center gap-2.5 bg-[#111111] text-white text-xs font-semibold px-6 py-3 rounded shadow-xs hover:bg-black transition-colors"
                >
                  <span>Open Workspace</span>
                  <ArrowRight className="w-4 h-4 text-gray-300 group-hover:translate-x-0.5 transition-transform" />
                </Link>
                <Link
                  href="/dashboard/pull-requests"
                  className="inline-flex items-center gap-2 bg-white text-[#111111] border border-[#E5E5E5] text-xs font-semibold px-6 py-3 rounded shadow-xs hover:bg-gray-50 transition-colors"
                >
                  <span>View PR Reviews</span>
                </Link>
              </div>
            </div>

            {/* Right Visual Column (Clean Node Graph Card) */}
            <div className="lg:col-span-6 w-full">
              <div className="bg-white border border-[#E5E5E5] rounded-xl shadow-xs p-6 md:p-8 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-[#F0F0F0] pb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#111111]" />
                    <span className="text-xs font-mono font-bold text-[#111111] tracking-wider uppercase">
                      TASK GROUNDING GRAPH
                    </span>
                  </div>
                  <span className="text-[11px] font-mono font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 border border-emerald-200 rounded">
                    100% VERIFIED
                  </span>
                </div>

                {/* Clean SVG Diagram with ZERO text overlap */}
                <div className="w-full bg-[#FAFAFA] border border-[#F0F0F0] rounded-lg p-6 flex justify-center items-center">
                  <svg className="w-full h-auto max-w-[460px]" viewBox="0 0 460 220" fill="none">
                    {/* Connecting Path */}
                    <path
                      d="M 50 110 C 110 110, 110 50, 170 50 C 230 50, 230 170, 290 170 C 350 170, 350 110, 410 110"
                      stroke="#111111"
                      strokeWidth="2"
                    />

                    {/* Node 1: Feature Spec */}
                    <g transform="translate(50, 110)">
                      <circle r="7" fill="#111111" />
                      <text x="0" y="24" textAnchor="middle" fill="#111111" fontSize="11" fontWeight="600" fontFamily="sans-serif">
                        01. Feature Spec
                      </text>
                    </g>

                    {/* Node 2: Kanban Task */}
                    <g transform="translate(170, 50)">
                      <rect x="-55" y="-16" width="110" height="32" rx="6" fill="#FFFFFF" stroke="#111111" strokeWidth="1.5" />
                      <text x="0" y="4" textAnchor="middle" fill="#111111" fontSize="11" fontWeight="600" fontFamily="sans-serif">
                        02. Kanban Task
                      </text>
                    </g>

                    {/* Node 3: Diff Chunk (+) */}
                    <g transform="translate(290, 170)">
                      <rect x="-55" y="-16" width="110" height="32" rx="6" fill="#FFFFFF" stroke="#111111" strokeWidth="1.5" />
                      <text x="0" y="4" textAnchor="middle" fill="#111111" fontSize="11" fontWeight="600" fontFamily="sans-serif">
                        03. Diff Chunk (+)
                      </text>
                    </g>

                    {/* Node 4: Consolidated Review */}
                    <g transform="translate(410, 110)">
                      <circle r="10" fill="#111111" />
                      <text x="0" y="26" textAnchor="middle" fill="#111111" fontSize="11" fontWeight="600" fontFamily="sans-serif">
                        04. PR Review
                      </text>
                    </g>
                  </svg>
                </div>

                {/* Metadata Row */}
                <div className="grid grid-cols-3 gap-4 pt-2 text-center font-mono border-t border-[#F0F0F0]">
                  <div>
                    <div className="text-[10px] text-[#888888] uppercase tracking-wider">Grounding</div>
                    <div className="text-xs font-bold text-[#111111] mt-0.5">100% Task Anchored</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-[#888888] uppercase tracking-wider">Diff Mode</div>
                    <div className="text-xs font-bold text-[#111111] mt-0.5">Added Lines (+)</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-[#888888] uppercase tracking-wider">Run Limit</div>
                    <div className="text-xs font-bold text-[#111111] mt-0.5">3 Passes Max</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* STACK & INTEGRATIONS BANNER */}
        <section id="integrations" className="border-y border-[#E5E5E5] bg-white py-8">
          <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-xs font-mono font-bold tracking-widest text-[#111111] uppercase shrink-0">
              STACK & INTEGRATIONS
            </div>
            <div className="flex flex-wrap items-center justify-center md:justify-end gap-x-8 gap-y-3 font-mono text-xs font-bold text-[#555555]">
              <span>NEXT.JS 15</span>
              <span className="text-[#CCCCCC]">•</span>
              <span>INNGEST PIPELINE</span>
              <span className="text-[#CCCCCC]">•</span>
              <span>PRISMA ORM</span>
              <span className="text-[#CCCCCC]">•</span>
              <span>OCTOKIT GITHUB</span>
              <span className="text-[#CCCCCC]">•</span>
              <span>OPENROUTER AI</span>
            </div>
          </div>
        </section>

        {/* CAPABILITIES / FEATURES */}
        <section id="capabilities" className="py-24 px-6 md:px-12 lg:px-20 max-w-7xl mx-auto w-full space-y-16">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-[#E5E5E5] pb-8">
            <div className="max-w-xl space-y-2">
              <span className="text-xs font-mono font-bold tracking-widest text-[#888888] uppercase">
                CORE CAPABILITIES
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#111111]">
                Structured Reasoning. Zero Hallucinations.
              </h2>
            </div>
            <Link href="/dashboard" className="text-xs font-mono font-bold text-[#111111] hover:underline flex items-center gap-1">
              <span>EXPLORE WORKSPACE</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-white border border-[#E5E5E5] rounded-xl p-8 space-y-4 shadow-xs flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-10 h-10 bg-[#FAFAFA] border border-[#E5E5E5] rounded-lg flex items-center justify-center text-[#111111]">
                  <GitBranch className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-[#111111]">
                  Line-Anchored Defect Detection
                </h3>
                <p className="text-xs text-[#666666] leading-relaxed">
                  Evaluates diff chunks strictly against approved tasks. Every reported issue is anchored directly to explicit added line numbers (<code className="text-[#111111] font-mono">+</code>) in the pull request.
                </p>
              </div>
              <div className="pt-4 border-t border-[#F0F0F0] text-[11px] font-mono font-semibold text-emerald-600">
                100% GROUNDED IN DIFF
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white border border-[#E5E5E5] rounded-xl p-8 space-y-4 shadow-xs flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-10 h-10 bg-[#FAFAFA] border border-[#E5E5E5] rounded-lg flex items-center justify-center text-[#111111]">
                  <History className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-[#111111]">
                  Memory-Aware Re-Reviews
                </h3>
                <p className="text-xs text-[#666666] leading-relaxed">
                  Tracks unresolved issues across up to 3 review passes. Fixed issues are acknowledged as resolved and never re-flagged in subsequent commits.
                </p>
              </div>
              <div className="pt-4 border-t border-[#F0F0F0] text-[11px] font-mono font-semibold text-[#111111]">
                UP TO 3 PASSES MAX
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white border border-[#E5E5E5] rounded-xl p-8 space-y-4 shadow-xs flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-10 h-10 bg-[#FAFAFA] border border-[#E5E5E5] rounded-lg flex items-center justify-center text-[#111111]">
                  <FileText className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-[#111111]">
                  PRD & Task Decomposition
                </h3>
                <p className="text-xs text-[#666666] leading-relaxed">
                  Transforms ambiguous feature requests into clarified PRD specifications and discrete implementation tasks (capped at 4 per feature).
                </p>
              </div>
              <div className="pt-4 border-t border-[#F0F0F0] text-[11px] font-mono font-semibold text-[#111111]">
                CAPPED AT 4 TASKS / FEATURE
              </div>
            </div>
          </div>
        </section>

        {/* WORKFLOW PIPELINE */}
        <section id="workflow" className="py-24 px-6 md:px-12 lg:px-20 bg-white border-t border-[#E5E5E5]">
          <div className="max-w-5xl mx-auto space-y-12">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <span className="text-xs font-mono font-bold tracking-widest text-[#888888] uppercase">
                ENGINEERING WORKFLOW
              </span>
              <h2 className="text-3xl font-bold text-[#111111]">
                3 Simple Steps to Shipped Code
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 border border-[#E5E5E5] rounded-lg bg-[#FAFAFA] space-y-3">
                <span className="font-mono text-xs font-bold text-[#111111]">01 // SPEC & PRD</span>
                <h4 className="font-bold text-sm text-[#111111]">Feature Clarification</h4>
                <p className="text-xs text-[#666666] leading-relaxed">
                  Submit a request. AI asks 1-5 clarifying questions and generates discrete Kanban tasks.
                </p>
              </div>

              <div className="p-6 border border-[#E5E5E5] rounded-lg bg-[#FAFAFA] space-y-3">
                <span className="font-mono text-xs font-bold text-[#111111]">02 // GIT PUSH</span>
                <h4 className="font-bold text-sm text-[#111111]">Task-Grounded Review</h4>
                <p className="text-xs text-[#666666] leading-relaxed">
                  GitHub webhook dispatches code diffs for automated review passes grounded in changed lines.
                </p>
              </div>

              <div className="p-6 border border-[#E5E5E5] rounded-lg bg-[#FAFAFA] space-y-3">
                <span className="font-mono text-xs font-bold text-[#111111]">03 // APPROVAL</span>
                <h4 className="font-bold text-sm text-[#111111]">Human Approval Gate</h4>
                <p className="text-xs text-[#666666] leading-relaxed">
                  Developers review consolidated AI review verdicts and approve to ship with full audit history.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="bg-[#111111] text-white py-16 px-6 md:px-12 border-t border-[#222222]">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 bg-white text-[#111111] flex items-center justify-center rounded">
                  <Command className="w-3.5 h-3.5" />
                </div>
                <span className="font-sans text-base font-bold tracking-tight text-white">
                  Taaran AI
                </span>
              </div>
              <p className="text-xs text-gray-400 max-w-xs leading-relaxed">
                Autonomous AI code reviews & PRD task decomposition for engineering teams.
              </p>
            </div>

            <div className="flex gap-8 text-xs font-mono text-gray-400 uppercase">
              <Link href="/dashboard" className="hover:text-white transition-colors">
                Dashboard
              </Link>
              <Link href="/dashboard/pull-requests" className="hover:text-white transition-colors">
                Pull Requests
              </Link>
              <Link href="/dashboard/feature-requests" className="hover:text-white transition-colors">
                Feature Requests
              </Link>
              <Link href="/dashboard/shipped" className="hover:text-white transition-colors">
                Shipped
              </Link>
            </div>
          </div>

          <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-[11px] text-gray-500 font-mono">
            <span>© {new Date().getFullYear()} Taaran AI. All rights reserved.</span>
            <span>AUTONOMOUS CODE REVIEW INFRASTRUCTURE</span>
          </div>
        </footer>
      </main>
    </div>
  )
}
