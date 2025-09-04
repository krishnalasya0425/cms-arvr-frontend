

const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const path = require("path");
const fs = require("fs");
const { execFile } = require("child_process");

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  if (!app.isPackaged) {
    mainWindow.loadURL("http://localhost:5173"); // React dev server
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, "dist/index.html"));
  }
}

app.whenReady().then(() => {
  createWindow();

  // ===== Pick Unity Build Folder =====
  ipcMain.handle("pick-unity-build", async () => {
    const result = await dialog.showOpenDialog(mainWindow, {
      properties: ["openDirectory"],
    });
    if (result.canceled) return null;
    return result.filePaths[0];
  });

  // ===== Launch Unity Build (dynamic exe detection) =====
  ipcMain.handle("launch-unity-build", async (event, folderPath) => {
    if (!folderPath) return { success: false, message: "No folder path provided" };

    try {
      const exeFiles = fs.readdirSync(folderPath).filter(f => f.endsWith(".exe"));
      if (exeFiles.length === 0)
        return { success: false, message: "No .exe found in folder" };

      const exePath = path.join(folderPath, exeFiles[0]);
      execFile(exePath, (err) => {
        if (err) console.error("Error launching Unity build:", err);
      });

      return { success: true, message: `Launched: ${exeFiles[0]}` };
    } catch (err) {
      console.error(err);
      return { success: false, message: err.message };
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
