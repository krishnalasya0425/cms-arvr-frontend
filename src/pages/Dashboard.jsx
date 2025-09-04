import { useEffect, useState } from "react";
import axios from "axios";
import { User, Plus, FolderOpen, Folder, X } from "lucide-react";

export default function Dashboard({ setIsLoggedIn }) {
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [expandedProjects, setExpandedProjects] = useState({});
  const [expandedModules, setExpandedModules] = useState({});
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showProjectForm, setShowProjectForm] = useState(false);

  const [projectName, setProjectName] = useState("");
  const [modules, setModules] = useState([{ name: "", buildPath: "", subModules: [] }]);
  const [activeBuild, setActiveBuild] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const res = await axios.get("http://localhost:5000/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchProjects = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const res = await axios.get("http://localhost:5000/api/projects", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProjects(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProjects();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };

  const addModule = () =>
    setModules([...modules, { name: "", buildPath: "", subModules: [] }]);

  const addSubModule = (i) => {
    const newModules = [...modules];
    newModules[i].subModules.push({ name: "", buildPath: "" });
    setModules(newModules);
  };

  const pickFolder = async (callback) => {
    try {
      const folderPath = await window.electronAPI.pickUnityBuild();
      if (folderPath) callback(folderPath);
    } catch (err) {
      console.error(err);
    }
  };

  const pickFolderForModule = (i) =>
    pickFolder((path) => {
      const newModules = [...modules];
      newModules[i].buildPath = path;
      setModules(newModules);
    });

  const pickFolderForSubModule = (i, j) =>
    pickFolder((path) => {
      const newModules = [...modules];
      newModules[i].subModules[j].buildPath = path;
      setModules(newModules);
    });

  const launchModuleBuild = async (module) => {
  if (!module.buildPath) return alert("No build path assigned!");

  const isWebGL = module.buildPath.toLowerCase().includes("webgl"); // simple check, or use a better flag

  if (isWebGL) {
    // Render in dashboard content
    setActiveBuild(module.buildPath);
  } else {
    // Launch .exe in new window
    try {
      const res = await window.electronAPI.launchUnityBuild(module.buildPath);
      if (!res.success) alert("Failed to launch build: " + res.message);
    } catch (err) {
      console.error(err);
      alert("Error launching build: " + err.message);
    }
  }
};

  const handleSaveProject = async () => {
    if (!projectName.trim()) return alert("Project name cannot be empty!");
    const token = localStorage.getItem("token");
    try {
      const res = await axios.post(
        "http://localhost:5000/api/projects",
        { name: projectName, modules },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProjects([...projects, res.data]);
      setShowProjectForm(false);
      setProjectName("");
      setModules([{ name: "", buildPath: "", subModules: [] }]);
      alert("✅ Project created!");
    } catch (err) {
      console.error(err);
      alert("Failed to create project.");
    }
  };

  const toggleProject = (id) =>
    setExpandedProjects((prev) => ({ ...prev, [id]: !prev[id] }));

  const toggleModule = (projId, modIndex) =>
    setExpandedModules((prev) => ({
      ...prev,
      [projId]: { ...prev[projId], [modIndex]: !prev[projId]?.[modIndex] },
    }));

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col justify-between">
        <div className="p-6 space-y-4">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Dashboard</h2>
          <button
            onClick={() => setShowProjectForm(true)}
            className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create Project
          </button>

          <div className="mt-4 space-y-2">
            {projects.length === 0 && (
              <p className="text-gray-500 text-sm">No projects yet</p>
            )}
            {projects.map((proj) => (
              <div key={proj._id}>
                <div
                  className="flex items-center px-2 py-1 bg-gray-100 rounded cursor-pointer hover:bg-gray-200"
                  onClick={() => toggleProject(proj._id)}
                >
                  <Folder className="w-4 h-4 mr-2 text-gray-600" />
                  <span className="text-gray-800 text-sm">{proj.name}</span>
                </div>

                {expandedProjects[proj._id] &&
                  proj.modules.map((mod, i) => (
                    <div key={i} className="ml-6 mt-1">
                      <div
                        className="flex items-center px-2 py-1 bg-gray-200 rounded cursor-pointer hover:bg-gray-300"
                        onClick={() => {
                          toggleModule(proj._id, i);
                          launchModuleBuild(mod);
                        }}
                      >
                        <FolderOpen className="w-4 h-4 mr-2 text-gray-600" />
                        <span className="text-gray-800 text-sm">{mod.name}</span>
                      </div>

                      {expandedModules[proj._id]?.[i] &&
                        mod.subModules.map((sub, j) => (
                          <div
                            key={j}
                            className="ml-6 px-2 py-1 bg-gray-300 rounded mt-1 text-gray-800 text-sm cursor-pointer hover:bg-gray-400"
                            onClick={() => launchModuleBuild(sub)}
                          >
                            {sub.name}
                          </div>
                        ))}
                    </div>
                  ))}
              </div>
            ))}
          </div>
        </div>

        {/* User info */}
        <div
          onClick={() => setShowLogoutConfirm(true)}
          className="p-6 border-t border-gray-200 flex items-center space-x-3 cursor-pointer hover:bg-gray-100 transition"
        >
          <User className="w-8 h-8 text-gray-600" />
          <span className="text-gray-800 font-medium">
            {user ? user.username : "Loading..."}
          </span>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8 relative">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome, {user ? user.username : "Guest"} 👋
        </h1>

        {activeBuild && (
    <iframe
      src={activeBuild}
      className="w-full h-[80vh] border border-gray-300 mt-4"
      title="WebGL Build"
    />
  )}

        {/* ===== Project Form Modal ===== */}
        {showProjectForm && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-2/3 max-h-[90vh] overflow-y-auto p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Create Project</h2>
                <button onClick={() => setShowProjectForm(false)}>
                  <X className="w-6 h-6 text-gray-600" />
                </button>
              </div>

              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Project Name"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />

                {modules.map((mod, i) => (
                  <div key={i} className="border border-gray-200 p-3 rounded mb-2">
                    <input
                      type="text"
                      placeholder="Module Name"
                      value={mod.name}
                      onChange={(e) => {
                        const newModules = [...modules];
                        newModules[i].name = e.target.value;
                        setModules(newModules);
                      }}
                      className="w-full border border-gray-300 rounded px-3 py-2 mb-2"
                    />
                    <div className="flex items-center space-x-2 mb-2">
                      <button
                        onClick={() => pickFolderForModule(i)}
                        className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                      >
                        Pick Build Folder
                      </button>
                      <span className="text-gray-600 text-sm truncate">
                        {mod.buildPath || "No folder selected"}
                      </span>
                    </div>

                    {mod.subModules.map((sub, j) => (
                      <div key={j} className="flex items-center space-x-2 mb-1 ml-4">
                        <input
                          type="text"
                          placeholder="SubModule Name"
                          value={sub.name}
                          onChange={(e) => {
                            const newModules = [...modules];
                            newModules[i].subModules[j].name = e.target.value;
                            setModules(newModules);
                          }}
                          className="border border-gray-300 rounded px-2 py-1 flex-1"
                        />
                        <button
                          onClick={() => pickFolderForSubModule(i, j)}
                          className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                        >
                          Pick Folder
                        </button>
                        <span className="text-gray-600 text-sm truncate">
                          {sub.buildPath || "No folder selected"}
                        </span>
                      </div>
                    ))}

                    <button
                      onClick={() => addSubModule(i)}
                      className="mt-2 px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      + Add SubModule
                    </button>
                  </div>
                ))}

                <button
                  onClick={addModule}
                  className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  + Add Module
                </button>

                <button
                  onClick={handleSaveProject}
                  className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Save Project
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
