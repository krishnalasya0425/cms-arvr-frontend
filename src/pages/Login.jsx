import { useState } from "react";
import { showSuccess, showError } from "../components/toast";
import { useNavigate } from "react-router-dom";

export default function Login({ setIsLoggedIn }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      // safely parse JSON
      const data = await res.json().catch(() => null);

      if (res.ok && data?.token) {
        localStorage.setItem("token", data.token);
        setIsLoggedIn(true);
        showSuccess("Logged in successfully!");
        navigate("/dashboard"); // redirect after login
      } else {
        showError(data?.message || "Login failed");
      }
    } catch (err) {
      console.error(err);
      showError("Server error");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('/bgiiii.png')" }}
    >
      <div className="p-8 rounded-2xl shadow-lg w-96 bg-green-50">
        <h2 className="text-2xl font-bold text-center text-green-900 mb-6">Login</h2>
        <input
          type="text"
          placeholder="Enter Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full px-4 py-3 mb-4 rounded-xl border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-3 mb-4 rounded-xl border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <button
          onClick={handleLogin}
          className="w-full bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 transition"
        >
          Login
        </button>
        <p className="mt-4 text-center text-green-800 font-medium no-underline">
          Don’t have an account?{" "}
          <span
            onClick={() => navigate("/register")}
            className="cursor-pointer underline"
          >
            Register
          </span>
        </p>
      </div>
    </div>
  );
}