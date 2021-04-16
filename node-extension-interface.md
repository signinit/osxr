# Node Extension Interface

Interface definition for communicating between osxr's node application and the browser extension for supporting hardware interactions in the browser context.

## Message Passing

As both js applications live in different context their only way of communicating is by message passing. These messages can only contain serializeable objects.

The communication is done using the the objects `ipcMain` and `ipcRenderer` provided by electron (https://www.electronjs.org/docs/api/ipc-main).

Under `src/node-extension-interface` will be all message types that the main process and the renderer communicate with.