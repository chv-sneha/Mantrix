import type { GameProps } from './types';
import { useState, useEffect } from 'react';

export function LoopArena({ config, onComplete, onExit }: GameProps) {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(config.timeLimit || 60);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleGameEnd();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleGameEnd = () => {
    const success = score >= config.passingScore;
    onComplete({
      score,
      timeSpent: (config.timeLimit || 60) - timeLeft,
      success,
      xpEarned: success ? 100 : 50,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">{config.title}</h1>
        <p className="text-2xl text-purple-300 mb-8">
          Score: {score} / {config.passingScore}
        </p>
        <p className="text-xl text-slate-300 mb-8">
          Time Left: {timeLeft}s
        </p>
        <p className="text-slate-400 mb-8">
          [Placeholder - Game implementation coming soon]
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => setScore(score + 1)}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold"
          >
            Test: Add Point
          </button>
          <button
            onClick={onExit}
            className="px-6 py-3 bg-slate-600 hover:bg-slate-700 text-white rounded-lg font-semibold"
          >
            Exit
          </button>
        </div>
      </div>
    </div>
  );
}
