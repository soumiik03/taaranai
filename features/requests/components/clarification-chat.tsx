// features/requests/components/clarification-chat.tsx
'use client'

import { useState, useTransition } from 'react'
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
                    <div className="rounded-md border border-border p-3 text-sm">{q.question}</div>
                    <div className="rounded-md bg-muted p-3 text-sm ml-6">{q.answer}</div>
                </div>
            ))}

            {currentQuestion ? (
                <div className="space-y-2">
                    <div className="rounded-md border border-border p-3 text-sm">
                        {currentQuestion.question}
                    </div>
                    <Textarea
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        placeholder="Type your answer..."
                        rows={3}
                    />
                    <Button onClick={submitAnswer} disabled={isPending || !answer.trim()}>
                        {isPending ? 'Saving...' : 'Submit Answer'}
                    </Button>
                </div>
            ) : (
                <p className="text-sm text-muted-foreground">
                    Reviewing your answers — checking if anything else is needed...
                </p>
            )}
        </div>
    )
}