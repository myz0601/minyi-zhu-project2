import { useSudoku } from "./SudokuContext";

export default function Controls() {
  const { state, dispatch } = useSudoku();

  function handleNewGame() {
    dispatch({ type: "NEW_GAME" });
  }

  function handleReset() {
    dispatch({ type: "RESET" });
  }

  function handleHint() {
    dispatch({ type: "FIND_HINT" });
  }

  return (
    <div className="controls">
      <button className="btn" onClick={handleNewGame}>
        New Game
      </button>
      <button className="btn" onClick={handleReset}>
        Reset
      </button>
      <button
        className="btn"
        onClick={handleHint}
        disabled={state.locked}
      >
        Hint
      </button>
    </div>
  );
}
