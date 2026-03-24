import { writable } from 'svelte/store';
import type { GameState, Difficulty } from './types';
import { DIFFICULTY_CONFIGS } from './constants';
import {
  createEmptyBoard,
  placeMines,
  floodFill,
  revealAllMines,
  setCellState,
  getNeighbors,
} from './board';

function createInitialState(difficulty: Difficulty): GameState {
  const config = DIFFICULTY_CONFIGS[difficulty];
  return {
    board: createEmptyBoard(config.rows, config.cols),
    phase: 'idle',
    difficulty,
    minesRemaining: config.mines,
    elapsedSeconds: 0,
    firstClickDone: false,
    revealedCount: 0,
  };
}

let timerInterval: ReturnType<typeof setInterval> | null = null;

function startTimer(update: (fn: (s: GameState) => GameState) => void) {
  stopTimer();
  timerInterval = setInterval(() => {
    update((s) => {
      if (s.phase !== 'playing') { stopTimer(); return s; }
      const next = Math.min(s.elapsedSeconds + 1, 999);
      return { ...s, elapsedSeconds: next };
    });
  }, 1000);
}

function stopTimer() {
  if (timerInterval !== null) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

function createGameStore() {
  const { subscribe, set, update } = writable<GameState>(createInitialState('beginner'));

  function newGame(difficulty?: Difficulty) {
    stopTimer();
    update((s) => createInitialState(difficulty ?? s.difficulty));
  }

  function reveal(row: number, col: number) {
    update((s) => {
      if (s.phase === 'won' || s.phase === 'lost') return s;

      const cell = s.board.cells[row][col];
      if (cell.state !== 'hidden') return s;

      let state = { ...s };

      // First click: place mines avoiding clicked cell
      if (!state.firstClickDone) {
        const config = DIFFICULTY_CONFIGS[state.difficulty];
        const boardWithMines = placeMines(state.board, config.mines, row, col);
        state = { ...state, board: boardWithMines, firstClickDone: true, phase: 'playing' };
        startTimer(update);
      }

      const clickedCell = state.board.cells[row][col];

      // Clicked a mine → lose
      if (clickedCell.isMine) {
        const revealedBoard = revealAllMines(state.board, row, col);
        // Mark the clicked mine specially (keep it revealed but we'll style it differently via a flag)
        stopTimer();
        return { ...state, board: revealedBoard, phase: 'lost' };
      }

      // Flood fill reveal
      const { board: newBoard, revealedDelta } = floodFill(state.board, row, col);
      const newRevealedCount = state.revealedCount + revealedDelta;
      const config = DIFFICULTY_CONFIGS[state.difficulty];
      const totalSafe = config.rows * config.cols - config.mines;

      if (newRevealedCount >= totalSafe) {
        stopTimer();
        return { ...state, board: newBoard, revealedCount: newRevealedCount, phase: 'won' };
      }

      return { ...state, board: newBoard, revealedCount: newRevealedCount };
    });
  }

  function flag(row: number, col: number) {
    update((s) => {
      if (s.phase === 'won' || s.phase === 'lost') return s;
      if (s.phase === 'idle') return s;

      const cell = s.board.cells[row][col];
      if (cell.state === 'revealed') return s;

      let newState: typeof cell.state;
      let mineDelta = 0;

      if (cell.state === 'hidden') {
        newState = 'flagged';
        mineDelta = -1;
      } else if (cell.state === 'flagged') {
        newState = 'question';
        mineDelta = 1;
      } else {
        // question → hidden
        newState = 'hidden';
        mineDelta = 0;
      }

      const newBoard = setCellState(s.board, row, col, newState);
      return { ...s, board: newBoard, minesRemaining: s.minesRemaining + mineDelta };
    });
  }

  function chordReveal(row: number, col: number) {
    update((s) => {
      if (s.phase !== 'playing') return s;

      const cell = s.board.cells[row][col];
      if (cell.state !== 'revealed' || cell.adjacentMines === 0) return s;

      const neighbors = getNeighbors(s.board, row, col);
      const flaggedCount = neighbors.filter((n) => n.state === 'flagged').length;

      if (flaggedCount !== cell.adjacentMines) return s;

      // Reveal all hidden neighbors
      let state = { ...s };
      for (const neighbor of neighbors) {
        if (neighbor.state !== 'hidden') continue;

        if (neighbor.isMine) {
          const revealedBoard = revealAllMines(state.board, neighbor.row, neighbor.col);
          stopTimer();
          return { ...state, board: revealedBoard, phase: 'lost' };
        }

        const { board: newBoard, revealedDelta } = floodFill(state.board, neighbor.row, neighbor.col);
        const newRevealedCount = state.revealedCount + revealedDelta;
        const config = DIFFICULTY_CONFIGS[state.difficulty];
        const totalSafe = config.rows * config.cols - config.mines;

        state = { ...state, board: newBoard, revealedCount: newRevealedCount };

        if (newRevealedCount >= totalSafe) {
          stopTimer();
          return { ...state, phase: 'won' };
        }
      }

      return state;
    });
  }

  return { subscribe, newGame, reveal, flag, chordReveal };
}

export const gameStore = createGameStore();
