import type { Board, Cell, CellState } from './types';
import { NEIGHBOR_OFFSETS } from './constants';

export function createEmptyBoard(rows: number, cols: number): Board {
  const cells: Cell[][] = [];
  for (let r = 0; r < rows; r++) {
    cells[r] = [];
    for (let c = 0; c < cols; c++) {
      cells[r][c] = { row: r, col: c, isMine: false, adjacentMines: 0, state: 'hidden' };
    }
  }
  return { rows, cols, cells };
}

export function placeMines(board: Board, mineCount: number, safeRow: number, safeCol: number): Board {
  const candidates: Array<[number, number]> = [];

  for (let r = 0; r < board.rows; r++) {
    for (let c = 0; c < board.cols; c++) {
      const dr = Math.abs(r - safeRow);
      const dc = Math.abs(c - safeCol);
      if (dr <= 1 && dc <= 1) continue; // safe zone
      candidates.push([r, c]);
    }
  }

  // Fisher-Yates shuffle then take first mineCount
  for (let i = candidates.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [candidates[i], candidates[j]] = [candidates[j], candidates[i]];
  }

  const mineSet = new Set(
    candidates.slice(0, mineCount).map(([r, c]) => `${r},${c}`)
  );

  const cells: Cell[][] = board.cells.map((row) =>
    row.map((cell) => ({
      ...cell,
      isMine: mineSet.has(`${cell.row},${cell.col}`),
    }))
  );

  return computeAdjacency({ ...board, cells });
}

export function computeAdjacency(board: Board): Board {
  const cells: Cell[][] = board.cells.map((row) =>
    row.map((cell) => {
      if (cell.isMine) return cell;
      let count = 0;
      for (const [dr, dc] of NEIGHBOR_OFFSETS) {
        const nr = cell.row + dr;
        const nc = cell.col + dc;
        if (nr >= 0 && nr < board.rows && nc >= 0 && nc < board.cols) {
          if (board.cells[nr][nc].isMine) count++;
        }
      }
      return { ...cell, adjacentMines: count };
    })
  );
  return { ...board, cells };
}

export function floodFill(board: Board, startRow: number, startCol: number): { board: Board; revealedDelta: number } {
  const cells: Cell[][] = board.cells.map((row) => [...row]);
  const queue: Array<[number, number]> = [[startRow, startCol]];
  const visited = new Set<string>();
  let revealedDelta = 0;

  while (queue.length > 0) {
    const [r, c] = queue.shift()!;
    const key = `${r},${c}`;
    if (visited.has(key)) continue;
    visited.add(key);

    const cell = cells[r][c];
    if (cell.state !== 'hidden') continue;

    cells[r][c] = { ...cell, state: 'revealed' };
    revealedDelta++;

    if (cell.adjacentMines === 0 && !cell.isMine) {
      for (const [dr, dc] of NEIGHBOR_OFFSETS) {
        const nr = r + dr;
        const nc = c + dc;
        if (nr >= 0 && nr < board.rows && nc >= 0 && nc < board.cols) {
          const neighbor = cells[nr][nc];
          if (neighbor.state === 'hidden' && !visited.has(`${nr},${nc}`)) {
            queue.push([nr, nc]);
          }
        }
      }
    }
  }

  return { board: { ...board, cells }, revealedDelta };
}

export function revealAllMines(board: Board, triggeredRow: number, triggeredCol: number): Board {
  const cells: Cell[][] = board.cells.map((row) =>
    row.map((cell) => {
      if (cell.isMine && cell.state === 'hidden') {
        return { ...cell, state: 'revealed' as CellState };
      }
      // Mark wrongly flagged non-mines
      if (!cell.isMine && cell.state === 'flagged') {
        return { ...cell, state: 'revealed' as CellState };
      }
      return cell;
    })
  );
  return { ...board, cells };
}

export function setCellState(board: Board, row: number, col: number, state: CellState): Board {
  const cells: Cell[][] = board.cells.map((r) => [...r]);
  cells[row][col] = { ...cells[row][col], state };
  return { ...board, cells };
}

export function getNeighbors(board: Board, row: number, col: number): Cell[] {
  const result: Cell[] = [];
  for (const [dr, dc] of NEIGHBOR_OFFSETS) {
    const nr = row + dr;
    const nc = col + dc;
    if (nr >= 0 && nr < board.rows && nc >= 0 && nc < board.cols) {
      result.push(board.cells[nr][nc]);
    }
  }
  return result;
}
