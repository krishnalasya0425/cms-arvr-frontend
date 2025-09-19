import React from "react";

export default function ProjectRow({
  project,
  users,
  onLaunchBuild,
  onDeleteProject,
  setInfoProject,
  setEditProject,
  selectedUser,
  setSelectedUser,
  handleUnassign,
}) {
  return (
    <tr className="border-b border-gray-300">
      <td className="px-4 py-2 font-medium border-r border-gray-300">{project.name}</td>
      <td className="px-4 py-2 border-r border-gray-300">
        {project.assignedTo ? (
          <div className="flex justify-between items-center">
            <span className="px-2 py-1 bg-green-100 text-green-800 rounded">
              {project.assignedTo.username} ({project.assignedTo.email})
            </span>
            <button
              className="ml-2 px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              onClick={() => {
                setEditProject({ ...project });
                handleUnassign(project._id);
              }}
            >
              Unassign
            </button>
          </div>
        ) : (
          <button
            className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700"
            onClick={() => {
              setInfoProject(null);
              setEditProject({ ...project, modules: project.modules || [] });
              setSelectedUser("");
            }}
          >
            Assign User
          </button>
        )}
      </td>
      <td className="px-4 py-2 flex gap-2">
        <button
          className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
          onClick={() => {
            setEditProject(null);
            setInfoProject(project);
          }}
        >
          Info
        </button>
        <button
          className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
          onClick={() => {
            setInfoProject(null);
            setEditProject({ ...project, modules: project.modules || [] });
            setSelectedUser(project.assignedTo?._id || "");
          }}
        >
          Edit
        </button>
        <button
          className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
          onClick={() => onDeleteProject(project._id)}
        >
          Delete
        </button>
      </td>
    </tr>
  );
}
