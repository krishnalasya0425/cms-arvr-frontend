import { useEffect, useState, useRef } from "react";
import axios from "axios";
import UsersTable from "../components/UsersTable";
import CreateProject from "../components/CreateProject";
import ProjectsTable from "../components/ProjectsTable";

export default function Dashboard({ setIsLoggedIn }) {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("projects");
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [viewModules, setViewModules] = useState(false);
  const [expandedModules, setExpandedModules] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const token = localStorage.getItem("token");
  const scrollRef = useRef(null);

  const projectsPerPage = 6; // adjust cards per page

  // Fetch user info
  useEffect(() => {
    if (!token) return;
    axios
      .get("http://localhost:5000/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUser(res.data))
      .catch((err) => console.error(err));
  }, [token]);

  // Fetch projects/users
  useEffect(() => {
    if (!token || !user) return;

    if (user.role === "admin") {
      if (activeTab === "projects" || activeTab === "createProject") {
        axios
          .get("http://localhost:5000/api/projects", {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((res) => setProjects(res.data))
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
        .get("http://localhost:5000/api/projects", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setProjects(res.data))
        .catch((err) => console.error(err));
    }
  }, [activeTab, token, user]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };

  // Launch Unity build
  const launchUnityBuild = async (folderPath) => {
    if (!folderPath) return alert("No build folder assigned!");
    try {
      const res = await window.electronAPI.launchUnityBuild(folderPath);
      if (!res.success) alert("Failed to launch build: " + res.message);
    } catch (err) {
      console.error(err);
      alert("Error launching build: " + err.message);
    }
  };

  // Admin functions
  const handleAssignUsers = async (projectId, userId) => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/projects/${projectId}/assign`,
        { userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProjects(projects.map((p) => (p._id === projectId ? res.data : p)));
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
        `http://localhost:5000/api/projects/${projectId}/unassign`,
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
  };

  // Scroll (kept for modules navigation)
  const scrollLeft = () => {
    if (scrollRef.current)
      scrollRef.current.scrollBy({ left: -400, behavior: "smooth" });
  };
  const scrollRight = () => {
    if (scrollRef.current)
      scrollRef.current.scrollBy({ left: 400, behavior: "smooth" });
  };

  // Filter projects
  const filteredProjects = projects.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);
  const paginatedProjects = filteredProjects.slice(
    (currentPage - 1) * projectsPerPage,
    currentPage * projectsPerPage
  );

  useEffect(() => {
    setCurrentPage(1); // reset to first page when search changes
  }, [searchTerm]);

  return (
    <div className="min-h-screen flex flex-col bg-green-50">
      {/* Header */}
      <header className="w-full bg-green-700 text-white py-4 flex justify-between items-center shadow-md px-8">
        <h1 className="text-2xl font-bold">Welcome, {user?.username}!</h1>
        <button
          onClick={handleLogout}
          className="bg-green-900 hover:bg-green-800 transition px-4 py-2 rounded-lg"
        >
          Logout
        </button>
      </header>

      {/* Admin View */}
      {user?.role === "admin" ? (
        <main className="flex-grow p-6">
          <div className="flex gap-4 mb-6">
            <button
              className={`px-4 py-2 rounded ${
                activeTab === "projects"
                  ? "bg-green-700 text-white"
                  : "bg-green-200"
              }`}
              onClick={() => setActiveTab("projects")}
            >
              Projects
            </button>
            <button
              className={`px-4 py-2 rounded ${
                activeTab === "createProject"
                  ? "bg-green-700 text-white"
                  : "bg-green-200"
              }`}
              onClick={() => setActiveTab("createProject")}
            >
              Create Project
            </button>
            <button
              className={`px-4 py-2 rounded ${
                activeTab === "users"
                  ? "bg-green-700 text-white"
                  : "bg-green-200"
              }`}
              onClick={() => setActiveTab("users")}
            >
              Users
            </button>
          </div>

          {activeTab === "createProject" && (
            <CreateProject
              token={token}
              onProjectCreated={(newProject) =>
                setProjects([...projects, newProject])
              }
            />
          )}

          {activeTab === "projects" && (
            <div>
              <h2 className="text-2xl font-bold mb-4">All Projects</h2>
              <ProjectsTable
                projects={projects}
                users={users}
                onLaunchBuild={launchUnityBuild}
                onAssignUsers={handleAssignUsers}
                onDeleteProject={handleDeleteProject}
                onUnassignUser={handleUnassignUser}
                onUpdateProject={handleUpdateProject}
              />
            </div>
          )}

          {activeTab === "users" && <UsersTable token={token} />}
        </main>
      ) : (
        /* User View */
        <main
          className={`flex-grow w-full flex flex-col items-center ${
            projects.length === 1 && !selectedProject
              ? "justify-center"
              : "pt-6 pb-6"
          }`}
        >
          {/* Search Bar */}
          {!selectedProject && (
            <div className="w-full max-w-lg mb-6">
              <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-3 rounded-xl border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          )}

          {/* Projects Grid with Pagination */}
          {!selectedProject && (
            <div className="w-full max-w-6xl flex flex-col items-center">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 w-full">
                {paginatedProjects.length > 0 ? (
                  paginatedProjects.map((project) => (
                    <div
                      key={project._id}
                      onClick={() => {
                        setSelectedProject(project);
                        setViewModules(false);
                        setExpandedModules({});
                      }}
                      className="cursor-pointer bg-green-100 hover:bg-green-200 transition p-8 rounded-3xl shadow-lg flex flex-col items-center justify-center h-60"
                    >
                      <h2 className="text-2xl font-bold text-green-900 mb-2">
                        {project.name}
                      </h2>
                      <p className="text-green-800 text-center">
                        {project.modules?.length || 0} Modules &{" "}
                        {project.models?.length || 0} Models
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-green-800 text-center col-span-full mt-8">
                    No projects found matching your search.
                  </p>
                )}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center gap-4 mt-6">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-green-200 rounded hover:bg-green-300 disabled:opacity-50"
                  >
                    ← Prev
                  </button>
                  <span className="text-green-900 font-medium">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() =>
                      setCurrentPage((p) => Math.min(p + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-green-200 rounded hover:bg-green-300 disabled:opacity-50"
                  >
                    Next →
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Project Details View */}
          {selectedProject && !viewModules && (
            <div className="flex-grow w-full flex flex-col items-center justify-center gap-6">
              <div className="flex gap-8 flex-col sm:flex-row items-center justify-center">
                {/* Modules */}
                <div
                  className="bg-green-100 rounded-3xl shadow-lg p-6 cursor-pointer hover:bg-green-200 transition flex flex-col items-center justify-center w-72 h-60"
                  onClick={() => setViewModules(true)}
                >
                  <h2 className="text-2xl font-bold text-green-900 mb-2 text-center">
                    Modules / Submodules
                  </h2>
                  <p className="text-green-800 text-center">
                    Click to view all modules
                  </p>
                </div>

                {/* Models */}
                <div className="bg-green-100 rounded-3xl shadow-lg p-6 w-72 h-60 flex flex-col items-start justify-start overflow-y-auto">
                  <h2 className="text-xl font-bold text-green-900 mb-4 text-center w-full">
                    Models
                  </h2>
                  {selectedProject.models?.length > 0 ? (
                    selectedProject.models.map((model, mi) => (
                      <div
                        key={mi}
                        className="mb-2 p-2 border rounded-2xl bg-green-50 hover:bg-green-200 transition w-full text-center"
                      >
                        <span className="font-medium">{model.name}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-green-800 text-center w-full">
                      No models available
                    </p>
                  )}
                </div>
              </div>

              <button
                className="mt-6 px-6 py-2 bg-green-200 rounded hover:bg-green-300"
                onClick={() => setSelectedProject(null)}
              >
                ← Back to Projects
              </button>
            </div>
          )}

          {/* Modules List */}
          {selectedProject && viewModules && (
            <div className="w-full max-w-6xl flex flex-col items-center">
              <button
                className="mb-4 px-3 py-1 bg-green-200 rounded hover:bg-green-300 self-start"
                onClick={() => setViewModules(false)}
              >
                ← Back to Project
              </button>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full">
                {selectedProject.modules?.length > 0 ? (
                  selectedProject.modules.map((mod, mi) => (
                    <div
                      key={mi}
                      className="bg-green-100 p-6 rounded-3xl shadow-lg"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-bold text-green-900">
                          {mod.name}
                        </span>
                        {mod.buildPath && (
                          <button
                            className="px-2 py-1 bg-green-700 text-white rounded hover:bg-green-800 text-sm"
                            onClick={() => launchUnityBuild(mod.buildPath)}
                          >
                            Launch Build
                          </button>
                        )}
                      </div>

                      {mod.subModules?.length > 0 && (
                        <div>
                          <button
                            className="text-green-800 mb-2 text-sm font-medium hover:underline"
                            onClick={() =>
                              setExpandedModules((prev) => ({
                                ...prev,
                                [mi]: !prev[mi],
                              }))
                            }
                          >
                            {expandedModules[mi]
                              ? "▼ Hide Submodules"
                              : "▶ Show Submodules"}
                          </button>
                          {expandedModules[mi] &&
                            mod.subModules.map((sub, si) => (
                              <div
                                key={si}
                                className="ml-4 flex justify-between items-center p-2 bg-green-50 rounded-xl mb-1 hover:bg-green-200 transition"
                              >
                                <span>{sub.name}</span>
                                {sub.buildPath && (
                                  <button
                                    className="px-2 py-1 bg-green-700 text-white rounded text-xs hover:bg-green-800"
                                    onClick={() =>
                                      launchUnityBuild(sub.buildPath)
                                    }
                                  >
                                    Launch Build
                                  </button>
                                )}
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-green-800 text-center col-span-full">
                    No modules available
                  </p>
                )}
              </div>
            </div>
          )}
        </main>
      )}

      {/* Footer */}
      <footer className="w-full bg-green-200 text-green-900 py-4 text-center shadow-inner">
        © 2025 EdgeForce Solutions
      </footer>
    </div>
  );
}
