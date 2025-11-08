import type { GameProps } from './types';
import { useState, useEffect, useRef } from 'react';

const filters = ['Edge Detection', 'Blur', 'Sharpen', 'Grayscale'];

interface FilterChallenge {
  id: number;
  inputImage: string;
  correctFilter: string;
  answered: boolean;
}

export function CNNFilter({ config, onComplete, onExit }: GameProps) {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [challenges, setChallenges] = useState<FilterChallenge[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const gameEnded = useRef(false);

  useEffect(() => {
    const problems: FilterChallenge[] = [
      { id: 1, inputImage: '🖼️ Sharp Photo', correctFilter: 'Edge Detection', answered: false },
      { id: 2, inputImage: '🖼️ Noisy Image', correctFilter: 'Blur', answered: false },
      { id: 3, inputImage: '🖼️ Blurry Photo', correctFilter: 'Sharpen', answered: false },
      { id: 4, inputImage: '🖼️ Color Photo', correctFilter: 'Grayscale', answered: false },
      { id: 5, inputImage: '🖼️ Color Borders', correctFilter: 'Edge Detection', answered: false },
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

  const handleApplyFilter = (filter: string) => {
    const current = challenges[currentIndex];
    if (!current || current.answered) return;

    const isCorrect = filter === current.correctFilter;
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
      timeElapsed: 60 - timeLeft,
      xpEarned: Math.floor(score * 2),
    });
  };

  const current = challenges[currentIndex];

  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-900 to-slate-900 p-4 flex items-center justify-center">
      <div className="max-w-2xl w-full">
        <div className="flex justify-between items-center mb-6 bg-slate-800/50 p-4 rounded-lg">
          <div>
            <h1 className="text-2xl font-bold text-white">{config.title}</h1>
            <p className="text-slate-300 text-sm">Apply the correct CNN filter</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-emerald-400">{score}</div>
            <div className="text-slate-400">⏱️ {timeLeft}s</div>
          </div>
        </div>

        {current && (
          <div className="bg-slate-800/70 p-8 rounded-lg mb-4">
            <div className="mb-6 text-center">
              <div className="text-slate-400 text-sm mb-2">Image {currentIndex + 1} of {challenges.length}</div>
              <div className="text-6xl mb-4">{current.inputImage}</div>
              <div className="text-white text-lg">Choose the best filter to process this image</div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {filters.map(filter => (
                <button
                  key={filter}
                  onClick={() => handleApplyFilter(filter)}
                  disabled={current.answered}
                  className="p-6 bg-gradient-to-br from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {filter}
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
