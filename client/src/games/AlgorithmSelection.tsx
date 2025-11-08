import type { GameProps } from './types';
import { useState, useEffect, useRef } from 'react';

interface Challenge {
  id: number;
  problem: string;
  dataType: string;
  correctAlgorithm: string;
  answered: boolean;
}

const algorithms = ['Linear Regression', 'Decision Tree', 'K-Means', 'Random Forest'];

export function AlgorithmSelection({ config, onComplete, onExit }: GameProps) {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const gameEnded = useRef(false);

  useEffect(() => {
    const problems: Challenge[] = [
      { id: 1, problem: 'Predict house prices', dataType: 'Regression', correctAlgorithm: 'Linear Regression', answered: false },
      { id: 2, problem: 'Group customers by behavior', dataType: 'Clustering', correctAlgorithm: 'K-Means', answered: false },
      { id: 3, problem: 'Classify emails as spam', dataType: 'Classification', correctAlgorithm: 'Decision Tree', answered: false },
      { id: 4, problem: 'Predict complex patterns', dataType: 'Classification', correctAlgorithm: 'Random Forest', answered: false },
      { id: 5, problem: 'Predict stock prices', dataType: 'Regression', correctAlgorithm: 'Linear Regression', answered: false },
    ];
    setChallenges(problems);
  }, []);

  useEffect(() => {
    if (gameEnded.current) return;

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

  const handleSelect = (algorithm: string) => {
    const current = challenges[currentIndex];
    if (!current || current.answered) return;

    const isCorrect = algorithm === current.correctAlgorithm;
    if (isCorrect) {
      setScore(prev => prev + 20);
    }

    setChallenges(prev => prev.map((c, i) => 
      i === currentIndex ? { ...c, answered: true } : c
    ));

    if (currentIndex < challenges.length - 1) {
      setTimeout(() => setCurrentIndex(prev => prev + 1), 500);
    } else {
      setTimeout(() => handleGameEnd(), 500);
    }
  };

  const handleGameEnd = () => {
    if (gameEnded.current) return;
    gameEnded.current = true;
    const percentage = (score / 100) * 100;
    onComplete({
      success: percentage >= (config.passingScore || 80),
      score,
      timeSpent: 60 - timeLeft,
      xpEarned: Math.floor(score * 2),
    });
  };

  const current = challenges[currentIndex];

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 to-slate-900 p-4 flex items-center justify-center">
      <div className="max-w-2xl w-full">
        <div className="flex justify-between items-center mb-6 bg-slate-800/50 p-4 rounded-lg">
          <div>
            <h1 className="text-2xl font-bold text-white">{config.title}</h1>
            <p className="text-slate-300 text-sm">Choose the best algorithm</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-emerald-400">{score}</div>
            <div className="text-slate-400">⏱️ {timeLeft}s</div>
          </div>
        </div>

        {current && (
          <div className="bg-slate-800/70 p-8 rounded-lg mb-4">
            <div className="mb-6">
              <div className="text-slate-400 text-sm mb-2">Challenge {currentIndex + 1} of {challenges.length}</div>
              <h2 className="text-2xl font-bold text-white mb-2">{current.problem}</h2>
              <div className="text-amber-400 text-sm">Type: {current.dataType}</div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {algorithms.map(algo => (
                <button
                  key={algo}
                  onClick={() => handleSelect(algo)}
                  disabled={current.answered}
                  className="p-6 bg-gradient-to-br from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-lg font-semibold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {algo}
                </button>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={onExit}
          className="px-6 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg"
        >
          Exit
        </button>
      </div>
    </div>
  );
}
