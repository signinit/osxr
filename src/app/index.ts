import { app, BrowserWindow, session } from "electron";
import { resolve } from "path";
import { registerFsInterfaceHandler, setupNodeExtensionHandler } from "./node-extension-handler";

app.commandLine.appendSwitch("ignore-gpu-blacklist");

const extensionFolderPath =
  process.env.NODE_ENV === "dev"
    ? resolve(__dirname, "../extension")
    : resolve(__dirname, "../../../dist/extension"); //this is directly under resources cause it is listed under "extraResources"

const desktopFolderPath =
  process.env.NODE_ENV === "dev"
  ? resolve(__dirname, "../desktop")
  : resolve(__dirname, "../../../dist/desktop"); //this is directly under resources cause it is listed under "extraResources"

async function createWindow() {
  const win = new BrowserWindow({
    resizable: false,
    x: 0,
    y: 0,
    width: 800,
    height: 480,
    frame: false,
    webPreferences: {
      webgl: true,
      experimentalFeatures: true,
      nodeIntegration: true,
    },
  });
  setupNodeExtensionHandler(win)
  
  registerFsInterfaceHandler()

  win.webContents.openDevTools()

  await session.defaultSession.loadExtension(extensionFolderPath);

  /*win.loadURL(
    "https://immersive-web.github.io/webxr-samples/immersive-vr-session.html"
    //"chrome://gpu/"
  );*/
  win.loadFile(resolve(desktopFolderPath, "index.html"));
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Einige APIs können nur nach dem Auftreten dieses Events genutzt werden.
app.whenReady().then(createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow().catch((error) => console.error(error));
  }
});
