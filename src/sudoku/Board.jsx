import { useSudoku } from "./sudokuContext";
import Cell from "./Cell";

export default function Board() {
  const { state } = useSudoku();
  const { grid, given, conflicts, base, blockCols, blockRows } = state;

  return (
    <div
      className="board"
      style={{ "--n": base }}
    >
      {grid.map((row, r) =>
        row.map((val, c) => {
          const boxRight  = ((c + 1) % blockCols === 0 && c !== base - 1) ? " box-right" : "";
          const boxBottom = ((r + 1) % blockRows === 0 && r !== base - 1) ? " box-bottom" : "";

          return (
            <Cell
              key={`${r}-${c}`}
              r={r}
              c={c}
              value={val}
              given={!!given[r][c]}
              error={conflicts.has(`${r}-${c}`)}
              extraClass={boxRight + boxBottom}
            />
          );
        })
      )}
    </div>
  );
}
