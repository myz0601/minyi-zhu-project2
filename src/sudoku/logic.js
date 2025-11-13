function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = (Math.random() * (i + 1)) | 0;
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function doSwap() { return Math.random() < 0.5; }
function swap(arr, i, j) { const t = arr[i]; arr[i] = arr[j]; arr[j] = t; }
function deepCopy(g) { return g.map(r => r.slice()); }

function getBlockDims(size) {
  if (size === 6) return { blockRows: 2, blockCols: 3 };
  // default 9x9
  return { blockRows: 3, blockCols: 3 };
}

// build a valid full board
function fillBoard(size) {
  const { blockRows, blockCols } = getBlockDims(size);
  const board = Array.from({ length: size }, () => Array(size).fill(0));

  for (let r = 0; r < size; r++) {
    const groupIdx = Math.floor(r / blockRows);
    const rowInGroup = r % blockRows;
    // shift by (rowInGroup * blockCols + groupIdx)
    const shift = (rowInGroup * blockCols + groupIdx) % size;
    for (let c = 0; c < size; c++) board[r][c] = (c + shift) % size + 1;
  }
  return board;
}

function swapRowsWithinGroup(board) {
  const N = board.length;
  const { blockRows } = getBlockDims(N);
  const numGroup = Math.floor(N / blockRows);

  for (let g = 0; g < numGroup; g++) {
    const s = g * blockRows;
    for (let i = 0; i < blockRows - 1; i++) {
      for (let j = i + 1; j < blockRows; j++) {
        if (doSwap()) swap(board, s + i, s + j);
      }
    }
  }
}

function swapColsWithinGroup(board) {
  const N = board.length;
  const { blockCols } = getBlockDims(N);
  const numGroup = Math.floor(N / blockCols);

  for (let g = 0; g < numGroup; g++) {
    const s = g * blockCols;
    for (let i = 0; i < blockCols - 1; i++) {
      for (let j = i + 1; j < blockCols; j++) {
        if (!doSwap()) continue;
        const c1 = s + i, c2 = s + j;
        if (c1 >= N || c2 >= N) continue;
        for (let r = 0; r < N; r++) {
          const row = board[r];
          const t = row[c1]; row[c1] = row[c2]; row[c2] = t;
        }
      }
    }
  }
}

function swapRowGroups(board) {
  const N = board.length;
  const { blockRows } = getBlockDims(N);
  const numGroup = Math.floor(N / blockRows);

  for (let a = 0; a < numGroup; a++) {
    for (let b = a + 1; b < numGroup; b++) {
      if (!doSwap()) continue;
      const sa = a * blockRows;
      const sb = b * blockRows;
      for (let k = 0; k < blockRows; k++) swap(board, sa + k, sb + k);
    }
  }
}

function swapColGroups(board) {
  const N = board.length;
  const { blockCols } = getBlockDims(N);
  const numGroup = Math.floor(N / blockCols);

  for (let a = 0; a < numGroup; a++) {
    for (let b = a + 1; b < numGroup; b++) {
      if (!doSwap()) continue;
      const sa = a * blockCols;
      const sb = b * blockCols;
      for (let k = 0; k < blockCols; k++) {
        const c1 = sa + k, c2 = sb + k;
        for (let r = 0; r < N; r++) {
          const row = board[r];
          const t = row[c1]; row[c1] = row[c2]; row[c2] = t;
        }
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

function isSafe(board, r, c, v, br, bc) {
  const N = board.length;
  for (let k = 0; k < N; k++) {
    if (board[r][k] === v) return false;
    if (board[k][c] === v) return false;
  }
  const r0 = Math.floor(r / br) * br, c0 = Math.floor(c / bc) * bc;
  for (let i = 0; i < br; i++) for (let j = 0; j < bc; j++) {
    if (board[r0 + i][c0 + j] === v) return false;
  }
  return true;
}

function findEmpty(board) {
  const N = board.length;
  for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) {
    if (board[r][c] == null) return [r, c];
  }
  return null;
}

// count solutions; return as soon as >= limit (we use limit=2)
function countSolutions(board, br, bc, limit = 2) {
  const pos = findEmpty(board);
  if (!pos) return 1;
  const [r, c] = pos;
  const N = board.length;

  let cnt = 0;
  for (let v = 1; v <= N; v++) {
    if (isSafe(board, r, c, v, br, bc)) {
      board[r][c] = v;
      cnt += countSolutions(board, br, bc, limit);
      board[r][c] = null;
      if (cnt >= limit) return cnt;
    }
  }
  return cnt;
}

// remove with uniqueness check: try to erase; if multi-solution then revert
function removeNumsUnique(board, numsLeft, br, bc) {
  const N = board.length;
  const total = N * N;
  const cells = shuffle(Array.from({ length: total }, (_, k) => [ (k / N) | 0, k % N ]));

  let kept = total;
  for (const [r, c] of cells) {
    if (kept <= numsLeft) break;
    const bak = board[r][c];
    if (bak == null) continue;

    board[r][c] = null;

    const tmp = deepCopy(board);
    const sol = countSolutions(tmp, br, bc, 2); // >=2 means NOT unique
    if (sol !== 1) {
      // not unique
      board[r][c] = bak;
    } else {
      kept--;
    }
  }
}

export function generateGame(mode) {
  let base, blockRows, blockCols, keep;
  if (mode === "easy") {
    base = 6;  ({ blockRows, blockCols } = getBlockDims(6));  keep = 18;
  } else {
    base = 9;  ({ blockRows, blockCols } = getBlockDims(9));  keep = 28 + ((Math.random() * 3) | 0);
  }

  const board = fillBoard(base);
  swapRowsWithinGroup(board);
  swapColsWithinGroup(board);
  swapRowGroups(board);
  swapColGroups(board);
  swapNums(board);

  const solution = deepCopy(board);


  removeNumsUnique(board, keep, blockRows, blockCols);
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
  // rows
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
  // cols
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
  // boxes
  for (let bri = 0; bri < base; bri += br) {
    for (let bci = 0; bci < base; bci += bc) {
      const seen = new Map();
      for (let i = 0; i < br; i++) {
        for (let j = 0; j < bc; j++) {
          const rr = bri + i, cc = bci + j;
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


export function candidatesAt(grid, base, br, bc, r, c) {
  if (grid[r][c] != null) return [];
  const out = [];
  for (let v = 1; v <= base; v++) {
    if (isSafe(grid, r, c, v, br, bc)) out.push(v);
  }
  return out;
}

// find the first valid cell
export function findFirst(grid, base, br, bc) {
  for (let r = 0; r < base; r++) {
    for (let c = 0; c < base; c++) {
      if (grid[r][c] != null) continue;
      const cand = candidatesAt(grid, base, br, bc, r, c);
      if (cand.length === 1) return { r, c };
    }
  }
  return null;
}