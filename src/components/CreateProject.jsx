import { useState } from "react";
import axios from "axios";

export default function CreateProject({ token, onProjectCreated }) {
  const [projectName, setProjectName] = useState("");
  const [modules, setModules] = useState([{ name: "", buildPath: "", subModules: [] }]);
  const [loading, setLoading] = useState(false);
  const [assignedUsers, setAssignedUsers] = useState([]); 


  // Module handlers
  const handleModuleChange = (index, value) => {
    const updated = [...modules];
    updated[index].name = value;
    setModules(updated);
  };

  const pickModuleFolder = async (index) => {
    try {
      const folderPath = await window.electronAPI.pickUnityBuild();
      if (folderPath) {
        const updated = [...modules];
        updated[index].buildPath = folderPath;
        setModules(updated);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmoduleChange = (moduleIndex, subIndex, value) => {
    const updated = [...modules];
    updated[moduleIndex].subModules[subIndex].name = value;
    setModules(updated);
  };

  const pickSubmoduleFolder = async (moduleIndex, subIndex) => {
    try {
      const folderPath = await window.electronAPI.pickUnityBuild();
      if (folderPath) {
        const updated = [...modules];
        updated[moduleIndex].subModules[subIndex].buildPath = folderPath;
        setModules(updated);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Add / remove modules
  const addModule = () => setModules([...modules, { name: "", buildPath: "", subModules: [] }]);
  const removeModule = (index) => {
    const updated = [...modules];
    updated.splice(index, 1);
    setModules(updated);
  };

  // Add / remove submodules
  const addSubmodule = (moduleIndex) => {
    const updated = [...modules];
    updated[moduleIndex].subModules.push({ name: "", buildPath: "" });
    setModules(updated);
  };
  const removeSubmodule = (moduleIndex, subIndex) => {
    const updated = [...modules];
    updated[moduleIndex].subModules.splice(subIndex, 1);
    setModules(updated);
  };

  // Submit project to backend
  const handleSubmit = async (e) => {
  e.preventDefault();
  if (!projectName.trim()) return alert("Project name required");
  setLoading(true);

  try {
    const res = await axios.post(
      "http://localhost:5000/api/projects/create",
      { name: projectName, modules }, // no assignedTo needed
      { headers: { Authorization: `Bearer ${token}` } }
    );

    alert("Project created successfully!");
    setProjectName("");
    setModules([{ name: "", buildPath: "", subModules: [] }]);
    onProjectCreated(res.data);
  } catch (err) {
    console.error(err);
    alert("Failed to create project.");
  }

  setLoading(false);
};

  return (
    <div className="max-w-3xl bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Create Project</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Project Name */}
        <div>
          <label className="block font-medium mb-1">Project Name</label>
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            className="w-full border border-gray-300 rounded p-2"
            required
          />
        </div>

        {/* Modules */}
        <div>
          <h3 className="font-semibold mb-2">Modules</h3>
          {modules.map((module, mIndex) => (
            <div key={mIndex} className="border border-gray-200 p-3 rounded mb-4">
              <div className="flex justify-between items-center mb-2">
                <label className="font-medium">Module Name</label>
                {modules.length > 1 && (
                  <button
                    type="button"
                    className="text-red-600"
                    onClick={() => removeModule(mIndex)}
                  >
                    Remove Module
                  </button>
                )}
              </div>
              <input
                type="text"
                value={module.name}
                onChange={(e) => handleModuleChange(mIndex, e.target.value)}
                className="w-full border border-gray-300 rounded p-2 mb-2"
                placeholder="Module Name"
                required
              />

              <button
                type="button"
                onClick={() => pickModuleFolder(mIndex)}
                className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 mb-2"
              >
                Pick Build Folder
              </button>
              {module.buildPath && (
                <p className="text-sm text-gray-600 truncate">Selected: {module.buildPath}</p>
              )}

              {/* Submodules */}
              <div className="pl-4 space-y-2">
                <h4 className="font-medium mb-1">Submodules / Builds</h4>
                {module.subModules.map((sub, sIndex) => (
                  <div key={sIndex} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={sub.name}
                      onChange={(e) => handleSubmoduleChange(mIndex, sIndex, e.target.value)}
                      placeholder="Submodule Name"
                      className="flex-1 border border-gray-300 rounded p-2"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => pickSubmoduleFolder(mIndex, sIndex)}
                      className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                    >
                      Pick Folder
                    </button>
                    {sub.buildPath && (
                      <p className="text-sm text-gray-600 truncate">Selected: {sub.buildPath}</p>
                    )}
                    <button
                      type="button"
                      className="text-red-600"
                      onClick={() => removeSubmodule(mIndex, sIndex)}
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className="mt-2 text-blue-600 hover:underline"
                  onClick={() => addSubmodule(mIndex)}
                >
                  + Add Submodule
                </button>
              </div>
            </div>
          ))}
          <button
            type="button"
            className="text-blue-600 hover:underline mb-4"
            onClick={addModule}
          >
            + Add Module
          </button>
        </div>

        <button
          type="submit"
          className={`px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Project"}
        </button>
      </form>
    </div>
  );
}
