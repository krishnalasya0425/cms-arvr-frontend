import { useState } from "react";

export default function VRView({ onBack, vrBuildPath }) {
  const [vrReady, setVrReady] = useState(false);

  const checkVRConnection = () => {
    // TODO: Replace with real USB/Wi-Fi Oculus connection check
    const connected = true;
    if (connected) setVrReady(true);
    else alert("Oculus not detected. Connect via USB or same Wi-Fi.");
  };

  const launchVR = () => {
    if (!vrBuildPath) return alert("No VR build assigned!");
    window.electronAPI.launchUnityBuild(vrBuildPath); // same buildPath as Launch Build
  };

  return (
    <div className="flex-grow w-full flex flex-col items-center justify-center gap-6">
      <div className="bg-green-100 rounded-3xl shadow-lg p-8 max-w-lg w-full flex flex-col items-start">
        <h2 className="text-2xl font-bold text-green-900 mb-4">VR Requirements</h2>
        <ul className="list-disc ml-6 text-green-800 space-y-2">
          <li>Oculus Meta Quest 3 must be connected via USB or same Wi-Fi.</li>
          <li>Ensure your system meets minimum VR requirements.</li>
          <li>Enable developer mode in Oculus if required.</li>
          <li>Do not disconnect the device while running VR build.</li>
          <li>Use a compatible Unity build for VR viewing.</li>
        </ul>

        {!vrReady ? (
          <button
            className="mt-6 px-6 py-2 bg-green-200 rounded hover:bg-green-300"
            onClick={checkVRConnection}
          >
            Check Connection
          </button>
        ) : (
          <button
            className="mt-6 px-6 py-2 bg-green-700 text-white rounded hover:bg-green-800"
            onClick={launchVR}
          >
            Launch VR Build
          </button>
        )}

        <button
          className="mt-4 px-6 py-2 bg-green-200 rounded hover:bg-green-300"
          onClick={onBack}
        >
          ← Back
        </button>
      </div>
    </div>
  );
}

