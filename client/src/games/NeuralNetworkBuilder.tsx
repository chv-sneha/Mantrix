import type { GameProps } from './types';
import { useState, useEffect, useRef } from 'react';

interface Neuron {
  id: number;
  layer: number;
  connected: boolean;
}

export function NeuralNetworkBuilder({ config, onComplete, onExit }: GameProps) {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [connections, setConnections] = useState(0);
  const [targetConnections] = useState(12);
  const gameEnded = useRef(false);

  const neurons: Neuron[] = [
    { id: 1, layer: 0, connected: false },
    { id: 2, layer: 0, connected: false },
    { id: 3, layer: 1, connected: false },
    { id: 4, layer: 1, connected: false },
    { id: 5, layer: 1, connected: false },
    { id: 6, layer: 2, connected: false },
  ];

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

  const handleConnect = () => {
    if (connections < targetConnections) {
      setConnections(prev => prev + 1);
      setScore(prev => prev + 10);
    }
  };

  const handleGameEnd = () => {
    if (gameEnded.current) return;
    gameEnded.current = true;
    const percentage = (connections / targetConnections) * 100;
    onComplete({
      success: percentage >= (config.passingScore || 80),
      score,
      timeSpent: 60 - timeLeft,
      xpEarned: Math.floor(score * 2),
    });
  };

  useEffect(() => {
    if (connections >= targetConnections && !gameEnded.current) {
      setTimeout(() => handleGameEnd(), 500);
    }
  }, [connections]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-slate-900 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6 bg-slate-800/50 p-4 rounded-lg">
          <div>
            <h1 className="text-2xl font-bold text-white">{config.title}</h1>
            <p className="text-slate-300 text-sm">Connect neurons to build a network</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-emerald-400">{score}</div>
            <div className="text-slate-400">⏱️ {timeLeft}s</div>
          </div>
        </div>

        <div className="bg-slate-800/70 p-8 rounded-lg mb-4">
          <div className="mb-6 text-center">
            <div className="text-white text-lg">
              Connections: {connections} / {targetConnections}
            </div>
            <div className="w-full bg-slate-700 h-4 rounded-full mt-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-4 rounded-full transition-all"
                style={{ width: `${(connections / targetConnections) * 100}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-12 mb-6">
            <div className="space-y-8">
              <div className="text-center text-slate-400 text-sm mb-4">Input Layer</div>
              {neurons.filter(n => n.layer === 0).map(n => (
                <div key={n.id} className="w-16 h-16 mx-auto rounded-full bg-green-500 flex items-center justify-center text-white font-bold">
                  {n.id}
                </div>
              ))}
            </div>

            <div className="space-y-6">
              <div className="text-center text-slate-400 text-sm mb-4">Hidden Layer</div>
              {neurons.filter(n => n.layer === 1).map(n => (
                <div key={n.id} className="w-16 h-16 mx-auto rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                  {n.id}
                </div>
              ))}
            </div>

            <div className="space-y-8">
              <div className="text-center text-slate-400 text-sm mb-4">Output Layer</div>
              {neurons.filter(n => n.layer === 2).map(n => (
                <div key={n.id} className="w-16 h-16 mx-auto rounded-full bg-purple-500 flex items-center justify-center text-white font-bold">
                  {n.id}
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={handleConnect}
            disabled={connections >= targetConnections}
            className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-lg font-bold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {connections >= targetConnections ? '✓ Network Complete!' : 'Connect Neurons'}
          </button>
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
