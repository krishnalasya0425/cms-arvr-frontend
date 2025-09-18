import { useState } from "react";
import { showSuccess, showError } from "../components/Toast";

export default function Register({ setPage }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();
      console.log(data);
      
      if (res.ok) {
        showSuccess("Registered successfully!");
        setTimeout(() => setPage("login"), 1500);
      } else {
        showError(data.message || "Registration failed");
      }
    } catch (err) {
      showError("Server error");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('/bgiiii.png')" }}
    >
      <div className="p-8 rounded-2xl shadow-lg w-96 bg-green-50">
        <h2 className="text-2xl font-bold text-center text-green-900 mb-6">Register</h2>
        <input
          type="text"
          placeholder="Enter Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full px-4 py-3 mb-4 rounded-xl border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
          onClick={handleRegister}
          className="w-full bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 transition"
        >
          Register
        </button>
        <p className="mt-4 text-center text-green-800 font-medium no-underline">
          Already have an account?{" "}
          <span onClick={() => setPage("login")} className="cursor-pointer underline">
            Login
          </span>
        </p>
      </div>
    </div>
  );
}
