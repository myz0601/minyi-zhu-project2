import { createContext, useContext, useReducer, useMemo, useEffect } from "react";
import { generateGame, findConflicts, inRange, isComplete } from "./logic";

const SudokuCtx = createContext(null);

const initialState = {
  mode: "normal",
  base: 9,
  blockRows: 3,
  blockCols: 3,
  puzzle: [],
  solution: [],
  grid: [],
  given: [],
  conflicts: new Set(),
  status: "playing",
  startedAt: null,
  elapsedMs: 0,
  locked: false,
};

const makeGiven = (puzzle) => puzzle.map(row => row.map(v => v != null));
const cloneGrid = (g) => g.map(r => r.slice());

function reducer(state, action) {
  switch (action.type) {
    case "NEW_GAME": {
      const mode = action.mode ?? state.mode;
      const { base, blockRows, blockCols, puzzle, solution } = generateGame(mode);
      const grid = puzzle.map(r => r.slice());
      const given = makeGiven(puzzle);
      const conflicts = findConflicts(grid, base, blockRows, blockCols);
      return {
        ...state,
        mode, base, blockRows, blockCols,
        puzzle, solution, grid, given,
        conflicts, status: "playing", locked: false,
        startedAt: Date.now(), elapsedMs: 0,
      };
    }
    case "RESET": {
      const grid = state.puzzle.map(r => r.slice());
      const conflicts = findConflicts(grid, state.base, state.blockRows, state.blockCols);
      return { ...state, grid, conflicts, status: "playing", locked: false, startedAt: Date.now(), elapsedMs: 0 };
    }
    case "TICK": {
      if (state.status !== "playing") return state;
      return { ...state, elapsedMs: Date.now() - (state.startedAt ?? Date.now()) };
    }
    case "UPDATE_CELL": {
      if (state.locked) return state;
      const { r, c, value } = action;
      if (state.given[r][c]) return state;

      const v = inRange(value, state.base) ? value : null;

      const grid = cloneGrid(state.grid);
      grid[r][c] = v;

      const allConflicts = findConflicts(
        grid,
        state.base,
        state.blockRows,
        state.blockCols
      );

      const displayConflicts = new Set(
        [...allConflicts].filter((key) => {
          const [rr, cc] = key.split("-").map(Number);
          return !state.given[rr][cc] && grid[rr][cc] != null;
        })
      );

      let status = state.status;
      let locked = state.locked;
      if (isComplete(grid) && allConflicts.size === 0) {
        status = "won";
        locked = true;
      }

      return { ...state, grid, conflicts: displayConflicts, status, locked };
    }
    default:
      return state;
  }
}

export function SudokuProvider({ children, initialMode = "normal" }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => { dispatch({ type: "NEW_GAME", mode: initialMode }); }, [initialMode]);

  useEffect(() => {
    const t = setInterval(() => dispatch({ type: "TICK" }), 500);
    return () => clearInterval(t);
  }, []);

  const value = useMemo(() => ({ state, dispatch }), [state, dispatch]);
  return <SudokuCtx.Provider value={value}>{children}</SudokuCtx.Provider>;
}

export function useSudoku() {
  const ctx = useContext(SudokuCtx);
  if (!ctx) throw new Error("useSudoku must be used within SudokuProvider");
  return ctx;
}