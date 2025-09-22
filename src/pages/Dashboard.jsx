// import { useEffect, useState } from "react";
// import axios from "axios";
// import UsersTable from "../components/UsersTable";
// import CreateProject from "../components/CreateProject";
// import ProjectsTable from "../components/ProjectsTable";

// export default function Dashboard({ setIsLoggedIn }) {
//   const [user, setUser] = useState(null);
//   const [activeTab, setActiveTab] = useState("projects");
//   const [projects, setProjects] = useState([]);
//   const [users, setUsers] = useState([]);
//   const [projectName, setProjectName] = useState("");

//   const token = localStorage.getItem("token");

//   // Fetch user info on mount
//   useEffect(() => {
//     if (!token) return;
//     axios
//       .get("http://localhost:5000/api/auth/me", {
//         headers: { Authorization: `Bearer ${token}` },
//       })
//       .then((res) => setUser(res.data))
//       .catch((err) => console.error(err));
//   }, [token]);

//   // Fetch projects or users based on role and active tab
//   useEffect(() => {
//     if (!token || !user) return;

//     if (user.role === "admin") {
//       if (activeTab === "projects" || activeTab === "createProject") {
//         axios
//           .get("http://localhost:5000/api/projects", {
//             headers: { Authorization: `Bearer ${token}` },
//           })
//           .then((res) => {
//             console.log("Fetched projects:", res.data); // <-- check this
//             setProjects(res.data);
//           })
//           .catch((err) => console.error(err));
//       } else if (activeTab === "users") {
//         axios
//           .get("http://localhost:5000/api/auth/all-users", {
//             headers: { Authorization: `Bearer ${token}` },
//           })
//           .then((res) => setUsers(res.data))
//           .catch((err) => console.error(err));
//       }
//     } else {
//       axios
//         .get("http://localhost:5000/api/projects", {
//           headers: { Authorization: `Bearer ${token}` },
//         })
//         .then((res) => {
//           console.log("Assigned projects:", res.data);
//           setProjects(res.data);
//         })
//         .catch((err) => console.error(err));

//     }
//   }, [activeTab, token, user]);

//   // Create project (admin only)

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     setIsLoggedIn(false);
//   };


//   useEffect(() => {
//     if (!token || !user) return;

//     if (user.role === "admin") {
//       if (activeTab === "projects" || activeTab === "createProject") {
//         // fetch projects
//       }
//       if (!users.length) {
//         // fetch users once
//         axios
//           .get("http://localhost:5000/api/auth/all-users", {
//             headers: { Authorization: `Bearer ${token}` },
//           })
//           .then((res) => setUsers(res.data))
//           .catch((err) => console.error(err));
//       }
//     }
//   }, [activeTab, token, user]);



//   const launchUnityBuild = async (folderPath) => {
//     if (!folderPath) return alert("No build folder assigned!");
//     try {
//       const res = await window.electronAPI.launchUnityBuild(folderPath); // ← call main process
//       if (!res.success) alert("Failed to launch build: " + res.message);
//     } catch (err) {
//       console.error(err);
//       alert("Error launching build: " + err.message);
//     }
//   };



//   const handleAssignUsers = async (projectId, userId) => {
//     try {
//       const res = await axios.put(
//         `http://localhost:5000/api/projects/${projectId}/assign`,   // ✅ fixed endpoint
//         { userId },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       setProjects(projects.map((p) => (p._id === projectId ? res.data : p)));
//     } catch (err) {
//       console.error(err);
//       alert("Failed to assign user");
//     }
//   };


//   const handleDeleteProject = async (projectId) => {
//     try {
//       await axios.delete(`http://localhost:5000/api/projects/${projectId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setProjects(projects.filter((p) => p._id !== projectId));
//     } catch (err) {
//       console.error(err);
//       alert("Failed to delete project");
//     }
//   };

//   const handleUnassignUser = async (projectId) => {
//     try {
//       const res = await axios.put(
//         `http://localhost:5000/api/projects/${projectId}/unassign`, // ✅ fixed endpoint
//         {},
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       // backend returns { message, project }
//       setProjects(
//         projects.map((p) => (p._id === projectId ? res.data.project : p))
//       );
//     } catch (err) {
//       console.error(err);
//       alert("Failed to unassign user");
//     }
//   };

//   const handleUpdateProject = (updatedProject) => {
//     setProjects((prev) =>
//       prev.map((p) => (p._id === updatedProject._id ? updatedProject : p))
//     );
//     console.log("Project updated:", updatedProject);
//   };



//   return (
//     <div className="flex min-h-screen bg-gray-100">
//       {/* Sidebar */}
//       <aside className="w-64 bg-gray-800 text-white p-6 flex flex-col space-y-4">
//         <h2 className="text-xl font-bold mb-6">Dashboard</h2>

//         {user?.role === "admin" ? (
//           <>
//             <button
//               onClick={() => setActiveTab("createProject")}
//               className={`w-full text-left px-3 py-2 rounded ${activeTab === "createProject" ? "bg-blue-600" : "hover:bg-gray-700"
//                 }`}
//             >
//               Create Project
//             </button>
//             <button
//               onClick={() => setActiveTab("projects")}
//               className={`w-full text-left px-3 py-2 rounded ${activeTab === "projects" ? "bg-blue-600" : "hover:bg-gray-700"
//                 }`}
//             >
//               All Projects
//             </button>
//             <button
//               onClick={() => setActiveTab("users")}
//               className={`w-full text-left px-3 py-2 rounded ${activeTab === "users" ? "bg-blue-600" : "hover:bg-gray-700"
//                 }`}
//             >
//               All Users
//             </button>
//           </>
//         ) : (
//           <button
//             onClick={() => setActiveTab("projects")}
//             className="w-full text-left px-3 py-2 rounded bg-blue-600"
//           >
//             My Projects
//           </button>
//         )}

//         <button
//           onClick={handleLogout}
//           className="mt-auto w-full text-left px-3 py-2 rounded bg-red-600 hover:bg-red-700"
//         >
//           Logout
//         </button>
//       </aside>

//       {/* Main content */}
//       <main className="flex-1 p-8">
//         <h1 className="text-2xl font-bold mb-6">
//           Welcome, {user?.username || "Guest"}
//         </h1>

//         {/* Admin Tabs */}
//         {user?.role === "admin" && (
//           <>
//             {activeTab === "createProject" && (
//               <CreateProject
//                 token={token}
//                 onProjectCreated={(newProject) => setProjects([...projects, newProject])}
//               />
//             )}

//             {activeTab === "projects" && user?.role === "admin" && (
//               <div>
//                 <h2 className="text-2xl font-bold mb-4">All Projects</h2>
//                 <ProjectsTable
//                   projects={projects}
//                   users={users}
//                   onLaunchBuild={launchUnityBuild}
//                   onAssignUsers={handleAssignUsers}
//                   onDeleteProject={handleDeleteProject}
//                   onUnassignUser={handleUnassignUser}
//                   onUpdateProject={handleUpdateProject} // ✅ this must exist

//                 />


//               </div>
//             )}


//             {activeTab === "users" && (
//               <UsersTable token={token} />
//             )}

//           </>
//         )}

//         {/* Normal user view */}
//      {user?.role !== "admin" && activeTab === "projects" && (
//   <div>
//     <h2 className="text-2xl font-bold mb-4">My Projects</h2>
//     {projects.length === 0 ? (
//       <p className="text-gray-600">No projects assigned.</p>
//     ) : (
//       <ul className="space-y-4">
//         {projects.map((p) => (
//           <li key={p._id} className="bg-white p-4 rounded shadow">
//             <h3 className="text-lg font-semibold mb-2">{p.name}</h3>

//             {p.modules?.length > 0 ? (
//               <ul className="ml-4 space-y-2">
//                 {p.modules.map((mod, mi) => (
//                   <li key={mi}>
//                     <div className="flex items-center justify-between font-medium">
//                       <span>Module: {mod.name}</span>
//                       {mod.buildPath && (
//                         <button
//                           className="ml-2 px-2 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
//                           onClick={() => launchUnityBuild(mod.buildPath)}
//                         >
//                           Launch Build
//                         </button>
//                       )}
//                     </div>

//                     {mod.subModules?.length > 0 && (
//                       <ul className="ml-4 mt-1 space-y-1">
//                         {mod.subModules.map((sub, si) => (
//                           <li key={si} className="flex items-center justify-between text-gray-700">
//                             <span>Submodule: {sub.name}</span>
//                             {sub.buildPath && (
//                               <button
//                                 className="ml-2 px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
//                                 onClick={() => launchUnityBuild(sub.buildPath)}
//                               >
//                                 Launch Build
//                               </button>
//                             )}
//                           </li>
//                         ))}
//                       </ul>
//                     )}
//                   </li>
//                 ))}
//               </ul>
//             ) : (
//               <p className="text-gray-500">No modules assigned</p>
//             )}
//           </li>
//         ))}
//       </ul>
//     )}
//   </div>
// )}

//       </main>
//     </div>
//   );
// }
//cards working 
import { useEffect, useState, useRef } from "react";
import axios from "axios";

export default function Dashboard({ setIsLoggedIn }) {
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [viewModules, setViewModules] = useState(false);
  const [expandedModules, setExpandedModules] = useState({});
  const token = localStorage.getItem("token");

  const scrollRef = useRef(null);

  useEffect(() => {
    if (!token) return;
    axios
      .get("http://localhost:5000/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUser(res.data))
      .catch((err) => console.error(err));
  }, [token]);

  useEffect(() => {
    if (!token || !user) return;
    axios
      .get("http://localhost:5000/api/projects", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setProjects(res.data))
      .catch((err) => console.error(err));
  }, [token, user]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };

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

  const scrollLeft = () => {
    if (scrollRef.current) scrollRef.current.scrollBy({ left: -400, behavior: "smooth" });
  };

  const scrollRight = () => {
    if (scrollRef.current) scrollRef.current.scrollBy({ left: 400, behavior: "smooth" });
  };

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

      {/* Main Content */}
      <main
        className={`flex-grow w-full flex flex-col items-center ${
          projects.length === 1 && !selectedProject ? "justify-center" : "pt-6 pb-6"
        }`}
      >
        {/* Projects Carousel */}
        {!selectedProject && (
          <div className="relative w-full max-w-6xl">
            {/* Left arrow */}
            {projects.length > 3 && (
              <button
                onClick={scrollLeft}
                className="absolute left-0 top-1/2 -translate-y-1/2 bg-green-700 text-white p-2 rounded-full shadow z-10 hover:bg-green-800"
              >
                ◀
              </button>
            )}

            <div
              ref={scrollRef}
              className={`flex gap-8 overflow-x-auto scrollbar-hide ${
                projects.length === 1 ? "justify-center" : ""
              }`}
            >
              {projects.map((project) => (
                <div
                  key={project._id}
                  onClick={() => {
                    setSelectedProject(project);
                    setViewModules(false);
                    setExpandedModules({});
                  }}
                  className="cursor-pointer bg-green-100 hover:bg-green-200 transition p-8 rounded-3xl shadow-lg flex flex-col items-center justify-center w-72 h-60 flex-shrink-0"
                >
                  <h2 className="text-2xl font-bold text-green-900 mb-2">{project.name}</h2>
                  <p className="text-green-800 text-center">
                    {project.modules?.length || 0} Modules & {project.models?.length || 0} Models
                  </p>
                </div>
              ))}
            </div>

            {/* Right arrow */}
            {projects.length > 3 && (
              <button
                onClick={scrollRight}
                className="absolute right-0 top-1/2 -translate-y-1/2 bg-green-700 text-white p-2 rounded-full shadow z-10 hover:bg-green-800"
              >
                ▶
              </button>
            )}
          </div>
        )}

      {/* Project Details View (2 cards) */}
{selectedProject && !viewModules && (
  <div className="flex-grow w-full flex flex-col items-center justify-center gap-6">
    <div className="flex gap-8 flex-col sm:flex-row items-center justify-center">
      {/* Modules / Submodules Card */}
      <div
        className="bg-green-100 rounded-3xl shadow-lg p-6 cursor-pointer hover:bg-green-200 transition flex flex-col items-center justify-center w-72 h-60"
        onClick={() => setViewModules(true)}
      >
        <h2 className="text-2xl font-bold text-green-900 mb-2 text-center">
          Modules / Submodules
        </h2>
        <p className="text-green-800 text-center">Click to view all modules</p>
      </div>

      {/* Models Card */}
      <div className="bg-green-100 rounded-3xl shadow-lg p-6 w-72 h-60 flex flex-col items-start justify-start overflow-y-auto">
        <h2 className="text-xl font-bold text-green-900 mb-4 text-center w-full">Models</h2>
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
          <p className="text-green-800 text-center w-full">No models available</p>
        )}
      </div>
    </div>

    {/* Back Button */}
    <button
      className="mt-6 px-6 py-2 bg-green-200 rounded hover:bg-green-300"
      onClick={() => setSelectedProject(null)}
    >
      ← Back to Projects
    </button>
  </div>
)}


        {/* Modules List View */}
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
                  <div key={mi} className="bg-green-100 p-6 rounded-3xl shadow-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-green-900">{mod.name}</span>
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
                          {expandedModules[mi] ? "▼ Hide Submodules" : "▶ Show Submodules"}
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
                                  onClick={() => launchUnityBuild(sub.buildPath)}
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
                <p className="text-green-800 text-center col-span-full">No modules available</p>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full bg-green-200 text-green-900 py-4 text-center shadow-inner">
        © 2025 EdgeForce Solutions
      </footer>
    </div>
  );
}
