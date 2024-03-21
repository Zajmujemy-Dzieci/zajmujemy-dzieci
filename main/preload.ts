import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron'
const os = require('os');

const handler = {
  send(channel: string, value: unknown) {
    ipcRenderer.send(channel, value)
  },
  on(channel: string, callback: (...args: unknown[]) => void) {
    const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
      callback(...args)
    ipcRenderer.on(channel, subscription)

    return () => {
      ipcRenderer.removeListener(channel, subscription)
    }
  },
}

// const zmienna = Object.values(os.networkInterfaces()).flat();
// console.log(zmienna);
const ipAddresses:string = Object.values(os.networkInterfaces()).flat()
.filter((iface : Object) => iface.family === 'IPv4' && !iface.internal)
.map((iface:Object) => iface.address);

const ipAddress = ipAddresses[ipAddresses.length-1]

contextBridge.exposeInMainWorld('electron',{
  netInterfaces : () => ipAddress,
  homeDir : () => os.homedir()
})

contextBridge.exposeInMainWorld('ipc', handler)

export type IpcHandler = typeof handler
