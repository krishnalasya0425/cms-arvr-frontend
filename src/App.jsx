import { useState, useEffect } from "react";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [page, setPage] = useState("landing"); // Start with landing page
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setIsLoggedIn(true);
  }, []);

  return (
    <>
      {page === "landing" ? (
        <LandingPage setPage={setPage} /> // Show landing first
      ) : page === "login" ? (
        <Login setPage={setPage} setIsLoggedIn={setIsLoggedIn} />
      ) : (
        <Register setPage={setPage} />
      )}
      <ToastContainer position="bottom-center" autoClose={2000} hideProgressBar />
    </>
  );
}

export default App;
