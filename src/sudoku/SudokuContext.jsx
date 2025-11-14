import { createContext, useContext, useReducer, useMemo, useEffect } from "react";
import { generateGame, findConflicts, inRange, isFull, findFirst } from "./logic";

const SudokuCtx = createContext(null);

const initialState = {
  mode: "normal",
  size: 9,
  blockRows: 3,
  blockCols: 3,

  init_board: [],
  final_board: [],
  curr_board: [],
  bool_init: [],

  conflicts: new Set(),
  status: "playing",
  startedAt: null,
  elapsedMs: 0,
  locked: false,
  hint: null,
};

// make init board a boolean matrix
function makeBoolean(init_board) {
  return init_board.map(function (row) {
    return row.map(function (v) {
      return v != null;
    });
  });
}

// clone a 2D board
function cloneBoard(g) {
  return g.map(function (r) {
    return r.slice();
  });
}

function reducer(state, action) {
  switch (action.type) {
    case "NEW_GAME": {
      // build a fresh init_board using the given mode
      let mode = action.mode;
      if (mode == null) {
        mode = state.mode;
      }

      const game = generateGame(mode);
      const size = game.size;
      const blockRows = game.blockRows;
      const blockCols = game.blockCols;
      const init_board = game.init_board;
      const final_board = game.final_board;

      const curr_board = init_board.map(function (r) { return r.slice(); });
      const bool_init = makeBoolean(init_board);
      const conflicts = findConflicts(curr_board, size, blockRows, blockCols);

      return {
        ...state,
        mode: mode,
        size: size,
        blockRows: blockRows,
        blockCols: blockCols,
        init_board: init_board,
        final_board: final_board,
        curr_board: curr_board,
        bool_init: bool_init,
        conflicts: conflicts,
        status: "playing",
        locked: false,
        startedAt: Date.now(),
        elapsedMs: 0,
        hint: null,
      };
    }

    // reset current board
    case "RESET": {
      const curr_board = state.init_board.map(function (r) { return r.slice(); });
      const conflicts = findConflicts(
        curr_board,
        state.size,
        state.blockRows,
        state.blockCols
      );
      return {
        ...state,
        curr_board: curr_board,
        conflicts: conflicts,
        status: "playing",
        locked: false,
        startedAt: Date.now(),
        elapsedMs: 0,
        hint: null,
      };
    }

    // provide a hint
    case "FIND_HINT": {
      if (state.locked) {
        return { ...state, hint: null };
      }
      const size = state.size;
      const blockRows = state.blockRows;
      const blockCols = state.blockCols;
      const curr_board = state.curr_board;
      const hit = findFirst(curr_board, size, blockRows, blockCols);
      return { ...state, hint: hit };
    }

    // remove the current hint highlight
    case "CLEAR_HINT": {
      return { ...state, hint: null };
    }

    // timer tick: update elapsedMs only while playing
    case "TICK": {
      if (state.status !== "playing") {
        return state;
      }
      const startTime = state.startedAt != null ? state.startedAt : Date.now();
      return {
        ...state,
        elapsedMs: Date.now() - startTime,
      };
    }

    // handle user input at cell (r,c)
    case "UPDATE_CELL": {
      if (state.locked) {
        return state;
      }

      const r = action.r;
      const c = action.c;
      const value = action.value;

      // not allow editing of given cells
      if (state.bool_init[r][c]) {
        return state;
      }

      // normalize value: out of range -> clear cell
      const v = inRange(value, state.size) ? value : null;

      const curr_board = cloneBoard(state.curr_board);
      curr_board[r][c] = v;

      // compute all conflicts on the full board
      const allConflicts = findConflicts(
        curr_board,
        state.size,
        state.blockRows,
        state.blockCols
      );

      // only show conflicts on non-given, non-empty cells
      const displayConflicts = new Set(
        Array.from(allConflicts).filter(function (key) {
          const parts = key.split("-");
          const rr = Number(parts[0]);
          const cc = Number(parts[1]);
          return !state.bool_init[rr][cc] && curr_board[rr][cc] != null;
        })
      );

      let status = state.status;
      let locked = state.locked;
      let hint = state.hint;

      // clear the hint if the hinted cell is changed 
      if (hint && hint.r === r && hint.c === c) {
        hint = null;
      }

      // win when full board with no conflicts
      if (isFull(curr_board) && allConflicts.size === 0) {
        status = "won";
        locked = true;
        hint = null;
      }

      return {
        ...state,
        curr_board: curr_board,
        conflicts: displayConflicts,
        status: status,
        locked: locked,
        hint: hint,
      };
    }

    default:
      return state;
  }
}

export function SudokuProvider(props) {
  const children = props.children;
  const initialMode = props.initialMode != null ? props.initialMode : "normal";

  const [state, dispatch] = useReducer(reducer, initialState);

  // create a new game when initial mode changes
  useEffect(function () {
    dispatch({ type: "NEW_GAME", mode: initialMode });
  }, [initialMode]);

  // start a timer
  useEffect(function () {
    const t = setInterval(function () {
      dispatch({ type: "TICK" });
    }, 500);
    return function () {
      clearInterval(t);
    };
  }, []);

  const value = useMemo(function () {
    return { state: state, dispatch: dispatch };
  }, [state]);

  return (
    <SudokuCtx.Provider value={value}>
      {children}
    </SudokuCtx.Provider>
  );
}

export function useSudoku() {
  const ctx = useContext(SudokuCtx);
  if (!ctx) {
    throw new Error("useSudoku must be used within SudokuProvider");
  }
  return ctx;
}
