import { useState } from "react";
import InputField from "../components/InputField";

export default function Login({ setPage, setIsLoggedIn, setUserRole }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setIsLoggedIn(true);
        setUserRole(data.user.role);
      } else {
        setError(data.message || "Login failed");
      }
    } catch {
      setError("Server error, please try again.");
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg w-96 text-black">
      <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

      {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

      <InputField
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <InputField
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        onClick={handleLogin}
        className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Login
      </button>

      <p className="text-sm text-gray-600 mt-4 text-center">
        Don’t have an account?{" "}
        <button
          onClick={() => setPage("register")}
          className="text-blue-600 hover:underline"
        >
          Register
        </button>
      </p>
    </div>
  );
}
