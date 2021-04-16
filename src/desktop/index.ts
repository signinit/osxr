import { FsInterface } from "../node-extension-interface";

window.addEventListener("click", () =>
  FsInterface.stat("/").then(console.log)
);
