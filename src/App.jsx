import { useState, useEffect } from "react";
import axios from "axios";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("login"); 

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      setIsLoggedIn(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
        setIsLoggedIn(true);
      } catch (err) {
        console.error(err);
        localStorage.removeItem("token");
        setIsLoggedIn(false);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (isLoggedIn) {
    return <Dashboard setIsLoggedIn={setIsLoggedIn} />;
  }


  return (
    <>
      {page === "login" ? (
        <Login setPage={setPage} setIsLoggedIn={setIsLoggedIn} />
      ) : (
        <Register setPage={setPage} />
      )}
    </>
  );
}
