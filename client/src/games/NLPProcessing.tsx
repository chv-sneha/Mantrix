import type { GameProps } from './types';
import { useState, useEffect, useRef } from 'react';

interface Token {
  id: number;
  word: string;
  processed: boolean;
}

export function NLPProcessing({ config, onComplete, onExit }: GameProps) {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(45);
  const [tokens, setTokens] = useState<Token[]>([]);
  const gameEnded = useRef(false);

  useEffect(() => {
    const sentence = "The QUICK brown fox jumps over the lazy DOG!!!".split(' ');
    const tokenList: Token[] = sentence.map((word, i) => ({
      id: i,
      word,
      processed: false,
    }));
    setTokens(tokenList);
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

  const handleProcess = (id: number) => {
    setTokens(prev => prev.map(t => 
      t.id === id && !t.processed ? { ...t, processed: true } : t
    ));
    setScore(prev => prev + 12);
  };

  const handleGameEnd = () => {
    if (gameEnded.current) return;
    gameEnded.current = true;
    const totalTokens = tokens.length;
    const processedTokens = tokens.filter(t => t.processed).length;
    const percentage = (processedTokens / totalTokens) * 100;
    onComplete({
      success: percentage >= (config.passingScore || 80),
      score,
      timeSpent: 45 - timeLeft,
      xpEarned: Math.floor(score * 2),
    });
  };

  useEffect(() => {
    const allProcessed = tokens.every(t => t.processed);
    if (allProcessed && tokens.length > 0 && !gameEnded.current) {
      handleGameEnd();
    }
  }, [tokens]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-900 to-slate-900 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6 bg-slate-800/50 p-4 rounded-lg">
          <div>
            <h1 className="text-2xl font-bold text-white">{config.title}</h1>
            <p className="text-slate-300 text-sm">Tokenize and clean text data</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-emerald-400">{score}</div>
            <div className="text-slate-400">⏱️ {timeLeft}s</div>
          </div>
        </div>

        <div className="bg-slate-800/70 p-8 rounded-lg mb-4">
          <h2 className="text-white font-semibold mb-4">📝 Raw Text - Click to tokenize & normalize</h2>
          <div className="flex flex-wrap gap-3 mb-6">
            {tokens.map(token => (
              <button
                key={token.id}
                onClick={() => handleProcess(token.id)}
                disabled={token.processed}
                className={`px-4 py-3 rounded-lg font-mono text-sm transition-all ${
                  token.processed
                    ? 'bg-green-600 text-white cursor-not-allowed'
                    : 'bg-orange-600 text-white hover:bg-orange-500 cursor-pointer'
                }`}
              >
                {token.processed ? token.word.toLowerCase().replace(/[^a-z]/g, '') : token.word}
              </button>
            ))}
          </div>

          <div className="text-slate-300 text-sm space-y-1">
            <div>🟠 Orange = Raw token (uppercase, punctuation)</div>
            <div>🟢 Green = Processed (lowercase, cleaned)</div>
            <div className="pt-2 text-xs">NLP Pipeline: Tokenization → Lowercase → Remove punctuation</div>
          </div>

          <div className="mt-4 text-center">
            <div className="text-white">
              Progress: {tokens.filter(t => t.processed).length} / {tokens.length} tokens
            </div>
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
