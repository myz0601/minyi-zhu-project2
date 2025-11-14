import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./styles/common.css";
import Navbar from "./pages/Navbar.jsx";
import HomePage from "./pages/HomePage.jsx";
import SelectionPage from "./pages/SelectionPage.jsx";
import RulesPage from "./pages/RulesPage.jsx";
import ScoresPage from "./pages/ScoresPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import GamePage from "./pages/GamePage.jsx";


export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/games" element={<SelectionPage />} />
        <Route path="/games/easy" element={<GamePage mode="easy" />} />
        <Route path="/games/normal" element={<GamePage mode="normal" />} />
        <Route path="/rules" element={<RulesPage />} />
        <Route path="/scores" element={<ScoresPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </BrowserRouter>
  );
}
