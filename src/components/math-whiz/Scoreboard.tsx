import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Award, BarChart3, CheckCircle2, ListChecks } from 'lucide-react';

interface ScoreboardProps {
  score: number;
  problemsAttempted: number;
  problemsCorrect: number;
  currentDifficulty: string;
}

const Scoreboard: React.FC<ScoreboardProps> = ({ score, problemsAttempted, problemsCorrect, currentDifficulty }) => {
  const accuracy = problemsAttempted > 0 ? ((problemsCorrect / problemsAttempted) * 100).toFixed(1) : '0.0';

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">Your Progress</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4 text-center">
        <div className="flex flex-col items-center p-3 bg-muted/50 rounded-lg">
          <Award className="w-8 h-8 mb-2 text-primary" />
          <p className="text-sm text-muted-foreground">Score</p>
          <p className="text-2xl font-bold">{score}</p>
        </div>
        <div className="flex flex-col items-center p-3 bg-muted/50 rounded-lg">
          <BarChart3 className="w-8 h-8 mb-2 text-accent" />
          <p className="text-sm text-muted-foreground">Accuracy</p>
          <p className="text-2xl font-bold">{accuracy}%</p>
        </div>
        <div className="flex flex-col items-center p-3 bg-muted/50 rounded-lg">
          <ListChecks className="w-8 h-8 mb-2 text-secondary-foreground" />
          <p className="text-sm text-muted-foreground">Attempted</p>
          <p className="text-2xl font-bold">{problemsAttempted}</p>
        </div>
        <div className="flex flex-col items-center p-3 bg-muted/50 rounded-lg">
          <CheckCircle2 className="w-8 h-8 mb-2 text-green-500" />
          <p className="text-sm text-muted-foreground">Correct</p>
          <p className="text-2xl font-bold">{problemsCorrect}</p>
        </div>
         <div className="col-span-2 flex flex-col items-center p-3 bg-primary/10 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 mb-2 text-primary lucide lucide-brain-circuit"><path d="M12 5a3 3 0 1 0-5.993 1.003c.005-.002.01-.003.015-.003H12V5Z"/><path d="M12 5a3 3 0 1 1 5.993 1.003C17.995 6.002 17.99 6 17.985 6H12V5Z"/><path d="M15 9a3 3 0 1 0-5.993 1.003C9.005 10.002 9.01 10 9.015 10H15V9Z"/><path d="M9.015 10A2.999 2.999 0 0 0 7 13a1 1 0 0 0 1 1h1.5"/><path d="M15.985 10A2.999 2.999 0 0 1 17 13a1 1 0 0 1-1 1h-1.5"/><path d="M12 13.5V14a1 1 0 0 0 1 1h1a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-1a2 2 0 0 1 2-2h1a1 1 0 0 0 1-1v-.5Z"/><path d="M7.5 16a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"/><path d="M16.5 16a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"/></svg>
          <p className="text-sm text-muted-foreground">Current Difficulty</p>
          <p className="text-xl font-semibold capitalize">{currentDifficulty}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default Scoreboard;
