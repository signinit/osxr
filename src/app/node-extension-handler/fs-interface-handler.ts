import { promises } from "fs";
const { appendFile, mkdir, readFile, stat, unlink, writeFile } = promises;
import { from } from "rxjs";
import {
  fsAppendFileRequestType,
  fsMkdirRequestType,
  fsReadFileRequestType,
  fsStatRequestType,
  fsUnlinkRequestType,
  fsWriteFileRequestType,
} from "../../node-extension-interface";

function buildFsHandler<Params extends Array<any>, Response>(
  fn: (...params: Params) => Promise<Response>
) {
  return (...params: Params) => from(fn(...params));
}

export function registerFsInterfaceHandler() {
  fsStatRequestType.registerRequestHandler(buildFsHandler(stat));
  fsReadFileRequestType.registerRequestHandler(buildFsHandler(readFile));
  fsWriteFileRequestType.registerRequestHandler(buildFsHandler(writeFile));
  fsAppendFileRequestType.registerRequestHandler(buildFsHandler(appendFile));
  fsMkdirRequestType.registerRequestHandler(buildFsHandler(mkdir));
  fsUnlinkRequestType.registerRequestHandler(buildFsHandler(unlink));
}
