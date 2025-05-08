'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, XCircle, Loader2, Lightbulb } from 'lucide-react';
import type { Problem } from './types';

interface ProblemDisplayProps {
  problem: Problem | null;
  onSubmitAnswer: (answer: number) => boolean;
  onNextProblem: () => void;
  showSolution: boolean;
  onToggleSolution: () => void;
}

const ProblemDisplay: React.FC<ProblemDisplayProps> = ({
  problem,
  onSubmitAnswer,
  onNextProblem,
  showSolution,
  onToggleSolution,
}) => {
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [feedback, setFeedback] = useState<{ type: 'correct' | 'incorrect'; message: string } | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setUserAnswer('');
    setFeedback(null);
    setIsSubmitted(false);
    if (problem && inputRef.current) {
      inputRef.current.focus();
    }
  }, [problem]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userAnswer.trim() === '' || !problem) return;

    const answerNum = parseFloat(userAnswer);
    if (isNaN(answerNum)) {
      setFeedback({ type: 'incorrect', message: 'Please enter a valid number.' });
      return;
    }

    const isCorrect = onSubmitAnswer(answerNum);
    setFeedback({
      type: isCorrect ? 'correct' : 'incorrect',
      message: isCorrect ? 'Correct! Well done!' : `Incorrect. The answer is ${problem.correctAnswer}.`,
    });
    setIsSubmitted(true);
  };

  if (!problem) {
    return (
      <Card className="w-full max-w-md mx-auto shadow-lg">
        <CardContent className="p-6 flex items-center justify-center min-h-[200px]">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="ml-4 text-xl text-muted-foreground">Loading problem...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="text-center text-2xl font-bold text-primary">Solve This!</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-4xl font-mono text-center p-8 bg-muted/50 rounded-lg shadow-inner">
          {problem.question}
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            ref={inputRef}
            type="number"
            step="any"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            placeholder="Your answer"
            className="text-lg text-center h-12 focus:ring-2 focus:ring-primary shadow-sm"
            disabled={isSubmitted}
            aria-label="Enter your answer"
          />
          {!isSubmitted && (
            <Button type="submit" className="w-full text-lg py-3 shadow-md" disabled={userAnswer.trim() === ''}>
              Submit Answer
            </Button>
          )}
        </form>
        {feedback && (
          <Alert variant={feedback.type === 'correct' ? 'default' : 'destructive'} className={`border-2 ${feedback.type === 'correct' ? 'border-accent' : 'border-destructive'}`}>
            {feedback.type === 'correct' ? <CheckCircle className="h-5 w-5 text-accent" /> : <XCircle className="h-5 w-5 text-destructive" />}
            <AlertTitle className="font-semibold">{feedback.type === 'correct' ? 'Great Job!' : 'Oops!'}</AlertTitle>
            <AlertDescription>{feedback.message}</AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4">
        <Button
          variant="outline"
          onClick={onToggleSolution}
          className="w-full sm:w-auto shadow-sm hover:bg-primary/10"
          disabled={!isSubmitted && feedback?.type !== 'incorrect'}
          aria-expanded={showSolution}
        >
          <Lightbulb className="mr-2 h-4 w-4" /> {showSolution ? 'Hide Solution' : 'Show Solution'}
        </Button>
        <Button onClick={onNextProblem} className="w-full sm:w-auto shadow-md" disabled={!isSubmitted && !feedback}>
          Next Problem
        </Button>
      </CardFooter>
      {showSolution && (
        <CardContent className="pt-4 border-t">
          <p className="text-lg font-semibold text-primary">Solution:</p>
          <p className="text-md">The correct answer for <span className="font-semibold">{problem.question.replace('?', '')}</span> is <span className="font-bold text-accent">{problem.correctAnswer}</span>.</p>
          {/* Basic step-by-step can be added here if needed */}
        </CardContent>
      )}
    </Card>
  );
};

export default ProblemDisplay;
