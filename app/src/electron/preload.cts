const electron = require("electron");

electron.contextBridge.exposeInMainWorld("electron", {
  getContent: (cb: (s: unknown) => void) => {
    electron.ipcRenderer.on("content", (_, data) => {
      cb(data);
    });

    electron.ipcRenderer.send("renderer-ready");
  },
  getPwCalculationResult: (cb: (s: unknown) => void) => {
    electron.ipcRenderer.on("hashResult", (_, res) => {
      cb(res);
    });
  },
  getPwFromClient: (input: unknown, sec: unknown) =>
    electron.ipcRenderer.invoke("hashResult", { input, sec }),

  getDec: (input: unknown, sec: unknown, cred: unknown) =>
    electron.ipcRenderer.invoke("parsePassword", { input, sec, cred }),

  getDecryptResult: (cb: (s: unknown) => void) => {
    electron.ipcRenderer.on("parsePassword", (_, res) => {
      cb(res);
    });
  },
});
