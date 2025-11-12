import "../styles/common.css";
import "../styles/register.css";
import { useEffect } from "react";

function useBodyClass(cls) {
  useEffect(() => {
    document.body.classList.add(cls);
    return () => document.body.classList.remove(cls);
  }, [cls]);
}

export default function RegisterPage() {
  useBodyClass("register");

  return (
    <>
      <img src="/images/bg1.jpg" alt="Sudoku background" className="bg-img" />

      <div className="container register-card">
        <h1>Create an Account</h1>
        <form className="auth-form">
          <label htmlFor="username">Username</label>
          <input id="username" name="username" placeholder="Enter username" />

          <label htmlFor="password">Password</label>
          <input id="password" name="password" type="password" placeholder="Enter password" />

          <label htmlFor="confirm-password">Verify Password</label>
          <input id="confirm-password" name="confirm-password" type="password" placeholder="Re-enter password" />

          <button type="button">Register</button>
        </form>
      </div>
    </>
  );
}