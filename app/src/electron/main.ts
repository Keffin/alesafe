import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import { getAlesafeFile, getContent, isDev } from "./util.js";
import { getPreloadPath } from "./pathResolver.js";

app.on("ready", async () => {
  const mainWindow = new BrowserWindow({
    webPreferences: {
      preload: getPreloadPath(),
    },
  });

  if (isDev()) {
    mainWindow.webContents.openDevTools();
    mainWindow.loadURL("http://localhost:5123");
  } else {
    mainWindow.loadFile(path.join(app.getAppPath(), "/dist-react/index.html"));
  }

  ipcMain.on("renderer-ready", async () => {
    const x = await getAlesafeFile(mainWindow);
    await getContent(x, mainWindow);
  });
});
