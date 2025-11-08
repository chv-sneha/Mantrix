import type { GameComponent } from './types';
import { LoopArena } from './LoopArena';
import { RecursionMaze } from './RecursionMaze';
import { SortingConveyor } from './SortingConveyor';
import { PatternBuilder } from './PatternBuilder';
import { SearchChallenge } from './SearchChallenge';
import { BacktrackingPuzzle } from './BacktrackingPuzzle';
import { MarkupForge } from './MarkupForge';
import { StyleSpectrum } from './StyleSpectrum';
import { ScriptCircuit } from './ScriptCircuit';
import { ComponentLink } from './ComponentLink';
import { ServiceRunner } from './ServiceRunner';
import { DataBridge } from './DataBridge';
import { DeployOrbit } from './DeployOrbit';
import { DataCleaning } from './DataCleaning';
import { AlgorithmSelection } from './AlgorithmSelection';
import { HyperparameterTuning } from './HyperparameterTuning';
import { NeuralNetworkBuilder } from './NeuralNetworkBuilder';
import { CNNFilter } from './CNNFilter';
import { NLPProcessing } from './NLPProcessing';
import { EthicsDecision } from './EthicsDecision';

type GameType = 'loop-arena' | 'recursion-maze' | 'sorting-conveyor' | 'pattern-builder' | 'search-challenge' | 'backtracking-puzzle' | 'markup-forge' | 'style-spectrum' | 'script-circuit' | 'component-link' | 'service-runner' | 'data-bridge' | 'deploy-orbit' | 'data-cleaning' | 'algorithm-selection' | 'hyperparameter-tuning' | 'neural-network-builder' | 'cnn-filter' | 'nlp-processing' | 'ethics-decision';

export const gameRegistry: Record<GameType, GameComponent> = {
  'loop-arena': LoopArena,
  'recursion-maze': RecursionMaze,
  'sorting-conveyor': SortingConveyor,
  'pattern-builder': PatternBuilder,
  'search-challenge': SearchChallenge,
  'backtracking-puzzle': BacktrackingPuzzle,
  'markup-forge': MarkupForge,
  'style-spectrum': StyleSpectrum,
  'script-circuit': ScriptCircuit,
  'component-link': ComponentLink,
  'service-runner': ServiceRunner,
  'data-bridge': DataBridge,
  'deploy-orbit': DeployOrbit,
  'data-cleaning': DataCleaning,
  'algorithm-selection': AlgorithmSelection,
  'hyperparameter-tuning': HyperparameterTuning,
  'neural-network-builder': NeuralNetworkBuilder,
  'cnn-filter': CNNFilter,
  'nlp-processing': NLPProcessing,
  'ethics-decision': EthicsDecision,
};

export function getGameComponent(gameType: GameType): GameComponent | null {
  return gameRegistry[gameType] || null;
}
