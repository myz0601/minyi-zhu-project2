import { NavLink } from "react-router-dom";
import "../styles/common.css";

export default function Navbar() {
  return (
    <div className="navbar">
      <span className="logo">Sudoku Game</span>

      <input type="checkbox" id="menu-toggle" />
      <label htmlFor="menu-toggle" className="menu-icon">☰</label>

      <div className="menu">
        <NavLink to="/" end className={({isActive}) => isActive ? "active" : ""}>Home</NavLink>
        <NavLink to="/games" end className={({isActive}) => isActive ? "active" : ""}>Game Selection</NavLink>
        <NavLink to="/games/easy" className={({isActive}) => isActive ? "active" : ""}>Easy Game</NavLink>
        <NavLink to="/games/normal" className={({isActive}) => isActive ? "active" : ""}>Normal Game</NavLink>
        <NavLink to="/rules" className={({isActive}) => isActive ? "active" : ""}>Rules</NavLink>
        <NavLink to="/scores" className={({isActive}) => isActive ? "active" : ""}>High Scores</NavLink>
        <NavLink to="/login" className={({isActive}) => isActive ? "active" : ""}>Login</NavLink>
        <NavLink to="/register" className={({isActive}) => isActive ? "active" : ""}>Register</NavLink>
      </div>
    </div>
  );
}