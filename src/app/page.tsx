
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import ProblemDisplay from '@/components/math-whiz/ProblemDisplay';
import Scoreboard from '@/components/math-whiz/Scoreboard';
import ThemeToggle from '@/components/ThemeToggle';
import { generateArithmeticProblem } from '@/lib/math-utils';
import type { Difficulty, ArithmeticOperation, Problem } from '@/components/math-whiz/types';
import { adjustDifficulty, type AdjustDifficultyInput } from '@/ai/flows/adaptive-difficulty';
import { useToast } from "@/hooks/use-toast";
import { BookOpen, HelpCircle, Plus, Minus, X, Divide, Loader2 } from 'lucide-react';

const topics: { value: ArithmeticOperation | 'Mixed'; label: string; icon: React.ElementType }[] = [
  { value: '+', label: 'Addition', icon: Plus },
  { value: '-', label: 'Subtraction', icon: Minus },
  { value: '*', label: 'Multiplication', icon: X },
  { value: '/', label: 'Division', icon: Divide },
  { value: 'Mixed', label: 'Mixed Arithmetic', icon: HelpCircle },
];

export default function Home() {
  const [currentProblem, setCurrentProblem] = useState<Problem | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty>('beginner');
  const [topic, setTopic] = useState<ArithmeticOperation | 'Mixed'>('+');
  
  const [score, setScore] = useState<number>(0);
  const [problemsAttempted, setProblemsAttempted] = useState<number>(0);
  const [problemsCorrect, setProblemsCorrect] = useState<number>(0);

  const [showSolution, setShowSolution] = useState<boolean>(false);
  const [isAdaptingDifficulty, setIsAdaptingDifficulty] = useState<boolean>(false);

  const { toast } = useToast();

  const loadNewProblem = useCallback(() => {
    const newProblem = generateArithmeticProblem(difficulty, topic);
    setCurrentProblem(newProblem);
    setShowSolution(false);
  }, [difficulty, topic]);

  useEffect(() => {
    loadNewProblem();
  }, [loadNewProblem]);

  const handleAdjustDifficulty = async () => {
    if (problemsAttempted < 5) return; 

    setIsAdaptingDifficulty(true);
    const performance = problemsAttempted > 0 ? problemsCorrect / problemsAttempted : 0;
    const input: AdjustDifficultyInput = {
      studentPerformance: performance,
      currentDifficulty: difficulty,
    };

    try {
      const result = await adjustDifficulty(input);
      if (result.newDifficulty !== difficulty) {
        setDifficulty(result.newDifficulty);
        toast({
          title: "Difficulty Adjusted!",
          description: `Difficulty changed to ${result.newDifficulty}. Reason: ${result.reason}`,
          variant: "default",
        });
      }
    } catch (error) {
      console.error("Failed to adjust difficulty:", error);
      toast({
        title: "Error",
        description: "Could not adjust difficulty at this time.",
        variant: "destructive",
      });
    } finally {
      setIsAdaptingDifficulty(false);
    }
  };

  const handleSubmitAnswer = (answer: number): boolean => {
    if (!currentProblem) return false;

    setProblemsAttempted((prev) => prev + 1);
    const isCorrect = Math.abs(answer - currentProblem.correctAnswer) < 0.001; 

    if (isCorrect) {
      setScore((prev) => prev + (difficulty === 'beginner' ? 10 : difficulty === 'intermediate' ? 20 : 30));
      setProblemsCorrect((prev) => prev + 1);
    }
    
    if ((problemsAttempted + 1) % 5 === 0) { 
        handleAdjustDifficulty();
    }

    return isCorrect;
  };

  const handleNextProblem = () => {
    loadNewProblem();
  };

  const handleToggleSolution = () => {
    setShowSolution(prev => !prev);
  };


  return (
    <div className="min-h-screen flex flex-col items-center p-4 sm:p-6 md:p-8 bg-gradient-to-br from-background to-secondary">
      <header className="mb-8 sm:mb-10 md:mb-12 text-center w-full max-w-4xl relative">
        <div className="absolute top-0 right-0">
          <ThemeToggle />
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-primary flex items-center justify-center pt-12 sm:pt-4">
          <BookOpen className="w-10 h-10 sm:w-12 sm:h-12 mr-2 sm:mr-3" /> MathWhiz
        </h1>
        <p className="text-muted-foreground text-md sm:text-lg mt-2">
          Sharpen your math skills with endless practice!
        </p>
      </header>

      <main className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
        <section className="md:col-span-2">
          {currentProblem ? (
            <ProblemDisplay
              problem={currentProblem}
              onSubmitAnswer={handleSubmitAnswer}
              onNextProblem={handleNextProblem}
              showSolution={showSolution}
              onToggleSolution={handleToggleSolution}
            />
          ) : (
             <Card className="w-full shadow-lg">
              <CardContent className="p-6 flex items-center justify-center min-h-[200px]">
                <Loader2 className="mr-2 h-8 w-8 animate-spin text-primary" />
                 <p className="text-xl text-muted-foreground">Loading problem...</p>
              </CardContent>
            </Card>
          )}
        </section>

        <aside className="space-y-6 sm:space-y-8">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Customize Practice</CardTitle>
              <CardDescription>Select topic and difficulty.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="topic-select">Topic</Label>
                <Select
                  value={topic}
                  onValueChange={(value) => setTopic(value as ArithmeticOperation | 'Mixed')}
                  disabled={isAdaptingDifficulty}
                >
                  <SelectTrigger id="topic-select" className="w-full shadow-sm">
                    <SelectValue placeholder="Select topic" />
                  </SelectTrigger>
                  <SelectContent>
                    {topics.map((t) => (
                      <SelectItem key={t.value} value={t.value}>
                        <div className="flex items-center">
                          <t.icon className="w-4 h-4 mr-2" />
                          {t.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="difficulty-select">Difficulty</Label>
                <Select
                  value={difficulty}
                  onValueChange={(value) => setDifficulty(value as Difficulty)}
                  disabled={isAdaptingDifficulty}
                >
                  <SelectTrigger id="difficulty-select" className="w-full shadow-sm">
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {isAdaptingDifficulty && (
                <p className="text-sm text-primary flex items-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adapting difficulty based on your performance...
                </p>
              )}
            </CardContent>
          </Card>
          <Scoreboard
            score={score}
            problemsAttempted={problemsAttempted}
            problemsCorrect={problemsCorrect}
            currentDifficulty={difficulty}
          />
        </aside>
      </main>
      <footer className="mt-10 sm:mt-12 md:mt-16 text-center text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} MathWhiz. Keep practicing!</p>
      </footer>
    </div>
  );
}
