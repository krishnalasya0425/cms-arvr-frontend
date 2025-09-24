import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function LandingPage({ setPage }) {
  const navigate=useNavigate()
  return (
    <div className="relative min-h-screen overflow-hidden text-white">
      {/* Base Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-indigo-950 to-emerald-950"></div>

      {/* Fog Layers */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/clouds.png')] opacity-20 animate-fog"></div>
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/foggy-birds.png')] opacity-15 animate-fog-reverse"></div>

      {/* VR Holographic Grid */}
      <div className="absolute inset-0 opacity-30">
        <svg className="w-full h-full">
          <defs>
            <pattern
              id="grid"
              width="80"
              height="80"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 80 0 L 0 0 0 80"
                fill="none"
                stroke="rgba(0,255,200,0.2)"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)">
            <animateTransform
              attributeName="transform"
              type="translate"
              from="0 0"
              to="80 80"
              dur="15s"
              repeatCount="indefinite"
            />
          </rect>
        </svg>
      </div>

      {/* Floating VR Particles */}
      {Array.from({ length: 10 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_12px_rgba(0,255,255,0.9)]"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
          animate={{ y: [0, -50, 0], opacity: [0.3, 1, 0.3] }}
          transition={{
            duration: 8 + i,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Navbar */}
      <nav className="flex justify-between items-center p-6 relative z-10">
        <h1 className="text-2xl font-bold text-cyan-300">AR/VR</h1>
        <div className="space-x-4">
          <button
             onClick={() => navigate("/login")}
            className="px-4 py-2 border border-cyan-300 text-cyan-300 rounded hover:bg-cyan-300 hover:text-black transition"
          >
            Login
          </button>
          <button
            onClick={() => setPage("register")}
            className="px-4 py-2 bg-cyan-400 text-black rounded hover:bg-cyan-500 transition"
          >
            Sign Up
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[80vh] text-center px-6">
        <h2 className="text-6xl font-bold mb-6 text-cyan-200 drop-shadow-[0_0_25px_rgba(0,255,200,0.8)]">
          Create something related to our project
        </h2>
        <p className="text-lg md:text-xl max-w-xl text-gray-300 opacity-90">
          Generate. Visualize. Interact.
        </p>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes fogMove {
          from { background-position: 0 0; }
          to { background-position: 2000px 0; }
        }
        .animate-fog {
          animation: fogMove 60s linear infinite;
        }
        .animate-fog-reverse {
          animation: fogMove 90s linear infinite reverse;
        }
      `}</style>
    </div>
  );
}