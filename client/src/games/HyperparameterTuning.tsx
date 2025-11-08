import type { GameProps } from './types';
import { useState, useEffect, useRef } from 'react';

export function HyperparameterTuning({ config, onComplete, onExit }: GameProps) {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [learningRate, setLearningRate] = useState(0.5);
  const [treeDepth, setTreeDepth] = useState(5);
  const [epochs, setEpochs] = useState(10);
  const [accuracy, setAccuracy] = useState(50);
  const [attempts, setAttempts] = useState(0);
  const gameEnded = useRef(false);

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

  const calculateAccuracy = (lr: number, depth: number, ep: number) => {
    const optimalLr = 0.01;
    const optimalDepth = 8;
    const optimalEpochs = 50;

    const lrScore = 100 - Math.abs(lr - optimalLr) * 200;
    const depthScore = 100 - Math.abs(depth - optimalDepth) * 10;
    const epochScore = 100 - Math.abs(ep - optimalEpochs) * 2;

    return Math.max(0, Math.min(100, (lrScore + depthScore + epochScore) / 3));
  };

  const handleTrain = () => {
    setAttempts(prev => prev + 1);
    const newAccuracy = calculateAccuracy(learningRate, treeDepth, epochs);
    setAccuracy(Math.round(newAccuracy));
    
    if (newAccuracy >= 85) {
      setScore(prev => prev + Math.round(newAccuracy));
      setTimeout(() => handleGameEnd(), 1000);
    } else {
      setScore(prev => prev + Math.round(newAccuracy / 2));
    }
  };

  const handleGameEnd = () => {
    if (gameEnded.current) return;
    gameEnded.current = true;
    const percentage = accuracy;
    onComplete({
      success: percentage >= (config.passingScore || 80),
      score,
      timeSpent: 60 - timeLeft,
      xpEarned: Math.floor(score * 2),
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-900 to-slate-900 p-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-6 bg-slate-800/50 p-4 rounded-lg">
          <div>
            <h1 className="text-2xl font-bold text-white">{config.title}</h1>
            <p className="text-slate-300 text-sm">Tune parameters to achieve 85%+ accuracy</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-emerald-400">{accuracy}%</div>
            <div className="text-slate-400">⏱️ {timeLeft}s</div>
          </div>
        </div>

        <div className="bg-slate-800/70 p-8 rounded-lg mb-4 space-y-6">
          <div>
            <label className="text-white font-semibold block mb-2">
              Learning Rate: {learningRate.toFixed(3)}
            </label>
            <input
              type="range"
              min="0.001"
              max="1"
              step="0.001"
              value={learningRate}
              onChange={e => setLearningRate(parseFloat(e.target.value))}
              className="w-full"
            />
            <div className="text-xs text-slate-400 mt-1">Lower = slower but more precise</div>
          </div>

          <div>
            <label className="text-white font-semibold block mb-2">
              Tree Depth: {treeDepth}
            </label>
            <input
              type="range"
              min="1"
              max="15"
              step="1"
              value={treeDepth}
              onChange={e => setTreeDepth(parseInt(e.target.value))}
              className="w-full"
            />
            <div className="text-xs text-slate-400 mt-1">Higher = more complex but risk overfitting</div>
          </div>

          <div>
            <label className="text-white font-semibold block mb-2">
              Epochs: {epochs}
            </label>
            <input
              type="range"
              min="1"
              max="100"
              step="1"
              value={epochs}
              onChange={e => setEpochs(parseInt(e.target.value))}
              className="w-full"
            />
            <div className="text-xs text-slate-400 mt-1">Training iterations</div>
          </div>

          <button
            onClick={handleTrain}
            className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-lg font-bold text-lg transition-all"
          >
            Train Model (Attempt #{attempts + 1})
          </button>

          {attempts > 0 && (
            <div className="text-center">
              <div className={`text-2xl font-bold ${accuracy >= 85 ? 'text-green-400' : 'text-yellow-400'}`}>
                Current Accuracy: {accuracy}%
              </div>
              {accuracy >= 85 ? (
                <div className="text-green-400 mt-2">🎉 Excellent! Model optimized!</div>
              ) : (
                <div className="text-yellow-400 mt-2">Keep tuning...</div>
              )}
            </div>
          )}
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
