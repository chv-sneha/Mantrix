import type { GameComponent } from './types';
import { LoopArena } from './LoopArena';
import { RecursionMaze } from './RecursionMaze';
import { SortingConveyor } from './SortingConveyor';
import { PatternBuilder } from './PatternBuilder';
import { SearchChallenge } from './SearchChallenge';
import { BacktrackingPuzzle } from './BacktrackingPuzzle';

type GameType = 'loop-arena' | 'recursion-maze' | 'sorting-conveyor' | 'pattern-builder' | 'search-challenge' | 'backtracking-puzzle';

export const gameRegistry: Record<GameType, GameComponent> = {
  'loop-arena': LoopArena,
  'recursion-maze': RecursionMaze,
  'sorting-conveyor': SortingConveyor,
  'pattern-builder': PatternBuilder,
  'search-challenge': SearchChallenge,
  'backtracking-puzzle': BacktrackingPuzzle,
};

export function getGameComponent(gameType: GameType): GameComponent | null {
  return gameRegistry[gameType] || null;
}
