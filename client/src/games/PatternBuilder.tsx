import type { GameProps } from './types';
import { useState, useEffect } from 'react';

interface Pattern {
  id: number;
  sequence: number[];
  userInput: number[];
  completed: boolean;
}

export function PatternBuilder({ config, onComplete, onExit }: GameProps) {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(config.timeLimit || 60);
  const [currentPattern, setCurrentPattern] = useState<Pattern | null>(null);
  const [showPattern, setShowPattern] = useState(true);
  const [level, setLevel] = useState(1);
  const [gameOver, setGameOver] = useState(false);

  const generatePattern = (length: number): number[] => {
    return Array.from({ length }, () => Math.floor(Math.random() * 4));
  };

  const startNewPattern = () => {
    const pattern: Pattern = {
      id: Date.now(),
      sequence: generatePattern(Math.min(3 + level, 8)),
      userInput: [],
      completed: false
    };
    setCurrentPattern(pattern);
    setShowPattern(true);
    setTimeout(() => setShowPattern(false), 2000 + pattern.sequence.length * 500);
  };

  useEffect(() => {
    startNewPattern();
  }, [level]);

  useEffect(() => {
    if (timeLeft <= 0 && !gameOver) {
      setGameOver(true);
      const success = score >= config.passingScore;
      onComplete({
        score,
        timeSpent: (config.timeLimit || 60) - timeLeft,
        success,
        xpEarned: success ? 100 : 50
      });
    }
  }, [timeLeft, gameOver]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleColorClick = (colorIndex: number) => {
    if (!currentPattern || showPattern || gameOver) return;

    const newInput = [...currentPattern.userInput, colorIndex];
    const isCorrect = newInput.every((color, i) => color === currentPattern.sequence[i]);

    if (!isCorrect) {
      setScore(prev => Math.max(0, prev - 10));
      startNewPattern();
      return;
    }

    setCurrentPattern(prev => prev ? { ...prev, userInput: newInput } : null);

    if (newInput.length === currentPattern.sequence.length) {
      setScore(prev => prev + 20 + level * 5);
      setLevel(prev => prev + 1);
    }
  };

  const colors = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="bg-slate-800/80 px-4 py-2 rounded-lg">
            <div className="text-sm text-blue-300">Score</div>
            <div className="text-2xl font-bold text-white">{score}</div>
          </div>
          <div className="bg-slate-800/80 px-4 py-2 rounded-lg">
            <div className="text-sm text-blue-300">Time</div>
            <div className="text-2xl font-bold text-white">{timeLeft}s</div>
          </div>
          <div className="bg-slate-800/80 px-4 py-2 rounded-lg">
            <div className="text-sm text-blue-300">Level</div>
            <div className="text-2xl font-bold text-white">{level}</div>
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">{config.title}</h1>
          <p className="text-slate-300 mb-4">{config.description}</p>
        </div>

        {currentPattern && (
          <div className="bg-slate-800/50 rounded-xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              {showPattern ? 'Memorize the Pattern' : 'Repeat the Pattern'}
            </h2>
            
            <div className="flex justify-center gap-4 mb-8">
              {currentPattern.sequence.map((colorIndex, i) => (
                <div
                  key={i}
                  className={`w-16 h-16 rounded-lg border-4 transition-all duration-300 ${
                    showPattern 
                      ? 'border-white shadow-lg' 
                      : currentPattern.userInput.length > i
                        ? currentPattern.userInput[i] === colorIndex
                          ? 'border-green-400'
                          : 'border-red-400'
                        : 'border-gray-600'
                  }`}
                  style={{ 
                    backgroundColor: showPattern || currentPattern.userInput.length > i 
                      ? colors[colorIndex] 
                      : '#374151'
                  }}
                />
              ))}
            </div>

            {!showPattern && (
              <div className="flex justify-center gap-4">
                {colors.map((color, index) => (
                  <button
                    key={index}
                    onClick={() => handleColorClick(index)}
                    className="w-20 h-20 rounded-lg border-4 border-white/30 hover:border-white/60 transition-all duration-200 hover:scale-105"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        <div className="text-center">
          <button
            onClick={onExit}
            className="px-6 py-3 bg-slate-600 hover:bg-slate-700 text-white rounded-lg font-semibold"
          >
            Exit Game
          </button>
        </div>
      </div>
    </div>
  );
}
