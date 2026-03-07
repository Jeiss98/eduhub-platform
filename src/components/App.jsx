import { useState } from "react";
import Landing from "./Landing";
import Login from "./Login";
import Dashboard from "./Dashboard";

export default function App() {
  // "landing" | "login" | "dashboard"
  const [page, setPage] = useState("landing");
  const [usuario, setUsuario] = useState(null);

  const goTo = (p) => setPage(p);

  const handleLogin = (user) => {
    setUsuario(user);
    setPage("dashboard");
  };

  const handleLogout = () => {
    setUsuario(null);
    setPage("login");
  };

  if (page === "landing")   return <Landing onLogin={() => goTo("login")} />;
  if (page === "login")     return <Login onLogin={handleLogin} onBack={() => goTo("landing")} />;
  if (page === "dashboard") return <Dashboard usuario={usuario} onLogout={handleLogout} />;
}
