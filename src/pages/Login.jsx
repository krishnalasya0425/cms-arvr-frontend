import { useState } from "react";
import { showSuccess, showError } from "../components/Toast";

export default function Login({ setPage, setIsLoggedIn }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.token);
        setIsLoggedIn(true);
        showSuccess("Logged in successfully!");
      } else {
        showError(data.message || "Login failed");
      }
    } catch (err) {
      showError("Server error");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-end bg-cover bg-center pr-32"
      style={{ backgroundImage: "url('/pin2.jpg')" }}
    >
      <div className="p-8 rounded-2xl shadow-lg w-96 bg-black/70 border border-cyan-400 backdrop-blur-sm">
        <h2 className="text-2xl font-bold text-center text-cyan-300 mb-6">
          Login
        </h2>

        <input
          type="text"
          placeholder="Enter Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full px-4 py-3 mb-4 rounded-xl border border-cyan-400 bg-black/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
        />

        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-3 mb-4 rounded-xl border border-cyan-400 bg-black/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
        />

        <button
          onClick={handleLogin}
          className="w-full bg-cyan-500 text-black font-semibold py-3 rounded-xl hover:bg-cyan-400 transition shadow-lg shadow-cyan-500/40"
        >
          Login
        </button>

        <p className="mt-4 text-center text-cyan-300 font-medium">
          Don&apos;t have an account?{" "}
          <span
            onClick={() => setPage("register")}
            className="cursor-pointer underline hover:text-cyan-400"
          >
            Register
          </span>
        </p>
      </div>
    </div>
  );
}
