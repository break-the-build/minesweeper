import type { Difficulty, DifficultyConfig } from './types';

export const DIFFICULTY_CONFIGS: Record<Difficulty, DifficultyConfig> = {
  beginner:     { rows: 9,  cols: 9,  mines: 10 },
  intermediate: { rows: 16, cols: 16, mines: 40 },
  expert:       { rows: 16, cols: 30, mines: 99 },
};

export const NEIGHBOR_OFFSETS: ReadonlyArray<readonly [number, number]> = [
  [-1, -1], [-1, 0], [-1, 1],
  [ 0, -1],          [ 0, 1],
  [ 1, -1], [ 1, 0], [ 1, 1],
];

export const NUMBER_COLORS: Record<number, string> = {
  1: '#0000ff',
  2: '#007b00',
  3: '#ff0000',
  4: '#00007b',
  5: '#7b0000',
  6: '#007b7b',
  7: '#000000',
  8: '#7b7b7b',
};
