const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronInfo', {
  versions: () => ipcRenderer.invoke('app:versions'),
});
