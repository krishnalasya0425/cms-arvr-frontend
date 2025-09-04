export default function Dashboard({ setIsLoggedIn }) {
  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
      <h1 className="text-3xl font-bold mb-6">Welcome to Dashboard 🎉</h1>
      <button
        onClick={handleLogout}
        className="bg-white text-black px-6 py-2 rounded-lg hover:bg-gray-200 transition"
      >
        Logout
      </button>
    </div>
  );
}
