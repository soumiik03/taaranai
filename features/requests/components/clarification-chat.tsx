'use client'

import { useState, useTransition } from 'react'


import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { answerClarificationQuestion } from '../actions'
import { ThinkingIndicator } from './thinking-indicator'

type Question = {
    id: string
    question: string
    answer: string | null
    status: 'PENDING' | 'ANSWERED'
}

export function ClarificationChat({ questions }: { questions: Question[] }) {
    const [answer, setAnswer] = useState('')
    const [isPending, startTransition] = useTransition()

    const answered = questions.filter((q) => q.status === 'ANSWERED')
    const pending = questions.filter((q) => q.status === 'PENDING')
    const currentQuestion = pending[0]

    function submitAnswer() {
        if (!currentQuestion || !answer.trim()) return
        startTransition(async () => {
            await answerClarificationQuestion(currentQuestion.id, answer.trim())
            setAnswer('')
        })
    }

    return (
        <div className="space-y-4">
            {answered.map((q) => (
                <div key={q.id} className="space-y-2">
                    <div className="rounded-md border border-border p-3 text-sm font-medium text-foreground/90">{q.question}</div>
                    <div className="rounded-md bg-muted/50 p-3 text-sm ml-6 text-muted-foreground">{q.answer}</div>
                </div>
            ))}

            {isPending && (
                <div className="py-2">
                    <ThinkingIndicator text="Reviewing your answer and analyzing requirements..." />
                </div>
            )}

            {!isPending && currentQuestion && (
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
            )}

            {!isPending && !currentQuestion && (
                <div className="rounded-2xl border border-indigo-500/30 bg-card p-6 text-center space-y-4">
                    <ThinkingIndicator text="Thinking through your request and preparing next steps..." className="mx-auto" />
                </div>
            )}
        </div>
    )
}