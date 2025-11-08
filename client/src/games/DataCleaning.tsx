import type { GameProps } from './types';
import { useState, useEffect, useRef } from 'react';

interface DataPoint {
  id: number;
  value: string;
  isClean: boolean;
  isCorrected: boolean;
}

export function DataCleaning({ config, onComplete, onExit }: GameProps) {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(45);
  const [dataPoints, setDataPoints] = useState<DataPoint[]>([]);
  const gameEnded = useRef(false);

  useEffect(() => {
    const dirty = [
      { id: 1, value: 'NULL', isClean: false, isCorrected: false },
      { id: 2, value: '42', isClean: true, isCorrected: false },
      { id: 3, value: 'NaN', isClean: false, isCorrected: false },
      { id: 4, value: '87', isClean: true, isCorrected: false },
      { id: 5, value: '???', isClean: false, isCorrected: false },
      { id: 6, value: '123', isClean: true, isCorrected: false },
      { id: 7, value: '', isClean: false, isCorrected: false },
      { id: 8, value: '56', isClean: true, isCorrected: false },
      { id: 9, value: 'MISSING', isClean: false, isCorrected: false },
      { id: 10, value: '99', isClean: true, isCorrected: false },
    ];
    setDataPoints(dirty);
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

  const handleClean = (id: number) => {
    setDataPoints(prev => prev.map(dp => 
      dp.id === id && !dp.isClean && !dp.isCorrected
        ? { ...dp, isCorrected: true }
        : dp
    ));
    setScore(prev => prev + 10);
  };

  const handleGameEnd = () => {
    if (gameEnded.current) return;
    gameEnded.current = true;
    const percentage = (score / 50) * 100;
    onComplete({
      success: percentage >= (config.passingScore || 80),
      score,
      timeSpent: 45 - timeLeft,
      xpEarned: Math.floor(score * 2),
    });
  };

  useEffect(() => {
    const corrected = dataPoints.filter(dp => dp.isCorrected).length;
    const total = dataPoints.filter(dp => !dp.isClean).length;
    if (corrected === total && total > 0 && !gameEnded.current) {
      handleGameEnd();
    }
  }, [dataPoints]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6 bg-slate-800/50 p-4 rounded-lg">
          <div>
            <h1 className="text-2xl font-bold text-white">{config.title}</h1>
            <p className="text-slate-300 text-sm">{config.description}</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-emerald-400">{score}</div>
            <div className="text-slate-400">⏱️ {timeLeft}s</div>
          </div>
        </div>

        <div className="bg-slate-700/30 p-6 rounded-lg mb-4">
          <h2 className="text-white font-semibold mb-3">📊 Data Set - Click to clean dirty data!</h2>
          <div className="grid grid-cols-5 gap-3">
            {dataPoints.map(dp => (
              <button
                key={dp.id}
                onClick={() => handleClean(dp.id)}
                disabled={dp.isClean || dp.isCorrected}
                className={`p-4 rounded-lg font-mono text-sm transition-all ${
                  dp.isCorrected
                    ? 'bg-green-600 text-white cursor-not-allowed'
                    : dp.isClean
                    ? 'bg-blue-600 text-white cursor-not-allowed'
                    : 'bg-red-600 text-white hover:bg-red-500 cursor-pointer'
                }`}
              >
                {dp.isCorrected ? '✓ 0' : dp.value}
              </button>
            ))}
          </div>
          <div className="mt-4 text-slate-300 text-xs space-y-1">
            <div>🔴 Red = Dirty data (NULL, NaN, missing) - Click to clean!</div>
            <div>🔵 Blue = Already clean</div>
            <div>🟢 Green = Cleaned by you</div>
          </div>
        </div>

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
