import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import { getAlesafeFile, getContent, isDev } from "./util.js";
import { getPreloadPath } from "./pathResolver.js";
import { readPassword, validatePassword } from "./validation.js";

app.on("ready", async () => {
  const mainWindow = new BrowserWindow({
    webPreferences: {
      preload: getPreloadPath(),
    },
    width: 1200,
    height: 1000,
  });

  if (isDev()) {
    mainWindow.webContents.openDevTools();
    mainWindow.loadURL("http://localhost:5123");
  } else {
    mainWindow.loadFile(path.join(app.getAppPath(), "/dist-react/index.html"));
  }

  const filePath = await getAlesafeFile();
  ipcMain.on("renderer-ready", async () => {
    await getContent(filePath, mainWindow);
  });

  ipcMain.handle("hashResult", async (_, { input, sec }) => {
    return await validatePassword(input, sec, mainWindow);
  });

  ipcMain.handle("parsePassword", async (_, { input, sec, cred }) => {
    return await readPassword(input, sec, cred, mainWindow);
  });
});
