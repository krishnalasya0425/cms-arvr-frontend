// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import API from "../utils/api";
// import "@google/model-viewer";
// import FBXViewer from "../components/FBXViewer";
// import { Bell, User } from "lucide-react";

// export default function UserDashboard() {
//   const navigate = useNavigate();
//   const [projects, setProjects] = useState([]);
//   const [viewFile, setViewFile] = useState(null);

//   const handleLogout = () => {
//     localStorage.clear();
//     navigate("/login");
//   };

//   useEffect(() => {
//     const fetchProjects = async () => {
//       try {
//         const userId = localStorage.getItem("userId");
//         if (!userId) return;

//         const res = await API.get(`/projects/my-projects?userId=${userId}`);
//         setProjects(res.data);
//       } catch (err) {
//         console.error("Error fetching projects:", err);
//       }
//     };
//     fetchProjects();
//   }, []);

//   const downloadFile = (fileId, fileName) => {
//     window.open(`http://localhost:5000/api/projects/file/${fileId}?download=true`, "_blank");
//   };

//   const viewFileHandler = async (fileId) => {
//     try {
//       const url = `http://localhost:5000/api/projects/file/${fileId}`;
//       setViewFile(url);
//     } catch (err) {
//       console.error("Error viewing file:", err);
//       alert("Cannot load model. The file might be corrupted or in an unsupported format.");
//     }
//   };

//   return (
//     <div className="flex flex-col min-h-screen bg-gray-50">
//       {/* -------- HEADER (Sticky) -------- */}
//       <header className="bg-white shadow-sm border-b sticky top-0 z-50">
//         <div className="flex items-center justify-between px-6 py-3">
//           {/* Left: EdgeVR Logo */}
//           <div className="flex items-center space-x-2">
//             <span className="text-2xl font-bold text-blue-600">EdgeVR</span>
//           </div>

//           {/* Middle: Search Bar */}
//           <div className="flex-grow max-w-xl mx-6">
//             <input
//               type="text"
//               placeholder="Search 3D models"
//               className="w-full border rounded-md px-4 py-2 text-gray-700 focus:ring-2 focus:ring-blue-400 focus:outline-none"
//             />
//           </div>

//           {/* Right: Icons */}
//           <div className="flex items-center space-x-5">
//             <button className="text-gray-600 hover:text-blue-600">
//               <Bell className="w-5 h-5" />
//             </button>
//             <button className="text-gray-600 hover:text-blue-600">
//               <User className="w-5 h-5" />
//             </button>
//           </div>
//         </div>
//       </header>

//       {/* -------- MAIN CONTENT (Scrollable) -------- */}
//       <main className="flex-1 overflow-y-auto p-8">
//         <div className="flex justify-between items-center mb-6">
//           <h1 className="text-3xl font-bold text-gray-800">User Dashboard</h1>
//           <button
//             onClick={handleLogout}
//             className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
//           >
//             Logout
//           </button>
//         </div>

//         {/* Projects List */}
//         <div className="space-y-4">
//           {projects.length > 0 ? (
//             projects.map((p) => (
//               <div
//                 key={p._id}
//                 className="border bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition-all"
//               >
//                 <h2 className="font-semibold text-lg text-gray-800">{p.name}</h2>
//                 <p className="text-gray-600">{p.description}</p>

//                 {p.modelFileId && (
//                   <div className="flex gap-2 mt-3">
//                     <button
//                       onClick={() => downloadFile(p.modelFileId.toString(), p.modelFileName)}
//                       className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
//                     >
//                       Download Main Model
//                     </button>
//                     <button
//                       onClick={() => viewFileHandler(p.modelFileId.toString())}
//                       className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
//                     >
//                       View Main Model
//                     </button>
//                   </div>
//                 )}

//                 {p.subModels?.length > 0 && (
//                   <div className="mt-4">
//                     <h3 className="font-semibold text-gray-700">Submodels:</h3>
//                     {p.subModels.map((s, i) => (
//                       <div key={i} className="flex items-center gap-2 mt-2">
//                         <span className="text-gray-700">{s.name}</span>
//                         {s.fileId && (
//                           <>
//                             <button
//                               onClick={() => downloadFile(s.fileId.toString(), s.fileName)}
//                               className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
//                             >
//                               Download
//                             </button>
//                             <button
//                               onClick={() => viewFileHandler(s.fileId.toString())}
//                               className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
//                             >
//                               View
//                             </button>
//                           </>
//                         )}
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             ))
//           ) : (
//             <p className="text-gray-600">No projects assigned.</p>
//           )}
//         </div>

//         {/* -------- MODEL VIEWER -------- */}
//         {viewFile && (
//           <div className="mt-8 bg-white rounded-xl shadow-md p-5">
//             <h3 className="font-semibold mb-3 text-gray-800">Model Viewer:</h3>
//             {viewFile.endsWith(".fbx") ? (
//               <FBXViewer fileUrl={viewFile} />
//             ) : (
//               <model-viewer
//                 src={viewFile}
//                 alt="3D Model"
//                 camera-controls
//                 auto-rotate
//                 style={{
//                   width: "100%",
//                   height: "500px",
//                   border: "1px solid #ddd",
//                   borderRadius: "0.5rem",
//                 }}
//               ></model-viewer>
//             )}

//             <button
//               onClick={() => {
//                 URL.revokeObjectURL(viewFile);
//                 setViewFile(null);
//               }}
//               className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
//             >
//               Close Viewer
//             </button>
//           </div>
//         )}
//       </main>
//     </div>
//   );
// }

// with styles vijay file is viisble but slow

// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import API from "../utils/api";
// import "@google/model-viewer";
// import FBXViewer from "../components/FBXViewer";
// import { Bell, User, LogOut } from "lucide-react";

// export default function UserDashboard() {
//   const navigate = useNavigate();
//   const [projects, setProjects] = useState([]);
//   const [viewFile, setViewFile] = useState(null);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [showProfileMenu, setShowProfileMenu] = useState(false);

//   const handleLogout = () => {
//     localStorage.clear();
//     navigate("/login");
//   };

//   useEffect(() => {
//     const fetchProjects = async () => {
//       try {
//         const userId = localStorage.getItem("userId");
//         if (!userId) return;

//         const res = await API.get(`/projects/my-projects?userId=${userId}`);
//         setProjects(res.data);
//       } catch (err) {
//         console.error("Error fetching projects:", err);
//       }
//     };
//     fetchProjects();
//   }, []);

//   const downloadFile = (fileId, fileName) => {
//     window.open(`http://localhost:5000/api/projects/file/${fileId}?download=true`, "_blank");
//   };

//   const viewFileHandler = async (fileId) => {
//     try {
//       const url = `http://localhost:5000/api/projects/file/${fileId}`;
//       setViewFile(url);
//     } catch (err) {
//       console.error("Error viewing file:", err);
//       alert("Cannot load model. The file might be corrupted or in an unsupported format.");
//     }
//   };

//   // Filter projects by search term
//   const filteredProjects = projects.filter((p) =>
//     p.name.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <div className="flex flex-col min-h-screen bg-gray-50">
//       {/* -------- HEADER (Sticky) -------- */}
//       <header className="bg-white shadow-sm border-b sticky top-0 z-50">
//         <div className="flex items-center justify-between px-6 py-3">
//           {/* Left: EdgeVR Logo */}
//           <div className="flex items-center space-x-2">
//             <span className="text-2xl font-bold text-blue-600">EdgeVR</span>
//           </div>

//           {/* Middle: Search Bar */}
//           <div className="flex-grow max-w-xl mx-6">
//             <input
//               type="text"
//               placeholder="Search 3D models"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="w-full border rounded-md px-4 py-2 text-gray-700 focus:ring-2 focus:ring-blue-400 focus:outline-none"
//             />
//           </div>

//           {/* Right: Icons */}
//           <div className="flex items-center space-x-5 relative">
//             <button className="text-gray-600 hover:text-blue-600">
//               <Bell className="w-5 h-5" />
//             </button>

//             {/* Profile Icon with Logout */}
//             <div className="relative">
//               <button
//                 onClick={() => setShowProfileMenu(!showProfileMenu)}
//                 className="text-gray-600 hover:text-blue-600"
//               >
//                 <User className="w-5 h-5" />
//               </button>
//               {showProfileMenu && (
//                 <div className="absolute right-0 mt-2 w-32 bg-white border rounded shadow-md">
//                   <button
//                     onClick={handleLogout}
//                     className="flex items-center gap-2 w-full px-4 py-2 text-gray-700 hover:bg-red-500 hover:text-white rounded"
//                   >
//                     <LogOut className="w-4 h-4" /> Logout
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* -------- MAIN CONTENT (Scrollable) -------- */}
//       <main className="flex-1 overflow-auto p-8">

//         {/* Projects List */}
//         <div className="space-y-4">
//           {filteredProjects.length > 0 ? (
//             filteredProjects.map((p) => (
//               <div
//                 key={p._id}
//                 className="border bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition-all"
//               >
//                 <h2 className="font-semibold text-lg text-gray-800">{p.name}</h2>
//                 <p className="text-gray-600">{p.description}</p>

//                 {p.modelFileId && (
//                   <div className="flex gap-2 mt-3">
//                     <button
//                       onClick={() => downloadFile(p.modelFileId.toString(), p.modelFileName)}
//                       className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
//                     >
//                       Download Main Model
//                     </button>
//                     <button
//                       onClick={() => viewFileHandler(p.modelFileId.toString())}
//                       className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
//                     >
//                       View Main Model
//                     </button>
//                   </div>
//                 )}

//                 {p.subModels?.length > 0 && (
//                   <div className="mt-4">
//                     <h3 className="font-semibold text-gray-700">Submodels:</h3>
//                     {p.subModels.map((s, i) => (
//                       <div key={i} className="flex items-center gap-2 mt-2">
//                         <span className="text-gray-700">{s.name}</span>
//                         {s.fileId && (
//                           <>
//                             <button
//                               onClick={() => downloadFile(s.fileId.toString(), s.fileName)}
//                               className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
//                             >
//                               Download
//                             </button>
//                             <button
//                               onClick={() => viewFileHandler(s.fileId.toString())}
//                               className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
//                             >
//                               View
//                             </button>
//                           </>
//                         )}
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             ))
//           ) : (
//             <p className="text-gray-600">No projects found.</p>
//           )}
//         </div>

//         {/* -------- MODEL VIEWER -------- */}
//         {viewFile && (
//           <div className="mt-8 bg-white rounded-xl shadow-md p-5">
//             <h3 className="font-semibold mb-3 text-gray-800">Model Viewer:</h3>
//             {viewFile.endsWith(".fbx") ? (
//               <FBXViewer fileUrl={viewFile} />
//             ) : (
//               <model-viewer
//                 src={viewFile}
//                 alt="3D Model"
//                 camera-controls
//                 auto-rotate
//                 style={{
//                   width: "100%",
//                   height: "500px",
//                   border: "1px solid #ddd",
//                   borderRadius: "0.5rem",
//                 }}
//               ></model-viewer>
//             )}

//             <button
//               onClick={() => {
//                 URL.revokeObjectURL(viewFile);
//                 setViewFile(null);
//               }}
//               className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
//             >
//               Close Viewer
//             </button>
//           </div>
//         )}
//       </main>
//     </div>
//   );
// }
//without vr working
// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import API from "../utils/api";
// import "@google/model-viewer";
// import FBXViewer from "../components/FBXViewer";
// import { Bell, User, LogOut } from "lucide-react";

// export default function UserDashboard() {
//   const navigate = useNavigate();
//   const [projects, setProjects] = useState([]);
//   const [viewFile, setViewFile] = useState(null);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [showProfileMenu, setShowProfileMenu] = useState(false);
//   const [loadingModel, setLoadingModel] = useState(false);

//   const handleLogout = () => {
//     localStorage.clear();
//     navigate("/login");
//   };

//   useEffect(() => {
//     const fetchProjects = async () => {
//       try {
//         const userId = localStorage.getItem("userId");
//         if (!userId) return;

//         const res = await API.get(`/projects/my-projects?userId=${userId}`);
//         setProjects(res.data);
//       } catch (err) {
//         console.error("Error fetching projects:", err);
//       }
//     };
//     fetchProjects();
//   }, []);

//   const downloadFile = (fileId, fileName) => {
//     window.open(`http://localhost:5000/api/projects/file/${fileId}?download=true`, "_blank");
//   };

//   const viewFileHandler = async (fileId) => {
//     try {
//       setLoadingModel(true);

//       const url = `http://localhost:5000/api/projects/file/${fileId}`;
//       setViewFile(url);

//       // Max 10 seconds fallback
//       setTimeout(() => setLoadingModel(false), 10000);
//     } catch (err) {
//       console.error("Error viewing file:", err);
//       alert("Cannot load model. The file might be corrupted or in an unsupported format.");
//       setLoadingModel(false);
//     }
//   };

//   const filteredProjects = projects.filter((p) =>
//     p.name.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <div className="flex flex-col min-h-screen bg-gray-50">
//       {/* HEADER */}
//       <header className="bg-white shadow-sm border-b sticky top-0 z-50">
//         <div className="flex items-center justify-between px-6 py-3">
//           <div className="flex items-center space-x-2">
//             <span className="text-2xl font-bold text-blue-600">EdgeVR</span>
//           </div>

//           <div className="flex-grow max-w-xl mx-6">
//             <input
//               type="text"
//               placeholder="Search 3D models"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="w-full border rounded-md px-4 py-2 text-gray-700 focus:ring-2 focus:ring-blue-400 focus:outline-none"
//             />
//           </div>

//           <div className="flex items-center space-x-5 relative">
//             <button className="text-gray-600 hover:text-blue-600">
//               <Bell className="w-5 h-5" />
//             </button>

//             <div className="relative">
//               <button
//                 onClick={() => setShowProfileMenu(!showProfileMenu)}
//                 className="text-gray-600 hover:text-blue-600"
//               >
//                 <User className="w-5 h-5" />
//               </button>
//               {showProfileMenu && (
//                 <div className="absolute right-0 mt-2 w-32 bg-white border rounded shadow-md">
//                   <button
//                     onClick={handleLogout}
//                     className="flex items-center gap-2 w-full px-4 py-2 text-gray-700 hover:bg-red-500 hover:text-white rounded"
//                   >
//                     <LogOut className="w-4 h-4" /> Logout
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* MAIN CONTENT */}
//       <main className="flex-1 overflow-auto p-8">
//         <div className="space-y-4">
//           {filteredProjects.length > 0 ? (
//             filteredProjects.map((p) => (
//               <div
//                 key={p._id}
//                 className="border bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition-all"
//               >
//                 <h2 className="font-semibold text-lg text-gray-800">{p.name}</h2>
//                 <p className="text-gray-600">{p.description}</p>

//                 {p.modelFileId && (
//                   <div className="flex gap-2 mt-3">
//                     <button
//                       onClick={() => downloadFile(p.modelFileId.toString(), p.modelFileName)}
//                       className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
//                     >
//                       Download Main Model
//                     </button>
//                     <button
//                       onClick={() => viewFileHandler(p.modelFileId.toString())}
//                       className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
//                     >
//                       View Main Model
//                     </button>
//                   </div>
//                 )}

//                 {p.subModels?.length > 0 && (
//                   <div className="mt-4">
//                     <h3 className="font-semibold text-gray-700">Submodels:</h3>
//                     {p.subModels.map((s, i) => (
//                       <div key={i} className="flex items-center gap-2 mt-2">
//                         <span className="text-gray-700">{s.name}</span>
//                         {s.fileId && (
//                           <>
//                             <button
//                               onClick={() => downloadFile(s.fileId.toString(), s.fileName)}
//                               className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
//                             >
//                               Download
//                             </button>
//                             <button
//                               onClick={() => viewFileHandler(s.fileId.toString())}
//                               className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
//                             >
//                               View
//                             </button>
//                           </>
//                         )}
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             ))
//           ) : (
//             <p className="text-gray-600">No projects found.</p>
//           )}
//         </div>

//         {/* MODEL VIEWER */}
//         {viewFile && (
//           <div className="mt-8 bg-white rounded-xl shadow-md p-5">
//             {loadingModel && (
//               <div className="text-center font-semibold text-gray-700 mb-3">
//                 Loading model...
//               </div>
//             )}
//             {viewFile.endsWith(".fbx") ? (
//               <FBXViewer
//                 fileUrl={viewFile}
//                 onLoad={() => setLoadingModel(false)}
//               />
//             ) : (
//               <model-viewer
//                 src={viewFile}
//                 alt="3D Model"
//                 camera-controls
//                 auto-rotate
//                 onLoad={() => setLoadingModel(false)}
//                 style={{
//                   width: "100%",
//                   height: "500px",
//                   border: "1px solid #ddd",
//                   borderRadius: "0.5rem",
//                 }}
//               ></model-viewer>
//             )}

//             <button
//               onClick={() => {
//                 URL.revokeObjectURL(viewFile);
//                 setViewFile(null);
//                 setLoadingModel(false);
//               }}
//               className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
//             >
//               Close Viewer
//             </button>
//           </div>
//         )}
//       </main>
//     </div>
//   );
// }
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/api";
import "@google/model-viewer";
import FBXViewer from "../components/FBXViewer";
import { Bell, User, LogOut } from "lucide-react";

export default function UserDashboard() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [viewFile, setViewFile] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [loadingModel, setLoadingModel] = useState(false);
  const [vrPopup, setVrPopup] = useState({ open: false, fileId: null });

  // ✅ Updated: Auto-launch VR when Meta Quest 3 is detected
useEffect(() => {
  if (!vrPopup.open) return;

  const checkVR = async () => {
    // Wait until popup DOM renders
    let xrStatus = null;
    for (let i = 0; i < 10; i++) {
      xrStatus = document.getElementById("xr-status");
      if (xrStatus) break;
      await new Promise((r) => setTimeout(r, 100)); // wait 100ms
    }
    if (!xrStatus) return; // still not found, exit safely

    if (navigator.xr) {
      try {
        const supported = await navigator.xr.isSessionSupported("immersive-vr");
        if (supported) {
          xrStatus.textContent = "✅ Meta Quest 3 detected. Launching VR view...";
          setTimeout(() => {
            window.open(`/vr-viewer?file=${vrPopup.fileId}`, "_blank");
            setVrPopup({ open: false, fileId: null });
          }, 1200);
          
        } else {
          xrStatus.textContent =
            "❌ No VR headset detected. Please connect your Meta Quest 3.";
        }
      } catch {
        xrStatus.textContent = "⚠️ VR not supported on this browser.";
      }
    } else {
      xrStatus.textContent =
        "⚠️ WebXR not supported. Use Chrome or Quest Browser.";
    }
  };

  checkVR();
}, [vrPopup.open]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) return;

        const res = await API.get(`/projects/my-projects?userId=${userId}`);
        setProjects(res.data);
      } catch (err) {
        console.error("Error fetching projects:", err);
      }
    };
    fetchProjects();
  }, []);

  const downloadFile = (fileId, fileName) => {
    window.open(`http://localhost:5000/api/projects/file/${fileId}?download=true`, "_blank");
  };

  const viewFileHandler = async (fileId) => {
    try {
      setLoadingModel(true);
      const url = `http://localhost:5000/api/projects/file/${fileId}`;
      setViewFile(url);
      setTimeout(() => setLoadingModel(false), 10000);
    } catch (err) {
      console.error("Error viewing file:", err);
      alert("Cannot load model. The file might be corrupted or in an unsupported format.");
      setLoadingModel(false);
    }
  };

  const filteredProjects = projects.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* HEADER */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-blue-600">EdgeVR</span>
          </div>

          <div className="flex-grow max-w-xl mx-6">
            <input
              type="text"
              placeholder="Search 3D models"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border rounded-md px-4 py-2 text-gray-700 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>

          <div className="flex items-center space-x-5 relative">
            <button className="text-gray-600 hover:text-blue-600">
              <Bell className="w-5 h-5" />
            </button>

            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="text-gray-600 hover:text-blue-600"
              >
                <User className="w-5 h-5" />
              </button>
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-32 bg-white border rounded shadow-md">
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full px-4 py-2 text-gray-700 hover:bg-red-500 hover:text-white rounded"
                  >
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-auto p-8">
        <div className="space-y-4">
          {filteredProjects.length > 0 ? (
            filteredProjects.map((p) => (
              <div
                key={p._id}
                className="border bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition-all"
              >
                <h2 className="font-semibold text-lg text-gray-800">{p.name}</h2>
                <p className="text-gray-600">{p.description}</p>

                {p.modelFileId && (
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => downloadFile(p.modelFileId.toString(), p.modelFileName)}
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                    >
                      Download Main Model
                    </button>
                    <button
                      onClick={() => viewFileHandler(p.modelFileId.toString())}
                      className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                    >
                      View Main Model
                    </button>
                    <button
                      onClick={() => setVrPopup({ open: true, fileId: p.modelFileId.toString() })}
                      className="bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700"
                    >
                      View in VR
                    </button>
                  </div>
                )}

                {p.subModels?.length > 0 && (
                  <div className="mt-4">
                    <h3 className="font-semibold text-gray-700">Submodels:</h3>
                    {p.subModels.map((s, i) => (
                      <div key={i} className="flex items-center gap-2 mt-2">
                        <span className="text-gray-700">{s.name}</span>
                        {s.fileId && (
                          <>
                            <button
                              onClick={() => downloadFile(s.fileId.toString(), s.fileName)}
                              className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                            >
                              Download
                            </button>
                            <button
                              onClick={() => viewFileHandler(s.fileId.toString())}
                              className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                            >
                              View
                            </button>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-600">No projects found.</p>
          )}
        </div>

        {/* MODEL VIEWER */}
        {viewFile && (
          <div className="mt-8 bg-white rounded-xl shadow-md p-5">
            {loadingModel && (
              <div className="text-center font-semibold text-gray-700 mb-3">
                Loading model...
              </div>
            )}
            {viewFile.endsWith(".fbx") ? (
              <FBXViewer fileUrl={viewFile} onLoad={() => setLoadingModel(false)} />
            ) : (
              <model-viewer
                src={viewFile}
                alt="3D Model"
                camera-controls
                auto-rotate
                onLoad={() => setLoadingModel(false)}
                style={{
                  width: "100%",
                  height: "500px",
                  border: "1px solid #ddd",
                  borderRadius: "0.5rem",
                }}
              ></model-viewer>
            )}

            <button
              onClick={() => {
                URL.revokeObjectURL(viewFile);
                setViewFile(null);
                setLoadingModel(false);
              }}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Close Viewer
            </button>

            {/* ✅ VR Popup (auto-launch when detected) */}
            {vrPopup.open && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
                <div className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full relative">
                  <button
                    onClick={() => setVrPopup({ open: false, fileId: null })}
                    className="absolute top-2 right-3 text-gray-500 hover:text-red-500 text-xl"
                  >
                    ✕
                  </button>

                  <h2 className="text-xl font-bold mb-4 text-center text-gray-800">
                    View This Model in Virtual Reality
                  </h2>

                  <div
                    id="xr-status"
                    className="text-center text-gray-700 mb-4 flex flex-col items-center"
                  >
                    <div className="w-6 h-6 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-2"></div>
                    Checking for connected VR headset...
                  </div>

                  <div className="text-sm text-gray-600 mt-3 border-t pt-3">
                    <p><strong>On Meta Quest 3:</strong></p>
                    <ul className="list-disc ml-5 text-left">
                      <li>Make sure your Quest 3 is connected via Oculus Link (USB or Air Link)</li>
                      <li>Or open this site in the Meta Browser (via HTTPS)</li>
                      <li>VR will launch automatically when detected</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
