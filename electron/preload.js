
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  pickUnityBuild: () => ipcRenderer.invoke("pick-unity-build"),
  launchUnityBuild: (folderPath) => ipcRenderer.invoke("launch-unity-build", folderPath),
});

