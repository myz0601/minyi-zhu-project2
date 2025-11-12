import "../styles/common.css";
import "../styles/scores.css";
import { useEffect } from "react";

function useBodyClass(cls) {
  useEffect(() => {
    document.body.classList.add(cls);
    return () => document.body.classList.remove(cls);
  }, [cls]);
}

export default function ScoresPage() {
  useBodyClass("scores");

  const rows = [
    { rank: 1,  user: "Lily",   done: 23 },
    { rank: 2,  user: "John",   done: 17 },
    { rank: 3,  user: "Alice",  done: 16 },
    { rank: 4,  user: "Aiden",  done: 10 },
    { rank: 5,  user: "David",  done: 6  },
    { rank: 6,  user: "Sofia",  done: 5  },
    { rank: 7,  user: "Ethan",  done: 3  },
    { rank: 8,  user: "Chloe",  done: 1  },
    { rank: 9,  user: "Daniel", done: 0  },
  ];

  return (
    <>
      <img src="/images/bg1.jpg" alt="Sudoku background" className="bg-img" />

      <div className="container scores-card">
        <h1>High Scores</h1>
        <table className="score-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Username</th>
              <th>Sudokus Completed</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.rank}>
                <td>{r.rank}</td>
                <td>{r.user}</td>
                <td>{r.done}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}