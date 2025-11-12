function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = (Math.random() * (i + 1)) | 0;
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function doSwap() { 
  return Math.random() < 0.5; 
}

function swap(arr, i, j) {
  const t = arr[i]; arr[i] = arr[j]; arr[j] = t;
}

function fillBoard(size) {
  const blockWidth = 3;
  let blockHeight = 3;
  if (size === 6) blockHeight = 2;

  const board = Array.from({ length: size }, () => Array(size).fill(0));
  for (let r = 0; r < size; r++) {
    const groupIdx = Math.floor(r / blockHeight);
    const rowInGroup = r % blockHeight;
    const shift = (rowInGroup * blockWidth + groupIdx) % size;
    for (let c = 0; c < size; c++) board[r][c] = (c + shift) % size + 1;
  }
  return board;
}

function swapRowsWithinGroup(board) {
  const N = board.length;
  const rowsInGroup = (N === 6 ? 2 : 3);
  const numGroup = Math.floor(N / rowsInGroup);

  for (let g = 0; g < numGroup; g++) {
    const s = g * rowsInGroup;
    for (let i = 0; i < rowsInGroup - 1; i++) {
      for (let j = i + 1; j < rowsInGroup; j++) {
        if (doSwap()) swap(board, s + i, s + j);
      }
    }
  }
}

function swapColsWithinGroup(board) {
  const N = board.length;
  const colsInGroup = 3;
  const numGroup = Math.floor(N / colsInGroup);

  for (let g = 0; g < numGroup; g++) {
    const s = g * colsInGroup;
    for (let i = 0; i < colsInGroup - 1; i++) {
      for (let j = i + 1; j < colsInGroup; j++) {
        if (!doSwap()) continue;
        const c1 = s + i, c2 = s + j;
        if (c1 >= N || c2 >= N) continue;
        for (let r = 0; r < N; r++) {
          const row = board[r];
          if (c1 < row.length && c2 < row.length) {
            const t = row[c1]; row[c1] = row[c2]; row[c2] = t;
          }
        }
      }
    }
  }
}

function swapRowGroups(board) {
  const N = board.length;
  const rowsInGroup = (N === 6 ? 2 : 3);
  const numGroup = Math.floor(N / rowsInGroup);
  
  for (let a = 0; a < numGroup; a++) {
    for (let b = a + 1; b < numGroup; b++) {
      if (!doSwap()) continue;
      const sa = a * rowsInGroup;
      const sb = b * rowsInGroup;
      for (let k = 0; k < rowsInGroup; k++) swap(board, sa + k, sb + k);
    }
  }
}

function swapColGroups(board) {
  const N = board.length;
  const colsInGroup = 3;
  const numGroup = Math.floor(N / colsInGroup);

  for (let a = 0; a < numGroup; a++) {
    for (let b = a + 1; b < numGroup; b++) {
      if (!doSwap()) continue;
      const sa = a * colsInGroup;
      const sb = b * colsInGroup;
      for (let k = 0; k < colsInGroup; k++) {
        const c1 = sa + k, c2 = sb + k;
        for (let r = 0; r < N; r++) swap(board[r], c1, c2);
      }
    }
  }
}

function swapNums(board) {
  const N = board.length;
  for (let i = 1; i <= Math.floor(N / 2);  i++) {
    const j = N + 1 - i;
    if (!doSwap()) continue;
    for (let r = 0; r < N; r++) {
      for (let c = 0; c < N; c++) {
        if (board[r][c] === i) board[r][c] = j;
        else if (board[r][c] === j) board[r][c] = i;
      }
    }
  }
}

function deepCopy(g) { return g.map(r => r.slice()); }


function removeNums(board, numsLeft) {
  const N = board.length;
  const total = N * N;

  const keep = new Set();
  while (keep.size < numsLeft) keep.add((Math.random() * total) | 0);

  for (let r = 0; r < N; r++) {
    for (let c = 0; c < N; c++) {
      const k = r * N + c;
      if (!keep.has(k)) board[r][c] = null;
    }
  }
}


export function generateGame(mode) {
  let base, blockRows, blockCols, keep;
  if (mode === "easy") {
    base = 6; blockRows = 2; blockCols = 3; keep = 18;
  } else {
    base = 9; blockRows = 3; blockCols = 3; keep = 28 + ((Math.random() * 3) | 0);
  }

  const board = fillBoard(base);
  swapRowsWithinGroup(board);
  swapColsWithinGroup(board);
  swapRowGroups(board);
  swapColGroups(board);
  swapNums(board);

  const solution = deepCopy(board);
  
  removeNums(board, keep);
  const puzzle = board;

  return { base, blockRows, blockCols, solution, puzzle };
}

export function inRange(v, base) {
  return Number.isInteger(v) && v >= 1 && v <= base;
}

export function isComplete(grid) {
  for (const row of grid) for (const v of row) if (v == null) return false;
  return true;
}

export function findConflicts(grid, base, br, bc) {
  const bad = new Set();
  // row
  for (let r = 0; r < base; r++) {
    const seen = new Map();
    for (let c = 0; c < base; c++) {
      const v = grid[r][c];
      if (v == null) continue;
      const k = `r${r}-${v}`;
      if (seen.has(k)) {
        bad.add(`${r}-${c}`);
        bad.add(`${r}-${seen.get(k)}`);
      } else {
        seen.set(k, c);
      }
    }
  }
  // column
  for (let c = 0; c < base; c++) {
    const seen = new Map();
    for (let r = 0; r < base; r++) {
      const v = grid[r][c];
      if (v == null) continue;
      const k = `c${c}-${v}`;
      if (seen.has(k)) {
        bad.add(`${r}-${c}`);
        bad.add(`${seen.get(k)}-${c}`);
      } else {
        seen.set(k, r);
      }
    }
  }
  // subcell
  for (let bri = 0; bri < base; bri += br) {
    for (let bci = 0; bci < base; bci += bc) {
      const seen = new Map();
      for (let r = 0; r < br; r++) {
        for (let c = 0; c < bc; c++) {
          const rr = bri + r, cc = bci + c;
          const v = grid[rr][cc];
          if (v == null) continue;
          const k = `b${bri}-${bci}-${v}`;
          if (seen.has(k)) {
            bad.add(`${rr}-${cc}`);
            bad.add(`${seen.get(k)}`);
          } else {
            seen.set(k, `${rr}-${cc}`);
          }
        }
      }
    }
  }
  return bad;
}
