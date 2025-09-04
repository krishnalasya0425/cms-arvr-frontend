import { useState, useEffect } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

function App() {
  const [page, setPage] = useState("login");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check if token exists
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setIsLoggedIn(true);
  }, []);

  if (isLoggedIn) {
    return <Dashboard setIsLoggedIn={setIsLoggedIn} />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      {page === "login" ? (
        <Login setPage={setPage} setIsLoggedIn={setIsLoggedIn} />
      ) : (
        <Register setPage={setPage} />
      )}
    </div>
  );
}

export default App;
