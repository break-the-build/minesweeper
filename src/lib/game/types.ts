export type CellState = 'hidden' | 'revealed' | 'flagged' | 'question';
export type GamePhase = 'idle' | 'playing' | 'won' | 'lost';
export type Difficulty = 'beginner' | 'intermediate' | 'expert';

export interface Cell {
  readonly row: number;
  readonly col: number;
  readonly isMine: boolean;
  readonly adjacentMines: number;
  readonly state: CellState;
}

export interface Board {
  readonly rows: number;
  readonly cols: number;
  readonly cells: ReadonlyArray<ReadonlyArray<Cell>>;
}

export interface DifficultyConfig {
  readonly rows: number;
  readonly cols: number;
  readonly mines: number;
}

export interface GameState {
  readonly board: Board;
  readonly phase: GamePhase;
  readonly difficulty: Difficulty;
  readonly minesRemaining: number;
  readonly elapsedSeconds: number;
  readonly firstClickDone: boolean;
  readonly revealedCount: number;
}
