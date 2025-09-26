const { app, BrowserWindow, ipcMain, dialog, BrowserView } = require("electron");
const path = require("path");
const fs = require("fs");
const { execFile } = require("child_process");

let mainWindow;
let gameView; // For WebGL builds

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

  // Resize BrowserView with window
  mainWindow.on("resize", () => {
    if (gameView) {
      const [width, height] = mainWindow.getContentSize();
      gameView.setBounds({ x: 300, y: 0, width: width - 300, height });
    }
  });
}

app.whenReady().then(() => {
  createWindow();

  // ===== Pick Unity Build Folder =====
  ipcMain.handle("pick-unity-build", async () => {
    const result = await dialog.showOpenDialog(mainWindow, {
      properties: ["openDirectory"],
    });
    return result.canceled ? null : result.filePaths[0];
  });

  // ===== Launch Unity Build (EXE or WebGL) =====
ipcMain.handle("launch-unity-build", async (event, folderPath) => {
  if (!folderPath) return { success: false, message: "No folder path provided" };

  try {
    const files = fs.readdirSync(folderPath);

    // If WebGL build exists
    if (files.includes("index.html")) {
      if (gameView) {
        mainWindow.removeBrowserView(gameView);
        gameView.destroy();
      }

      gameView = new BrowserView({
        webPreferences: { contextIsolation: true, nodeIntegration: false },
      });

      mainWindow.setBrowserView(gameView);

      const [width, height] = mainWindow.getContentSize();
      gameView.setBounds({ x: 300, y: 0, width: width - 300, height });

      await gameView.webContents.loadFile(path.join(folderPath, "index.html"));
      return { success: true, message: "WebGL build loaded inside dashboard" };
    }

    // Otherwise, look for EXE
    const exeFiles = files.filter(f => f.endsWith(".exe"));
    if (exeFiles.length === 0) {
      return { success: false, message: "No .exe or WebGL build found in folder" };
    }

    const exePath = path.join(folderPath, exeFiles[0]);
    execFile(exePath, (err) => {
      if (err) console.error("Error launching Unity build:", err);
    });

    return { success: true, message: `Launched EXE: ${exeFiles[0]}` };
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