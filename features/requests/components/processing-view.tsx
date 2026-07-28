'use client'

import { useEffect, useState } from 'react'
import { Sparkles, Brain, CheckCircle2, FileText, ArrowRight, Loader2 } from 'lucide-react'
import { StatusPoller } from './status-poller'

interface ProcessingViewProps {
  status: string
  hasPendingQuestions: boolean
  prdId?: string | null
  autoRedirectOnReady?: boolean
}

export function ProcessingView({ status, hasPendingQuestions, prdId, autoRedirectOnReady }: ProcessingViewProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-8 animate-in fade-in zoom-in duration-500">
      <StatusPoller 
        status={status} 
        hasPendingQuestions={hasPendingQuestions} 
        prdId={prdId} 
        autoRedirectOnReady={autoRedirectOnReady} 
        intervalMs={1000} 
        autoRedirectPath={prdId ? `/dashboard/prd/${prdId}?flow=new` : undefined}
      />
      
      <div className="relative">
        <div className="absolute inset-0 bg-indigo-500/20 blur-3xl rounded-full" />
        <div className="relative bg-card border border-indigo-500/30 p-6 rounded-2xl shadow-xl flex items-center justify-center">
          <Brain className="h-12 w-12 text-indigo-400 animate-pulse" />
        </div>
      </div>

      <div className="space-y-2 max-w-md">
        <h2 className="text-2xl font-bold tracking-tight">AI is analyzing your request</h2>
        <p className="text-muted-foreground">
          {status === 'PENDING' && "We're reviewing your feature request and preparing any necessary clarification questions..."}
          {status === 'CLARIFYING' && !hasPendingQuestions && "We're processing your answers and generating the next set of questions..."}
          {status === 'READY' && !prdId && "All questions answered! We're now generating your Product Requirements Document (PRD)..."}
        </p>
      </div>

      <div className="flex items-center gap-4 text-sm font-medium text-muted-foreground">
        <div className={`flex items-center gap-2 ${status !== 'PENDING' ? 'text-emerald-400' : 'text-indigo-400'}`}>
          {status !== 'PENDING' ? <CheckCircle2 className="h-4 w-4" /> : <Loader2 className="h-4 w-4 animate-spin" />}
          <span>Analysis</span>
        </div>
        <ArrowRight className="h-4 w-4 opacity-30" />
        <div className={`flex items-center gap-2 ${status === 'CLARIFYING' ? 'text-indigo-400' : (status === 'READY' ? 'text-emerald-400' : '')}`}>
          {status === 'READY' ? <CheckCircle2 className="h-4 w-4" /> : (status === 'CLARIFYING' ? <Loader2 className="h-4 w-4 animate-spin" /> : <div className="h-4 w-4 rounded-full border-2 border-muted" />)}
          <span>Clarification</span>
        </div>
        <ArrowRight className="h-4 w-4 opacity-30" />
        <div className={`flex items-center gap-2 ${prdId ? 'text-emerald-400' : (status === 'READY' && !prdId ? 'text-indigo-400' : '')}`}>
          {prdId ? <CheckCircle2 className="h-4 w-4" /> : (status === 'READY' && !prdId ? <Loader2 className="h-4 w-4 animate-spin" /> : <div className="h-4 w-4 rounded-full border-2 border-muted" />)}
          <span>PRD Generation</span>
        </div>
      </div>
    </div>
  )
}
