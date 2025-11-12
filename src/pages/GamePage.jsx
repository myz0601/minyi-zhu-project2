import { SudokuProvider, useSudoku } from "../sudoku/SudokuContext";
import Board from "../sudoku/Board";
import Controls from "../sudoku/Controls";
import Timer from "../sudoku/Timer";
import "../styles/common.css";
import "../styles/game.css";
import { useEffect } from "react";

function useBodyClass(cls) {
  useEffect(() => {
    document.body.classList.add(cls);
    return () => document.body.classList.remove(cls);
  }, [cls]);
}

function WinBanner() {
  const { state } = useSudoku();
  if (state.status !== "won") return null;
  return <div className="win-banner">🎉 Congratulations! Puzzle solved.</div>;
}

function GameInner({ mode }) {
  useBodyClass("game");

  const title =
    mode === "easy"
      ? "Good luck on Easy Sudoku!"
      : "Good luck on Normal Sudoku!";

  useEffect(() => {
    const old = document.title;
    document.title = title;
    return () => { document.title = old; };
  }, [title]);

  return (
    <>
      <img src="/images/bg1.jpg" alt="" className="bg-img" />

      <div className="container game-container">
        <h1 className="page-title">{title}</h1>

        <div className="game-card">
          <div className="header-timer"><Timer /></div>
          <WinBanner />
          <Board />
          <Controls />
        </div>
      </div>
    </>
  );
}

export default function GamePage({ mode }) {
  return (
    <SudokuProvider initialMode={mode}>
      <GameInner mode={mode} />
    </SudokuProvider>
  );
}
