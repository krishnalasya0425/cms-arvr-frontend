import { useEffect, useState } from "react";
import axios from "axios";
import UsersTable from "../components/UsersTable";
import CreateProject from "../components/CreateProject";
import ProjectsTable from "../components/ProjectsTable";

export default function Dashboard({ setIsLoggedIn }) {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("projects");
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [projectName, setProjectName] = useState("");

  const token = localStorage.getItem("token");

  // Fetch user info on mount
  useEffect(() => {
    if (!token) return;
    axios
      .get("http://localhost:5000/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUser(res.data))
      .catch((err) => console.error(err));
  }, [token]);

  // Fetch projects or users based on role and active tab
  useEffect(() => {
    if (!token || !user) return;

    if (user.role === "admin") {
      if (activeTab === "projects" || activeTab === "createProject") {
        axios
          .get("http://localhost:5000/api/projects", {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((res) => {
            console.log("Fetched projects:", res.data); // <-- check this
            setProjects(res.data);
          })
          .catch((err) => console.error(err));
      } else if (activeTab === "users") {
        axios
          .get("http://localhost:5000/api/auth/all-users", {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((res) => setUsers(res.data))
          .catch((err) => console.error(err));
      }
    } else {
      axios
        .get("http://localhost:5000/api/projects/assigned", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          console.log("Assigned projects:", res.data); // <-- check this
          setProjects(res.data);
        })
        .catch((err) => console.error(err));
    }
  }, [activeTab, token, user]);

  // Create project (admin only)

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };


  useEffect(() => {
    if (!token || !user) return;

    if (user.role === "admin") {
      if (activeTab === "projects" || activeTab === "createProject") {
        // fetch projects
      }
      if (!users.length) {
        // fetch users once
        axios
          .get("http://localhost:5000/api/auth/all-users", {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((res) => setUsers(res.data))
          .catch((err) => console.error(err));
      }
    }
  }, [activeTab, token, user]);



  const launchUnityBuild = async (folderPath) => {
    if (!folderPath) return alert("No build folder assigned!");
    try {
      const res = await window.electronAPI.launchUnityBuild(folderPath); // ← call main process
      if (!res.success) alert("Failed to launch build: " + res.message);
    } catch (err) {
      console.error(err);
      alert("Error launching build: " + err.message);
    }
  };



  const handleAssignUsers = async (projectId, userId) => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/projects/${projectId}/assign-user`,
        { userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setProjects(projects.map(p => (p._id === projectId ? res.data : p)));
    } catch (err) {
      console.error(err);
      alert("Failed to assign user");
    }
  };


  const handleDeleteProject = async (projectId) => {
    try {
      await axios.delete(`http://localhost:5000/api/projects/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProjects(projects.filter((p) => p._id !== projectId));
    } catch (err) {
      console.error(err);
      alert("Failed to delete project");
    }
  };

  const handleUnassignUser = async (projectId) => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/projects/${projectId}/unassign-user`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProjects(
        projects.map((p) => (p._id === projectId ? res.data.project : p))
      );
    } catch (err) {
      console.error(err);
      alert("Failed to unassign user");
    }
  };

  const handleUpdateProject = (updatedProject) => {
    setProjects((prev) =>
      prev.map((p) => (p._id === updatedProject._id ? updatedProject : p))
    );
    console.log("Project updated:", updatedProject);
  };



  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white p-6 flex flex-col space-y-4">
        <h2 className="text-xl font-bold mb-6">Dashboard</h2>

        {user?.role === "admin" ? (
          <>
            <button
              onClick={() => setActiveTab("createProject")}
              className={`w-full text-left px-3 py-2 rounded ${activeTab === "createProject" ? "bg-blue-600" : "hover:bg-gray-700"
                }`}
            >
              Create Project
            </button>
            <button
              onClick={() => setActiveTab("projects")}
              className={`w-full text-left px-3 py-2 rounded ${activeTab === "projects" ? "bg-blue-600" : "hover:bg-gray-700"
                }`}
            >
              All Projects
            </button>
            <button
              onClick={() => setActiveTab("users")}
              className={`w-full text-left px-3 py-2 rounded ${activeTab === "users" ? "bg-blue-600" : "hover:bg-gray-700"
                }`}
            >
              All Users
            </button>
          </>
        ) : (
          <button
            onClick={() => setActiveTab("projects")}
            className="w-full text-left px-3 py-2 rounded bg-blue-600"
          >
            My Projects
          </button>
        )}

        <button
          onClick={handleLogout}
          className="mt-auto w-full text-left px-3 py-2 rounded bg-red-600 hover:bg-red-700"
        >
          Logout
        </button>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-6">
          Welcome, {user?.username || "Guest"}
        </h1>

        {/* Admin Tabs */}
        {user?.role === "admin" && (
          <>
            {activeTab === "createProject" && (
              <CreateProject
                token={token}
                onProjectCreated={(newProject) => setProjects([...projects, newProject])}
              />
            )}

            {activeTab === "projects" && user?.role === "admin" && (
              <div>
                <h2 className="text-2xl font-bold mb-4">All Projects</h2>
                <ProjectsTable
                  projects={projects}
                  users={users}
                  onLaunchBuild={launchUnityBuild}
                  onAssignUsers={handleAssignUsers}
                  onDeleteProject={handleDeleteProject}
                  onUnassignUser={handleUnassignUser}
                  onUpdateProject={handleUpdateProject} // ✅ this must exist

                />


              </div>
            )}


            {activeTab === "users" && (
              <div>
                <h2 className="text-2xl font-bold mb-4">All Users</h2>
                <UsersTable users={users} />
              </div>
            )}
          </>
        )}

        {/* Normal user view */}
        {user?.role !== "admin" && activeTab === "projects" && (
          <div>
            <h2 className="text-2xl font-bold mb-4">My Projects</h2>
            {projects.length === 0 ? (
              <p className="text-gray-600">No projects assigned.</p>
            ) : (
              <ul className="space-y-2">
                {projects.map((p) => (
                  <li
                    key={p._id}
                    className="bg-white p-3 rounded shadow flex justify-between"
                  >
                    {p.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
