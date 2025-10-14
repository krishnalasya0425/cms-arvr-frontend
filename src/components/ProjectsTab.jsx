import { useState } from "react";
import api from "../api/axios";

const ProjectsTab = ({
    projects,
    users,
    loading,
    fetchProjects,
    fetchUsers,
    modules,
    setModules,
    projectName,
    setProjectName,
    assignedUser,
    setAssignedUser,
}) => {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showInfoModal, setShowInfoModal] = useState(null); // store project for info modal
    const [editingProject, setEditingProject] = useState(null);
    const [models, setModels] = useState([
        { name: "", filePath: "", subModels: [{ name: "", filePath: "" }] },
    ]);

    // Modules
    const handleModuleChange = (index, field, value) => {
        const updatedModules = [...modules];
        updatedModules[index][field] = value;
        setModules(updatedModules);
    };

    const handleSubModuleChange = (moduleIndex, subIndex, field, value) => {
        const updatedModules = [...modules];
        updatedModules[moduleIndex].subModules[subIndex][field] = value;
        setModules(updatedModules);
    };

    const addModule = () =>
        setModules([
            ...modules,
            { name: "", buildPath: "", subModules: [{ name: "", buildPath: "" }] },
        ]);

    const addSubModule = (index) => {
        const updatedModules = [...modules];
        updatedModules[index].subModules.push({ name: "", buildPath: "" });
        setModules(updatedModules);
    };

    // Models
    const handleModelChange = (index, field, value) => {
        const updatedModels = [...models];
        updatedModels[index][field] = value;
        setModels(updatedModels);
    };

    const handleSubModelChange = (modelIndex, subIndex, field, value) => {
        const updatedModels = [...models];
        updatedModels[modelIndex].subModels[subIndex][field] = value;
        setModels(updatedModels);
    };

    const addModel = () =>
        setModels([
            ...models,
            { name: "", filePath: "", subModels: [{ name: "", filePath: "" }] },
        ]);

    const addSubModel = (index) => {
        const updatedModels = [...models];
        updatedModels[index].subModels.push({ name: "", filePath: "" });
        setModels(updatedModels);
    };

    const handleCreateProject = async () => {
        if (!projectName) return alert("Project name is required");

        // Validate modules
        for (let i = 0; i < modules.length; i++) {
            const mod = modules[i];
            if (!mod.name) return alert(`Module ${i + 1} name is required`);
            for (let j = 0; j < mod.subModules.length; j++) {
                const sub = mod.subModules[j];
                if (!sub.name)
                    return alert(`Submodule ${j + 1} of Module ${i + 1} name is required`);
            }
        }

        // Validate models
        for (let i = 0; i < models.length; i++) {
            const mod = models[i];
            if (!mod.name) return alert(`Model ${i + 1} name is required`);
            for (let j = 0; j < mod.subModels.length; j++) {
                const sub = mod.subModels[j];
                if (!sub.name)
                    return alert(`Submodel ${j + 1} of Model ${i + 1} name is required`);
            }
        }

        try {
            if (editingProject) {
                // Update project
                await api.put(`/projects/${editingProject._id}`, {
                    name: projectName,
                    modules,
                    models,
                    assignedTo: assignedUser || null,
                });
            } else {
                // Create new project
                await api.post("/projects/create", {
                    name: projectName,
                    modules,
                    models,
                    assignedTo: assignedUser || null,
                });
            }

            setShowCreateModal(false);
            setEditingProject(null);
            setProjectName("");
            setModules([{ name: "", buildPath: "", subModules: [{ name: "", buildPath: "" }] }]);
            setModels([{ name: "", filePath: "", subModels: [{ name: "", filePath: "" }] }]);
            setAssignedUser("");
            fetchProjects();
        } catch (err) {
            console.error("Create/Update project error:", err);
            alert("Error creating/updating project");
        }
    };

    const handleEditClick = (project) => {
        setEditingProject(project);
        setProjectName(project.name);
        setModules(
            project.modules.length
                ? project.modules
                : [{ name: "", buildPath: "", subModules: [{ name: "", buildPath: "" }] }]
        );
        setModels(
            project.models?.length
                ? project.models
                : [{ name: "", filePath: "", subModels: [{ name: "", filePath: "" }] }]
        );
        setAssignedUser(project.assignedTo?._id || "");
        setShowCreateModal(true);
    };

    const handleDeleteProject = async (id) => {
        if (!window.confirm("Are you sure you want to delete this project?")) return;
        try {
            await api.delete(`/projects/${id}`);
            fetchProjects();
        } catch (err) {
            console.error("Delete project error:", err);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Projects</h2>
                <button
                    onClick={async () => {
                        await fetchUsers();
                        setEditingProject(null);
                        setProjectName("");
                        setModules([{ name: "", buildPath: "", subModules: [{ name: "", buildPath: "" }] }]);
                        setModels([{ name: "", filePath: "", subModels: [{ name: "", filePath: "" }] }]);
                        setAssignedUser("");
                        setShowCreateModal(true);
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                    Create Project
                </button>
            </div>

            {loading ? (
                <p>Loading projects...</p>
            ) : projects.length === 0 ? (
                <p>No projects found.</p>
            ) : (
                <table className="w-full border border-gray-200">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-2 border">Project Name</th>
                            <th className="p-2 border">Assigned Users</th>
                            <th className="p-2 border">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {projects.map((proj) => (
                            <tr key={proj._id} className="hover:bg-gray-50">
                                <td className="p-2 border">{proj.name}</td>
                                <td className="p-2 border">
                                    {proj.assignedTo ? proj.assignedTo.username : "Unassigned"}
                                </td>
                                <td className="p-2 border flex gap-2">
                                    <button
                                        onClick={() => handleEditClick(proj)}
                                        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => setShowInfoModal(proj)}
                                        className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700"
                                    >
                                        Info
                                    </button>
                                    <button
                                        onClick={() => handleDeleteProject(proj._id)}
                                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {/* Create/Edit Project Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start pt-20 z-50">
                    <div className="bg-white p-6 rounded-lg w-3/4 max-h-[90vh] overflow-y-auto">
                        <h3 className="text-lg font-semibold mb-4">
                            {editingProject ? "Edit Project" : "Create Project"}
                        </h3>
                        <div className="mb-4">
                            <label className="block mb-1 font-medium">Project Name</label>
                            <input
                                type="text"
                                value={projectName}
                                onChange={(e) => setProjectName(e.target.value)}
                                className="w-full border border-gray-300 rounded px-3 py-2"
                            />
                        </div>

                        {/* Modules Section */}
                        {modules.map((mod, i) => (
                            <div key={i} className="mb-4 border p-3 rounded">
                                <div className="mb-2">
                                    <label className="block mb-1 font-medium">Module Name</label>
                                    <input
                                        type="text"
                                        value={mod.name}
                                        onChange={(e) => handleModuleChange(i, "name", e.target.value)}
                                        className="w-full border border-gray-300 rounded px-3 py-2"
                                    />
                                </div>
                                <div className="mb-2">
                                    <label className="block mb-1 font-medium">Module Build Path</label>
                                    <input
                                        type="file"
                                        webkitdirectory="true"
                                        directory=""
                                        onChange={(e) =>
                                            handleModuleChange(i, "buildPath", e.target.files[0]?.name || "")
                                        }
                                        className="w-full border border-gray-300 rounded px-3 py-2"
                                    />
                                </div>

                                {mod.subModules.map((sub, j) => (
                                    <div key={j} className="mb-2 pl-4 border-l">
                                        <label className="block mb-1 font-medium">Sub Module Name</label>
                                        <input
                                            type="text"
                                            value={sub.name}
                                            onChange={(e) => handleSubModuleChange(i, j, "name", e.target.value)}
                                            className="w-full border border-gray-300 rounded px-3 py-2 mb-1"
                                        />
                                        <label className="block mb-1 font-medium">Sub Module Build Path</label>
                                        <input
                                            type="file"
                                            webkitdirectory="true"
                                            directory=""
                                            onChange={(e) =>
                                                handleSubModuleChange(
                                                    i,
                                                    j,
                                                    "buildPath",
                                                    e.target.files[0]?.path || ""
                                                )
                                            }
                                            className="w-full border border-gray-300 rounded px-3 py-2"
                                        />
                                    </div>
                                ))}
                                <button
                                    onClick={() => addSubModule(i)}
                                    className="mt-2 px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
                                >
                                    Add Sub Module
                                </button>
                            </div>
                        ))}
                        <button
                            onClick={addModule}
                            className="mb-4 px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
                        >
                            Add Module
                        </button>

                        {/* Models Section */}
                        <h4 className="font-semibold mb-2">Models:</h4>
                        {models.map((mod, i) => (
                            <div key={i} className="mb-4 border p-3 rounded">
                                <div className="mb-2">
                                    <label className="block mb-1 font-medium">Model Name</label>
                                    <input
                                        type="text"
                                        value={mod.name}
                                        onChange={(e) => handleModelChange(i, "filePath", e.target.files[0]?.path || "")}
                                        className="w-full border border-gray-300 rounded px-3 py-2"
                                    />
                                </div>
                                <div className="mb-2">
                                    <label className="block mb-1 font-medium">Model File</label>
                                    <input
                                        type="file"
                                        accept=".fbx,.glb,.obj"
                                        onChange={(e) =>
                                            handleModelChange(i, "filePath", e.target.files[0]?.name || "")
                                        }
                                        className="w-full border border-gray-300 rounded px-3 py-2"
                                    />
                                </div>

                                {mod.subModels.map((sub, j) => (
                                    <div key={j} className="mb-2 pl-4 border-l">
                                        <label className="block mb-1 font-medium">Sub Model Name</label>
                                        <input
                                            type="text"
                                            value={sub.name}
                                            onChange={(e) => handleSubModelChange(i, j, "name", e.target.value)}
                                            className="w-full border border-gray-300 rounded px-3 py-2 mb-1"
                                        />
                                        <label className="block mb-1 font-medium">Sub Model File</label>
                                        <input
                                            type="file"
                                            accept=".fbx,.glb,.obj"
                                            onChange={(e) =>
                                                handleSubModelChange(i, j, "filePath", e.target.files[0]?.path || "")
                                            }
                                            className="w-full border border-gray-300 rounded px-3 py-2"
                                        />
                                    </div>
                                ))}
                                <button
                                    onClick={() => addSubModel(i)}
                                    className="mt-2 px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
                                >
                                    Add Sub Model
                                </button>
                            </div>
                        ))}
                        <button
                            onClick={addModel}
                            className="mb-4 px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
                        >
                            Add Model
                        </button>

                        <div className="mb-4">
                            <label className="block mb-1 font-medium">Assign To</label>
                            <select
                                value={assignedUser}
                                onChange={(e) => setAssignedUser(e.target.value)}
                                className="w-full border border-gray-300 rounded px-3 py-2"
                            >
                                <option value="">Select User</option>
                                {users.length === 0 ? (
                                    <option disabled>Loading users...</option>
                                ) : (
                                    users.map((u) => (
                                        <option key={u._id} value={u._id}>
                                            {u.username} ({u.email})
                                        </option>
                                    ))
                                )}
                            </select>
                        </div>

                        <div className="flex justify-end space-x-2">
                            <button
                                onClick={() => setShowCreateModal(false)}
                                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCreateProject}
                                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                            >
                                {editingProject ? "Update" : "Create"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Info Modal */}
            {showInfoModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start pt-20 z-50">
                    <div className="bg-white p-6 rounded-lg w-3/4 max-h-[90vh] overflow-y-auto relative">
                        <h3 className="text-lg font-semibold mb-4">Project Details</h3>
                        <p className="mb-2">
                            <strong>Project Name:</strong> {showInfoModal.name}
                        </p>
                        <p className="mb-2">
                            <strong>Assigned User:</strong>{" "}
                            {showInfoModal.assignedTo ? showInfoModal.assignedTo.username : "Unassigned"}
                        </p>

                        {/* Modules */}
                        <div className="mb-4">
                            <h4 className="font-semibold mb-2">Modules:</h4>
                            {showInfoModal.modules.map((mod, i) => (
                                <div key={i} className="mb-3 border p-2 rounded">
                                    <p>
                                        <strong>Module Name:</strong> {mod.name}
                                    </p>
                                    <p>
                                        <strong>Build Path:</strong> {mod.buildPath || "N/A"}
                                    </p>
                                    {mod.buildPath && (
                                        <button
                                            onClick={() => window.open(mod.buildPath, "_blank")}
                                            className="mt-1 px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                                        >
                                            Launch Build
                                        </button>
                                    )}
                                    {/* Models */}
                                    {showInfoModal.models?.length > 0 && (
                                        <div className="mb-4">
                                            <h4 className="font-semibold mb-2">Models:</h4>
                                            {showInfoModal.models.map((mod, i) => (
                                                <div key={i} className="mb-3 border p-2 rounded">
                                                    <p>
                                                        <strong>Model Name:</strong> {mod.name}
                                                    </p>
                                                    <p>
                                                        <strong>File:</strong> {mod.filePath || "N/A"}
                                                    </p>
                                                    {mod.filePath && (
                                                        <button
  onClick={() => window.open(`http://localhost:5000/api/projects/models/view?path=${encodeURIComponent(mod.filePath)}`, "_blank")}
  className="mt-1 px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700"
>
  View
</button>


                                                    )}
                                                    {mod.subModels.map((sub, j) => (
                                                        <div key={j} className="mb-2 pl-4 border-l">
                                                            <p>
                                                                <strong>Sub Model Name:</strong> {sub.name}
                                                            </p>
                                                            <p>
                                                                <strong>File:</strong> {sub.filePath || "N/A"}
                                                            </p>
                                                            {sub.filePath && (
                                                                <button
                                                                    onClick={() => window.open(`/models/view?path=${encodeURIComponent(sub.filePath)}`, "_blank")}
                                                                    className="mt-1 px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                                                                >
                                                                    View
                                                                </button>

                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {mod.subModules.map((sub, j) => (
                                        <div key={j} className="mb-2 pl-4 border-l">
                                            <p>
                                                <strong>Sub Module Name:</strong> {sub.name}
                                            </p>
                                            <p>
                                                <strong>Build Path:</strong> {sub.buildPath || "N/A"}
                                            </p>
                                            {sub.buildPath && (
                                                <button
                                                    onClick={() => window.open(sub.buildPath, "_blank")}
                                                    className="mt-1 px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                                                >
                                                    Launch Build
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>

                        {/* Models */}
                        {showInfoModal.models?.length > 0 && (
                            <div className="mb-4">
                                <h4 className="font-semibold mb-2">Models:</h4>
                                {showInfoModal.models.map((mod, i) => (
                                    <div key={i} className="mb-3 border p-2 rounded">
                                        <p>
                                            <strong>Model Name:</strong> {mod.name}
                                        </p>
                                        <p>
                                            <strong>File:</strong> {mod.filePath || "N/A"}
                                        </p>
                                        {mod.subModels.map((sub, j) => (
                                            <div key={j} className="mb-2 pl-4 border-l">
                                                <p>
                                                    <strong>Sub Model Name:</strong> {sub.name}
                                                </p>
                                                <p>
                                                    <strong>File:</strong> {sub.filePath || "N/A"}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        )}

                        <button
                            onClick={() => setShowInfoModal(null)}
                            className="absolute top-3 right-3 px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProjectsTab;
