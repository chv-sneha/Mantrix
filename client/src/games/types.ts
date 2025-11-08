import type { FC } from 'react';
import type { GameConfig, GameResult } from '@shared/types';

export interface GameProps {
  config: GameConfig;
  onComplete: (result: GameResult) => void;
  onExit: () => void;
}

export interface GameLifecycle {
  init?: () => void;
  cleanup?: () => void;
}

export type GameComponent = FC<GameProps>;
