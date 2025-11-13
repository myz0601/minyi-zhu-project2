import { useSudoku } from "./SudokuContext";

export default function Cell({ r, c, value, given, error, isHint = false, extraClass = "" }) {
  const { state, dispatch } = useSudoku();
  const base = state.base;

  const onChange = (e) => {
    const ch = (e.target.value || "").trim().slice(0, 1);
    const n = Number(ch);
    if (!Number.isInteger(n) || n < 1 || n > base) {
      dispatch({ type: "UPDATE_CELL", r, c, value: null });
    } else {
      dispatch({ type: "UPDATE_CELL", r, c, value: n });
    }
  };

  const onKeyDown = (e) => {
    if (e.key === "Backspace" || e.key === "Delete") {
      dispatch({ type: "UPDATE_CELL", r, c, value: null });
    }
  };

  const cls =
    "cell" +
    (given ? " given" : "") +
    (error ? " error" : "") +
    (isHint ? " hint" : "") +
    extraClass;

  return (
    <div className={cls}>
      {given ? (
        <span className="cell-text">{value}</span>
      ) : (
        <input
          className="cell-input"
          inputMode="numeric"
          maxLength={1}
          value={value == null ? "" : String(value)}
          onChange={onChange}
          onKeyDown={onKeyDown}
          disabled={state.locked}
          aria-label={`r${r + 1} c${c + 1}`}
        />
      )}
    </div>
  );
}
