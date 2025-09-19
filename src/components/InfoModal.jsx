import React from "react";

export default function InfoModal({ project, onClose, onLaunchBuild }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-lg p-6 w-[600px] max-h-[80vh] overflow-y-auto relative">
        <button className="absolute top-3 right-3 text-gray-500 hover:text-gray-800" onClick={onClose}>
          ✕
        </button>

        <h3 className="text-2xl font-bold mb-4 text-center text-blue-700">
          Project Details – {project.name}
        </h3>

        <p className="mb-4 text-gray-700">
          <strong>Assigned To:</strong>{" "}
          {project.assignedTo
            ? `${project.assignedTo.username} (${project.assignedTo.email})`
            : "Unassigned"}
        </p>

        <div className="space-y-4">
          {project.modules?.map((mod, mi) => (
            <div key={mi} className="border border-gray-300 rounded-lg p-3 bg-gray-50">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-semibold text-blue-600">{mod.name}</h4>
                {mod.buildPath && (
                  <button
                    className="px-2 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                    onClick={() => onLaunchBuild(mod.buildPath)}
                  >
                    Launch Build
                  </button>
                )}
              </div>

              {mod.subModules?.length > 0 ? (
                <ul className="ml-4 list-disc space-y-1">
                  {mod.subModules.map((sub, si) => (
                    <li key={si} className="flex justify-between items-center">
                      <span>{sub.name}</span>
                      {sub.buildPath && (
                        <button
                          className="px-2 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600"
                          onClick={() => onLaunchBuild(sub.buildPath)}
                        >
                          Launch
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="ml-4 text-gray-500 text-sm">No submodules</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
