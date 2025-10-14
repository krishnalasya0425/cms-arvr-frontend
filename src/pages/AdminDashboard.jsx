import { useAuth } from "../context/AuthContext";
import { useState, useRef, useEffect } from "react";
import { FaUserCircle } from "react-icons/fa";
import api from "../api/axios";
import ProjectsTab from "../components/ProjectsTab";
import UsersTab from "../components/UsersTab";

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const [activeTab, setActiveTab] = useState("projects"); // "projects" or "users"
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Project modal state
  const [projectName, setProjectName] = useState("");
  const [modules, setModules] = useState([
    { name: "", buildPath: "", subModules: [{ name: "", buildPath: "" }] },
  ]);
  const [assignedUser, setAssignedUser] = useState("");

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch projects
  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await api.get("/projects");
      setProjects(res.data);
    } catch (err) {
      console.error("Fetch projects error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch users
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get("/auth/all-users");
      setUsers(res.data);
    } catch (err) {
      console.error("Fetch users error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data when activeTab changes
  useEffect(() => {
    if (activeTab === "projects") fetchProjects();
    else if (activeTab === "users") fetchUsers();
  }, [activeTab]);

  // Delete user
  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await api.delete(`/auth/${id}`);
      setUsers(users.filter((u) => u._id !== id));
    } catch (err) {
      console.error("Delete user error:", err);
    }
  };

  // Module handlers (for ProjectsTab)
  const handleModuleChange = (index, field, value) => {
    const updatedModules = [...modules];
    updatedModules[index][field] = value;
    setModules(updatedModules);
  };

  const handleSubModuleChange = (moduleIndex, subIndex, field, value) => {
    const updatedModules = [...modules];
    updatedModules[moduleIndex].subModules[subIndex][field] = value;
    setModules(updatedModules);
  };

  const addModule = () =>
    setModules([
      ...modules,
      { name: "", buildPath: "", subModules: [{ name: "", buildPath: "" }] },
    ]);

  const addSubModule = (index) => {
    const updatedModules = [...modules];
    updatedModules[index].subModules.push({ name: "", buildPath: "" });
    setModules(updatedModules);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg p-6 flex flex-col">
        <h2 className="text-xl font-semibold mb-6">Edgeforce Solutions</h2>
        <button
          onClick={() => setActiveTab("projects")}
          className={`mb-2 p-3 rounded-lg text-left ${
            activeTab === "projects" ? "bg-blue-600 text-white" : "hover:bg-gray-100"
          }`}
        >
          Projects
        </button>
        <button
          onClick={() => setActiveTab("users")}
          className={`mb-2 p-3 rounded-lg text-left ${
            activeTab === "users" ? "bg-blue-600 text-white" : "hover:bg-gray-100"
          }`}
        >
          Users
        </button>
      </div>

      {/* Main content */}
      <div className="flex-1 p-8">
        {/* Header */}
        <div className="flex justify-end items-center mb-8">
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center space-x-2 bg-white border border-gray-300 rounded-lg px-3 py-2 hover:shadow-md transition"
            >
              <FaUserCircle className="text-2xl text-gray-700" />
              <span className="text-gray-700 font-medium">{user?.email}</span>
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                <div className="p-4 border-b border-gray-200">
                  <p className="text-gray-700 font-medium">{user?.username}</p>
                  <p className="text-gray-500 text-sm">{user?.email}</p>
                </div>
                <button
                  onClick={logout}
                  className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 transition"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Tab content */}
        {activeTab === "projects" && (
          <ProjectsTab
            projects={projects}
            users={users}
            loading={loading}
            fetchProjects={fetchProjects}
            fetchUsers={fetchUsers}
            modules={modules}
            setModules={setModules}
            projectName={projectName}
            setProjectName={setProjectName}
            assignedUser={assignedUser}
            setAssignedUser={setAssignedUser}
            handleModuleChange={handleModuleChange}
            handleSubModuleChange={handleSubModuleChange}
            addModule={addModule}
            addSubModule={addSubModule}
          />
        )}

        {activeTab === "users" && (
          <UsersTab users={users} loading={loading} deleteUser={deleteUser} />
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
