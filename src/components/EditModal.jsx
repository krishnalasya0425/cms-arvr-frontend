import React from "react";

export default function EditModal({
  project,
  users,
  selectedUser,
  setSelectedUser,
  setEditProject,
  handleSaveChanges,
  handleUnassign,
}) {
  const handleModuleChange = (modIdx, value) => {
    setEditProject((prev) => ({
      ...prev,
      modules: prev.modules.map((m, idx) => (idx === modIdx ? { ...m, name: value } : m)),
    }));
  };

  const handleSubModuleChange = (modIdx, subIdx, value) => {
    setEditProject((prev) => ({
      ...prev,
      modules: prev.modules.map((m, idx) =>
        idx === modIdx
          ? { ...m, subModules: m.subModules.map((s, sIdx) => (sIdx === subIdx ? { ...s, name: value } : s)) }
          : m
      ),
    }));
  };

  const pickFolder = async (modIdx, subIdx = null) => {
    const folderPath = await window.electronAPI.pickUnityBuild();
    if (!folderPath) return;

    setEditProject((prev) => ({
      ...prev,
      modules: prev.modules.map((m, idx) =>
        idx === modIdx
          ? subIdx === null
            ? { ...m, buildPath: folderPath }
            : {
              ...m,
              subModules: m.subModules.map((s, sIdx) =>
                sIdx === subIdx ? { ...s, buildPath: folderPath } : s
              ),
            }
          : m
      ),
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded p-6 w-[700px] max-h-[80vh] overflow-y-auto relative">
        <h3 className="text-lg font-bold mb-4">Edit Project – {project.name}</h3>

        {/* Project Name */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Project Name</label>
          <input
            type="text"
            value={project.name}
            onChange={(e) => setEditProject({ ...project, name: e.target.value })}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        {/* Assign User */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Assigned User</label>
          {!project.assignedTo ? (
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="w-full border px-3 py-2 rounded"
            >
              <option value="">-- Select User --</option>
              {users.filter((u) => u.role !== "admin").map((u) => (
                <option key={u._id} value={u._id}>
                  {u.username} ({u.email})
                </option>
              ))}
            </select>
          ) : (
            <div className="flex justify-b5etween items-center">
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded">
                {project.assignedTo.username} ({project.assignedTo.email})
              </span>
              <button
                className="ml-2 px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                onClick={() => handleUnassign(project._id)}
              >
                Unassign
              </button>
            </div>
          )}
        </div>

        {/* Modules */}
        <div className="mb-4">
          <h4 className="font-semibold mb-2">Modules & Submodules</h4>
          {project.modules?.map((mod, mi) => (
            <div key={mi} className="border p-3 rounded mb-2">
              <div className="flex gap-2 mb-2 items-center">
                <input
                  type="text"
                  placeholder="Module Name"
                  value={mod.name}
                  onChange={(e) => handleModuleChange(mi, e.target.value)}
                  className="flex-1 border px-2 py-1 rounded"
                />
                <button
                  className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 text-sm"
                  onClick={() => pickFolder(mi)}
                >
                  Select Folder
                </button>
                <span className="text-sm text-gray-600">{mod.buildPath || "No folder selected"}</span>
              </div>

              <ul className="ml-4">
                {mod.subModules?.map((sub, si) => (
                  <li key={si} className="flex gap-2 mb-1 items-center">
                    <input
                      type="text"
                      placeholder="Submodule Name"
                      value={sub.name}
                      onChange={(e) => handleSubModuleChange(mi, si, e.target.value)}
                      className="flex-1 border px-2 py-1 rounded"
                    />
                    <button
                      className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 text-sm"
                      onClick={() => pickFolder(mi, si)}
                    >
                      Select Folder
                    </button>
                    <span className="text-sm text-gray-500">{sub.buildPath || "No folder selected"}</span>
                  </li>
                ))}
              </ul>

              <button
                className="mt-2 px-2 py-1 text-xs bg-blue-500 text-white rounded"
                onClick={() => {
                  setEditProject((prev) => {
                    if (!prev.modules) return prev; // safety check
                    return {
                      ...prev,
                      modules: prev.modules.map((m, idx) =>
                        idx === mi
                          ? {
                            ...m,
                            subModules: m.subModules
                              ? [...m.subModules, { name: "", buildPath: "" }]
                              : [{ name: "", buildPath: "" }],
                          }
                          : m
                      ),
                    };
                  });
                }}
              >
                + Add Submodule
              </button>

            </div>
          ))}

          <button
            className="px-3 py-1 bg-green-500 text-white rounded"
            onClick={() =>
              setEditProject((prev) => ({
                ...prev,
                modules: [...(prev.modules || []), { name: "New Module", buildPath: "", subModules: [] }],
              }))
            }
          >
            + Add Module
          </button>
        </div>

        {/* Actions */}
        <div className="mt-4 flex justify-end gap-2">
          <button className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400" onClick={() => setEditProject(null)}>
            Cancel
          </button>
          <button className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700" onClick={handleSaveChanges}>
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
