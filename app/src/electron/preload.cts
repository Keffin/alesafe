const electron = require("electron");

electron.contextBridge.exposeInMainWorld("electron", {
  getContent: (cb: (s: unknown) => void) => {
    electron.ipcRenderer.on("content", (_, data) => {
      cb(data);
    });

    electron.ipcRenderer.send("renderer-ready");
  },
});
