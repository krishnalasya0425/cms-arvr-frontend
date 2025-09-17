import React, { useState } from "react";

export default function ProjectsTable({ projects, onLaunchBuild, users, onAssignUsers }) {
  const [assigningProject, setAssigningProject] = useState(null); // project being assigned
  const [selectedUsers, setSelectedUsers] = useState([]);
const openAssignModal = (project) => {
  setAssigningProject(project);
  setSelectedUsers(project.assignedTo ? [project.assignedTo._id] : []);
};

// On assign button click, send only one user
const handleAssignUsers = (userId) => {
  onAssignUsers(assigningProject._id, userId); // pass single userId
  setAssigningProject(null);
};

  const handleToggleUser = (userId) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter((id) => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };

  
  return (
    <div className="overflow-x-auto bg-white p-4 rounded shadow">
      <table className="min-w-full divide-y divide-gray-200 border border-gray-300">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b border-gray-300">Project Name</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b border-gray-300">Modules</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b border-gray-300">Submodules</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b border-gray-300">Launch</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b border-gray-300">Assign Users</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {projects.map((project) => (
            <tr key={project._id} className="border-b border-gray-300">
              <td className="px-4 py-2 font-medium border-r border-gray-300">{project.name}</td>
              <td className="px-4 py-2 space-y-1 border-r border-gray-300">
                {project.modules.map((mod, i) => (
                  <div key={i} className="text-blue-600 cursor-pointer hover:underline" onClick={() => onLaunchBuild(mod.buildPath)}>
                    {mod.name}
                  </div>
                ))}
              </td>
              <td className="px-4 py-2 space-y-1 border-r border-gray-300">
                {project.modules.map((mod, mi) =>
                  mod.subModules.map((sub, si) => (
                    <div key={`${mi}-${si}`} className="text-green-600 cursor-pointer hover:underline" onClick={() => onLaunchBuild(sub.buildPath)}>
                      {sub.name}
                    </div>
                  ))
                )}
              </td>
              <td className="px-4 py-2">
                <button className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700" onClick={() => onLaunchBuild(project.modules[0]?.buildPath)}>
                  Launch Build
                </button>
              </td>
              <td className="px-4 py-2">
                <button className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700" onClick={() => openAssignModal(project)}>
                  Assign Users
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Assign Users Modal */}
      {assigningProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded p-6 w-96">
            <h3 className="text-lg font-bold mb-4">Assign Users to {assigningProject.name}</h3>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {users.map((user) => (
                <label key={user._id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(user._id)}
                    onChange={() => handleToggleUser(user._id)}
                  />
                  <span>{user.username} ({user.email})</span>
                </label>
              ))}
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400" onClick={() => setAssigningProject(null)}>
                Cancel
              </button>
              <button className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700" onClick={handleAssignUsers}>
                Assign
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
