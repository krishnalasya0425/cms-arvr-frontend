// src/pages/Register.jsx
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";

const Register = () => {
  const [username, setUsername] = useState(""); // We'll set username = email by default
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAdminChecked, setIsAdminChecked] = useState(false);
  const [adminExists, setAdminExists] = useState(false);
  const [error, setError] = useState("");
  const [loadingAdminCheck, setLoadingAdminCheck] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        setLoadingAdminCheck(true);
        const res = await api.get("/auth/admin-exists");
        setAdminExists(Boolean(res.data.exists));
      } catch (err) {
        console.warn("admin-exists check failed — defaulting to no admin", err?.message);
        setAdminExists(false);
      } finally {
        setLoadingAdminCheck(false);
      }
    };

    checkAdmin();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const payload = {
        username: email, // keep username = email
        email,
        password,
        role: isAdminChecked ? "admin" : "user",
      };

      await api.post("/auth/register", payload);

      // After successful registration, go to login page
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md">
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-xl rounded-2xl p-8 border border-gray-100"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
            <p className="text-gray-600 mt-2">Sign up to get started</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setUsername(e.target.value);
                }}
                placeholder="you@example.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Choose a strong password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            {/* Admin checkbox */}
            <div>
              {loadingAdminCheck ? (
                <div className="text-sm text-gray-500">Checking account setup...</div>
              ) : (
                <>
                  {!adminExists && (
                    <label className="inline-flex items-center space-x-2 text-gray-700">
                      <input
                        type="checkbox"
                        checked={isAdminChecked}
                        onChange={(e) => setIsAdminChecked(e.target.checked)}
                        className="h-4 w-4"
                      />
                      <span className="text-sm">Create this account as Admin (only one allowed)</span>
                    </label>
                  )}

                </>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              Register
            </button>
          </div>

          <div className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-600 font-medium hover:text-blue-700 hover:underline transition-colors duration-200"
            >
              Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
