import type { GameProps } from './types';
import { useState, useEffect, useRef } from 'react';

interface Scenario {
  id: number;
  situation: string;
  options: { text: string; ethical: boolean }[];
  answered: boolean;
}

export function EthicsDecision({ config, onComplete, onExit }: GameProps) {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(90);
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const gameEnded = useRef(false);

  useEffect(() => {
    const ethicsScenarios: Scenario[] = [
      {
        id: 1,
        situation: 'Your facial recognition AI shows bias against certain demographics.',
        options: [
          { text: 'Deploy anyway - it works for most users', ethical: false },
          { text: 'Retrain with diverse datasets and audit for bias', ethical: true },
        ],
        answered: false,
      },
      {
        id: 2,
        situation: 'Your hiring AI filters out qualified candidates from protected groups.',
        options: [
          { text: 'Ignore it - the AI is just finding patterns', ethical: false },
          { text: 'Investigate the bias and fix the training data', ethical: true },
        ],
        answered: false,
      },
      {
        id: 3,
        situation: 'You can scrape user data to improve your AI without explicit consent.',
        options: [
          { text: 'Get informed consent and be transparent', ethical: true },
          { text: 'Use the data - everyone does it', ethical: false },
        ],
        answered: false,
      },
      {
        id: 4,
        situation: 'Your AI recommendation system can manipulate user behavior for profit.',
        options: [
          { text: 'Maximize engagement at all costs', ethical: false },
          { text: 'Design for user wellbeing, not just engagement', ethical: true },
        ],
        answered: false,
      },
    ];
    setScenarios(ethicsScenarios);
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

  const handleChoice = (ethical: boolean) => {
    const current = scenarios[currentIndex];
    if (!current || current.answered) return;

    if (ethical) {
      setScore(prev => prev + 25);
    }

    setScenarios(prev => prev.map((s, i) => 
      i === currentIndex ? { ...s, answered: true } : s
    ));

    if (currentIndex < scenarios.length - 1) {
      setTimeout(() => setCurrentIndex(prev => prev + 1), 1000);
    } else {
      setTimeout(() => handleGameEnd(), 1000);
    }
  };

  const handleGameEnd = () => {
    if (gameEnded.current) return;
    gameEnded.current = true;
    const percentage = (score / 100) * 100;
    onComplete({
      success: percentage >= (config.passingScore || 80),
      score,
      timeElapsed: 90 - timeLeft,
      xpEarned: Math.floor(score * 2),
    });
  };

  const current = scenarios[currentIndex];

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-900 to-slate-900 p-4 flex items-center justify-center">
      <div className="max-w-3xl w-full">
        <div className="flex justify-between items-center mb-6 bg-slate-800/50 p-4 rounded-lg">
          <div>
            <h1 className="text-2xl font-bold text-white">{config.title}</h1>
            <p className="text-slate-300 text-sm">Make responsible AI decisions</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-emerald-400">{score}</div>
            <div className="text-slate-400">⏱️ {timeLeft}s</div>
          </div>
        </div>

        {current && (
          <div className="bg-slate-800/70 p-8 rounded-lg mb-4">
            <div className="mb-6">
              <div className="text-slate-400 text-sm mb-3">Scenario {currentIndex + 1} of {scenarios.length}</div>
              <div className="text-xl text-white font-semibold mb-6 leading-relaxed">
                {current.situation}
              </div>
              <div className="text-amber-400 text-sm mb-4">What do you do?</div>
            </div>

            <div className="space-y-4">
              {current.options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleChoice(option.ethical)}
                  disabled={current.answered}
                  className="w-full p-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-lg font-semibold text-left transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {option.text}
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
