import { BrowserWindow } from "electron/main"

export function setupNodeExtensionHandler(view: BrowserWindow) {
    (global as any).rendererWindow = view
}

export * from "./fs-interface-handler"