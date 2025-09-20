//working code before dividing into components 
// // import React, { useState } from "react";

// export default function ProjectsTable({
//   projects,
//   users,
//   onLaunchBuild,
//   onAssignUsers,
//   onUnassignUser,
//   onDeleteProject,
//   onUpdateProject,
// }) {
//   const [infoProject, setInfoProject] = useState(null);
//   const [editProject, setEditProject] = useState(null);
//   const [selectedUser, setSelectedUser] = useState("");

//   // Save changes (assign + project details)
//   const handleSaveChanges = () => {
//   if (!editProject) return;

//   // Deep copy to avoid mutation issues
//   const updatedProject = JSON.parse(JSON.stringify(editProject));

//   // Handle assigned user
//   if (selectedUser) {
//     updatedProject.assignedTo =
//       users.find((u) => u._id === selectedUser) || null;
//   } else if (!selectedUser && editProject.assignedTo) {
//     updatedProject.assignedTo = editProject.assignedTo;
//   } else {
//     updatedProject.assignedTo = null;
//   }

//   // Ensure modules/subModules exist
//   updatedProject.modules = (updatedProject.modules || []).map((mod) => ({
//     ...mod,
//     subModules: mod.subModules || [],
//   }));

//   // Call parent update function
//   onUpdateProject(updatedProject);

//   // Reset local state
//   setEditProject(null);
//   setSelectedUser("");
// };



//   const handleDeleteProject = (id) => {
//     if (infoProject?._id === id) setInfoProject(null);
//     if (editProject?._id === id) setEditProject(null);
//     onDeleteProject(id);
//   };

//   const handleUnassign = (projectId) => {
//     onUnassignUser(projectId);
//     setEditProject((prev) =>
//       prev ? { ...prev, assignedTo: null } : null
//     );
//     setSelectedUser("");
//   };

//   return (
//     <div className="overflow-x-auto bg-white p-4 rounded shadow">
//       <table className="min-w-full divide-y divide-gray-200 border border-gray-300">
//         <thead className="bg-gray-50">
//           <tr>
//             <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b border-gray-300">
//               Project Name
//             </th>
//             <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b border-gray-300">
//               Assigned User
//             </th>
//             <th className="px-4 py-2 border-b border-gray-300">Actions</th>
//           </tr>
//         </thead>
//         <tbody className="divide-y divide-gray-200">
//           {projects.map((project) => (
//             <tr key={project._id} className="border-b border-gray-300">
//               <td className="px-4 py-2 font-medium border-r border-gray-300">
//                 {project.name}
//               </td>
//               <td className="px-4 py-2 border-r border-gray-300">
//                 {project.assignedTo ? (
//                   <div className="flex justify-between items-center">
//                     <span className="px-2 py-1 bg-green-100 text-green-800 rounded">
//                       {project.assignedTo.username} ({project.assignedTo.email})
//                     </span>
//                     <button
//                       className="ml-2 px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
//                       onClick={() => {
//                         setEditProject({ ...project });
//                         handleUnassign(project._id);
//                       }}
//                     >
//                       Unassign
//                     </button>
//                   </div>
//                 ) : (
//                   <button
//                     className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700"
//                     onClick={() => {
//                       setInfoProject(null);
//                       setEditProject({
//                         ...project,
//                         modules: project.modules || [],
//                       });
//                       setSelectedUser("");
//                     }}
//                   >
//                     Assign User
//                   </button>
//                 )}
//               </td>
//               <td className="px-4 py-2 flex gap-2">
//                 <button
//                   className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
//                   onClick={() => {
//                     setEditProject(null);
//                     setInfoProject(project);
//                   }}
//                 >
//                   Info
//                 </button>
//                 <button
//                   className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
//                   onClick={() => {
//                     setInfoProject(null);
//                     setEditProject({
//                       ...project,
//                       modules: project.modules || [],
//                     });
//                     setSelectedUser(project.assignedTo?._id || "");
//                   }}
//                 >
//                   Edit
//                 </button>
//                 <button
//                   className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
//                   onClick={() => handleDeleteProject(project._id)}
//                 >
//                   Delete
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       {/* Info Modal */}
//       {infoProject && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-2xl shadow-lg p-6 w-[600px] max-h-[80vh] overflow-y-auto relative">
//             <button
//               className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
//               onClick={() => setInfoProject(null)}
//             >
//               ✕
//             </button>

//             <h3 className="text-2xl font-bold mb-4 text-center text-blue-700">
//               Project Details – {infoProject.name}
//             </h3>

//             <p className="mb-4 text-gray-700">
//               <strong>Assigned To:</strong>{" "}
//               {infoProject.assignedTo
//                 ? `${infoProject.assignedTo.username} (${infoProject.assignedTo.email})`
//                 : "Unassigned"}
//             </p>

//             <div className="space-y-4">
//               {infoProject.modules?.map((mod, mi) => (
//                 <div
//                   key={mi}
//                   className="border border-gray-300 rounded-lg p-3 bg-gray-50"
//                 >
//                   <div className="flex justify-between items-center mb-2">
//                     <h4 className="font-semibold text-blue-600">{mod.name}</h4>
//                     {mod.buildPath && (
//                       <button
//                         className="px-2 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
//                         onClick={() => onLaunchBuild(mod.buildPath)}
//                       >
//                         Launch Build
//                       </button>
//                     )}
//                   </div>

//                   {mod.subModules?.length > 0 ? (
//                     <ul className="ml-4 list-disc space-y-1">
//                       {mod.subModules.map((sub, si) => (
//                         <li key={si} className="flex justify-between items-center">
//                           <span>{sub.name}</span>
//                           {sub.buildPath && (
//                             <button
//                               className="px-2 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600"
//                               onClick={() => onLaunchBuild(sub.buildPath)}
//                             >
//                               Launch
//                             </button>
//                           )}
//                         </li>
//                       ))}
//                     </ul>
//                   ) : (
//                     <p className="ml-4 text-gray-500 text-sm">No submodules</p>
//                   )}
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Edit Modal */}
//       {editProject && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded p-6 w-[700px] max-h-[80vh] overflow-y-auto relative">
//             <h3 className="text-lg font-bold mb-4">Edit Project – {editProject.name}</h3>

//             {/* Project Name */}
//             <div className="mb-4">
//               <label className="block text-sm font-medium mb-1">Project Name</label>
//               <input
//                 type="text"
//                 value={editProject.name}
//                 onChange={(e) =>
//                   setEditProject({ ...editProject, name: e.target.value })
//                 }
//                 className="w-full border px-3 py-2 rounded"
//               />
//             </div>

//             {/* Assign User */}
//             <div className="mb-4">
//               <label className="block text-sm font-medium mb-1">Assigned User</label>
//               {!editProject.assignedTo ? (
//                 <select
//                   value={selectedUser}
//                   onChange={(e) => setSelectedUser(e.target.value)}
//                   className="w-full border px-3 py-2 rounded"
//                 >
//                   <option value="">-- Select User --</option>
//                   {users
//                     .filter((u) => u.role !== "admin")
//                     .map((u) => (
//                       <option key={u._id} value={u._id}>
//                         {u.username} ({u.email})
//                       </option>
//                     ))}
//                 </select>
//               ) : (
//                 <div className="flex justify-between items-center">
//                   <span className="px-2 py-1 bg-green-100 text-green-800 rounded">
//                     {editProject.assignedTo.username} ({editProject.assignedTo.email})
//                   </span>
//                   <button
//                     className="ml-2 px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
//                     onClick={() => handleUnassign(editProject._id)}
//                   >
//                     Unassign
//                   </button>
//                 </div>
//               )}
//             </div>

//             {/* Modules & Submodules */}
//             <div className="mb-4">
//               <h4 className="font-semibold mb-2">Modules & Submodules</h4>
//               {editProject.modules?.map((mod, mi) => (
//                 <div key={mi} className="border p-3 rounded mb-2">
//                   <div className="flex gap-2 mb-2 items-center">
//                     <input
//                       type="text"
//                       placeholder="Module Name"
//                       value={mod.name}
//                       onChange={(e) =>
//                         setEditProject((prev) => ({
//                           ...prev,
//                           modules: prev.modules.map((m, idx) =>
//                             idx === mi ? { ...m, name: e.target.value } : m
//                           ),
//                         }))
//                       }
//                       className="flex-1 border px-2 py-1 rounded"
//                     />
//                     <button
//                       className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 text-sm"
//                       onClick={async () => {
//                         const folderPath = await window.electronAPI.pickUnityBuild();
//                         if (folderPath) {
//                           setEditProject((prev) => ({
//                             ...prev,
//                             modules: prev.modules.map((m, idx) =>
//                               idx === mi ? { ...m, buildPath: folderPath } : m
//                             ),
//                           }));
//                         }
//                       }}
//                     >
//                       Select Folder
//                     </button>
//                     <span className="text-sm text-gray-600">
//                       {mod.buildPath || "No folder selected"}
//                     </span>
//                   </div>

//                   <ul className="ml-4">
//                     {mod.subModules?.map((sub, si) => (
//                       <li key={si} className="flex gap-2 mb-1 items-center">
//                         <input
//                           type="text"
//                           placeholder="Submodule Name"
//                           value={sub.name}
//                           onChange={(e) =>
//                             setEditProject((prev) => ({
//                               ...prev,
//                               modules: prev.modules.map((m, idx) =>
//                                 idx === mi
//                                   ? {
//                                       ...m,
//                                       subModules: m.subModules.map((s, sIdx) =>
//                                         sIdx === si ? { ...s, name: e.target.value } : s
//                                       ),
//                                     }
//                                   : m
//                               ),
//                             }))
//                           }
//                           className="flex-1 border px-2 py-1 rounded"
//                         />
//                         <button
//                           className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 text-sm"
//                           onClick={async () => {
//                             const folderPath = await window.electronAPI.pickUnityBuild();
//                             if (folderPath) {
//                               setEditProject((prev) => ({
//                                 ...prev,
//                                 modules: prev.modules.map((m, idx) =>
//                                   idx === mi
//                                     ? {
//                                         ...m,
//                                         subModules: m.subModules.map((s, sIdx) =>
//                                           sIdx === si ? { ...s, buildPath: folderPath } : s
//                                         ),
//                                       }
//                                     : m
//                                 ),
//                               }));
//                             }
//                           }}
//                         >
//                           Select Folder
//                         </button>
//                         <span className="text-sm text-gray-500">
//                           {sub.buildPath || "No folder selected"}
//                         </span>
//                       </li>
//                     ))}
//                   </ul>

//                   <button
//                     className="mt-2 px-2 py-1 text-xs bg-blue-500 text-white rounded"
//                     onClick={() =>
//                       setEditProject((prev) => ({
//                         ...prev,
//                         modules: prev.modules.map((m, idx) =>
//                           idx === mi
//                             ? {
//                                 ...m,
//                                 subModules: [
//                                   ...(m.subModules || []),
//                                   { name: "", buildPath: "" },
//                                 ],
//                               }
//                             : m
//                         ),
//                       }))
//                     }
//                   >
//                     + Add Submodule
//                   </button>
//                 </div>
//               ))}

//               <button
//                 className="px-3 py-1 bg-green-500 text-white rounded"
//                 onClick={() =>
//                   setEditProject((prev) => ({
//                     ...prev,
//                     modules: [
//                       ...(prev.modules || []),
//                       { name: "New Module", buildPath: "", subModules: [] },
//                     ],
//                   }))
//                 }
//               >
//                 + Add Module
//               </button>
//             </div>

//             {/* Actions */}
//             <div className="mt-4 flex justify-end gap-2">
//               <button
//                 className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
//                 onClick={() => setEditProject(null)}
//               >
//                 Cancel
//               </button>
//               <button
//                 className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
//                 onClick={handleSaveChanges}
//               >
//                 Save Changes
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
import React, { useState } from "react";
import ProjectRow from "./ProjectRow";
import InfoModal from "./InfoModal";
import EditModal from "./EditModal";
import axios from "axios";

export default function ProjectsTable({
  projects,
  users,
  onLaunchBuild,
  onAssignUsers,
  onUnassignUser,
  onDeleteProject,
  onUpdateProject,
}) {
  const [infoProject, setInfoProject] = useState(null);
  const [editProject, setEditProject] = useState(null);
  const [selectedUser, setSelectedUser] = useState("");

  const handleSaveChanges = async () => {
  if (!editProject) return;

  try {
    const token = localStorage.getItem("token"); // ✅ get token

    // 1️⃣ Update modules/submodules and project name
    const res = await axios.put(
      `http://localhost:5000/api/projects/${editProject._id}`,
      {
        name: editProject.name,
        modules: editProject.modules,
      },
      { headers: { Authorization: `Bearer ${token}` } } // use token
    );

    // 2️⃣ Assign user if selected
    if (selectedUser) {
      await onAssignUsers(editProject._id, selectedUser);
    } else if (!editProject.assignedTo) {
      await onUnassignUser(editProject._id);
    }

    // 3️⃣ Update frontend state
    onUpdateProject(res.data);
    setEditProject(null);
    setSelectedUser("");
  } catch (err) {
    console.error("Save changes error:", err);
    alert("Failed to save project changes");
  }
};




  const handleUnassign = (projectId) => {
    onUnassignUser(projectId);
    setEditProject((prev) => (prev ? { ...prev, assignedTo: null } : null));
    setSelectedUser("");
  };

  return (
    <div className="overflow-x-auto bg-white p-4 rounded shadow">
      <table className="min-w-full divide-y divide-gray-200 border border-gray-300">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b border-gray-300">
              Project Name
            </th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b border-gray-300">
              Assigned User
            </th>
            <th className="px-4 py-2 border-b border-gray-300">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {projects.map((project) => (
            <ProjectRow
              key={project._id}
              project={project}
              users={users}
              onLaunchBuild={onLaunchBuild}
              onDeleteProject={onDeleteProject}
              setInfoProject={setInfoProject}
              setEditProject={setEditProject}
              selectedUser={selectedUser}
              setSelectedUser={setSelectedUser}
              handleUnassign={handleUnassign}
            />
          ))}
        </tbody>
      </table>

      {infoProject && (
        <InfoModal
          project={infoProject}
          onClose={() => setInfoProject(null)}
          onLaunchBuild={onLaunchBuild}
        />
      )}

      {editProject && (
        <EditModal
          project={editProject}
          users={users}
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
          setEditProject={setEditProject}
          handleSaveChanges={handleSaveChanges}
          handleUnassign={handleUnassign}
        />
      )}
    </div>
  );
}
