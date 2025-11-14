import "../styles/common.css";
import "../styles/selection.css";
import { useEffect } from "react";
import { Link } from "react-router-dom";

function useBodyClass(cls) {
  useEffect(function () {
    document.body.classList.add(cls);
    return function () {
      document.body.classList.remove(cls);
    };
  }, [cls]);
}

export default function SelectionPage() {
  useBodyClass("selection");

  const items = [
    { title: "Classic Sudoku",  author: "Lily",   mode: "normal" },
    { title: "Freestyle Sudoku",author: "John",   mode: "easy"   },
    { title: "Modern Sudoku",   author: "Alice",  mode: "normal" },
    { title: "Interest Sudoku", author: "Aiden",  mode: "easy"   },
    { title: "Fun Sudoku",      author: "David",  mode: "normal" },
    { title: "Galaxy Sudoku",   author: "Sophia", mode: "easy"   },
    { title: "Rainbow Sudoku",  author: "Ethan",  mode: "normal" },
    { title: "Mystery Sudoku",  author: "Chloe",  mode: "easy"   },
    { title: "Samurai Sudoku",  author: "Daniel", mode: "normal" },
  ];

  return (
    <>
      <img src="/images/bg1.jpg" alt="Sudoku background" className="bg-img" />
      <div className="container">
        <h1>Select a Game</h1>
        <ul className="game-list">
          {items.map(function (it) {
            return (
              <li key={it.title}>
                <Link
                  to={"/games/" + it.mode}
                  aria-label={it.title + " game"}
                >
                  {it.title}
                </Link>
                <span className="author">Author: {it.author}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}
