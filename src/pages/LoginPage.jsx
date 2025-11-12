import "../styles/common.css";
import "../styles/login.css";
import { useEffect } from "react";

function useBodyClass(cls) {
  useEffect(() => {
    document.body.classList.add(cls);
    return () => document.body.classList.remove(cls);
  }, [cls]);
}

export default function LoginPage() {
  useBodyClass("login");

  return (
    <>
      <img src="/images/bg1.jpg" alt="Sudoku background" className="bg-img" />

      <div className="container login-card">
        <h1>Login</h1>
        <form className="auth-form">
          <label htmlFor="username">Username</label>
          <input id="username" name="username" placeholder="Enter username" />

          <label htmlFor="password">Password</label>
          <input id="password" name="password" type="password" placeholder="Enter password" />

          <button type="button">Login</button>
        </form>
      </div>
    </>
  );
}