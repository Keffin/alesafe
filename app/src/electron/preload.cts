const electron = require("electron");

electron.contextBridge.exposeInMainWorld("electron", {
  getFile: (callback: (s: unknown) => void) => {
    electron.ipcRenderer.on("file", (_, data) => {
      callback(data);
    });
    electron.ipcRenderer.send("renderer-ready");
  },
  getContent: (cb: (s: unknown) => void) => {
    electron.ipcRenderer.on("content", (_, data) => {
      cb(data);
    });

    electron.ipcRenderer.send("renderer-ready");
  },
});
