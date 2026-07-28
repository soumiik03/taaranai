'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { answerClarificationQuestion } from '../actions'

type Question = {
    id: string
    question: string
    answer: string | null
    status: 'PENDING' | 'ANSWERED'
}

export function ClarificationChat({ questions }: { questions: Question[] }) {
    const router = useRouter()
    const [answer, setAnswer] = useState('')
    const [isPending, startTransition] = useTransition()

    const answered = questions.filter((q) => q.status === 'ANSWERED')
    const pending = questions.filter((q) => q.status === 'PENDING')
    const currentQuestion = pending[0]

    function submitAnswer() {
        if (!currentQuestion || !answer.trim()) return
        startTransition(async () => {
            const result = await answerClarificationQuestion(currentQuestion.id, answer.trim())
            setAnswer('')
        })
    }


    return (
        <div className="space-y-4">
            {answered.map((q) => (
                <div key={q.id} className="space-y-2">
                    <div className="rounded-md border border-border p-3 text-sm">{q.question}</div>
                    <div className="rounded-md bg-muted p-3 text-sm ml-6">{q.answer}</div>
                </div>
            ))}

            {currentQuestion ? (
                <div className="space-y-3">
                    <div className="rounded-xl border border-indigo-500/30 bg-indigo-500/10 p-4 text-sm font-medium text-indigo-200">
                        {currentQuestion.question}
                    </div>
                    <Textarea
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        placeholder="Type your clarification answer..."
                        rows={4}
                        className="rounded-xl border-border bg-card text-sm p-3"
                    />
                    <Button onClick={submitAnswer} disabled={isPending || !answer.trim()} className="gap-2">
                        {isPending ? 'Saving Answer...' : 'Submit Answer'}
                    </Button>
                </div>
            ) : (
                <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-6 text-center space-y-3">
                    <div className="flex h-10 w-10 mx-auto items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/30">
                        <span className="animate-ping absolute inline-flex h-4 w-4 rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                    </div>
                    <h4 className="text-base font-bold text-emerald-200">All Clarification Questions Answered</h4>
                    <p className="text-xs text-emerald-300/70 max-w-md mx-auto">
                        Your answers are saved. The Product Requirements Document is being prepared.
                    </p>
                </div>
            )}

        </div>
    )
}