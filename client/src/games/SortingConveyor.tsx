import type { GameProps } from './types';

export function SortingConveyor({ config, onComplete, onExit }: GameProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">{config.title}</h1>
        <p className="text-slate-300 mb-8">[Sorting Conveyor - Coming Soon]</p>
        <button
          onClick={onExit}
          className="px-6 py-3 bg-slate-600 hover:bg-slate-700 text-white rounded-lg font-semibold"
        >
          Exit
        </button>
      </div>
    </div>
  );
}
