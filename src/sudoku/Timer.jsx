import { useSudoku } from "./sudokuContext";

const fmt = (ms) => {
  const s = Math.floor(ms / 1000);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const ss = s % 60;
  const pad = (n) => String(n).padStart(2, "0");
  return h ? `${h}:${pad(m)}:${pad(ss)}` : `${m}:${pad(ss)}`;
};

export default function Timer() {
  const { state } = useSudoku();
  return <div className="timer">⏱ {fmt(state.elapsedMs)}</div>;
}
