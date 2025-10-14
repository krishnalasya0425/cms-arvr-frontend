import { useAuth } from "../context/AuthContext";

const UserDashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">User Dashboard</h1>
      <p>Welcome, {user?.username}</p>
      <p>Role: {user?.role}</p>
      <button
        onClick={logout}
        className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
      >
        Logout
      </button>
    </div>
  );
};

export default UserDashboard;
