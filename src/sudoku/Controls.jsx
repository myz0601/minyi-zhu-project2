import { useSudoku } from "./sudokuContext";

export default function Controls() {
  const { state, dispatch } = useSudoku();
  return (
    <div className="controls">
      <button className="btn" onClick={() => dispatch({ type: "NEW_GAME" })}>New Game</button>
      <button className="btn" onClick={() => dispatch({ type: "RESET" })}>Reset</button>
    </div>
  );
}
