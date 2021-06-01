import { RequestType } from "."
import type { stat, readFile, writeFile, appendFile, mkdir, unlink } from "fs/promises"

type GetParams<Fn extends (...params: Array<any>) => any> = Fn extends ((...params: infer Params) => any) ? Params : never
type GetResponse<Fn extends (...params: Array<any>) => any> = Fn extends ((...params: Array<any>) => Promise<infer Response>) ? Response : never

export const fsStatRequestType = new RequestType<GetParams<typeof stat>, GetResponse<typeof stat>>("fs-stat")
export const fsReadFileRequestType = new RequestType<GetParams<typeof readFile>, GetResponse<typeof readFile>>("fs-read-file")
export const fsWriteFileRequestType = new RequestType<GetParams<typeof writeFile>, GetResponse<typeof writeFile>>("fs-write-file")
export const fsAppendFileRequestType = new RequestType<GetParams<typeof appendFile>, GetResponse<typeof appendFile>>("fs-append-file")
export const fsMkdirRequestType = new RequestType<GetParams<typeof mkdir>, GetResponse<typeof mkdir>>("fs-mkdir")
export const fsUnlinkRequestType = new RequestType<GetParams<typeof unlink>, GetResponse<typeof unlink>>("fs-unlink")

export const FsInterface = {

    stat: fsStatRequestType.requestOne.bind(fsStatRequestType),
    readFile: fsReadFileRequestType.requestOne.bind(fsReadFileRequestType),
    writeFile: fsWriteFileRequestType.requestOne.bind(fsWriteFileRequestType),
    appendFile: fsAppendFileRequestType.requestOne.bind(fsAppendFileRequestType),
    mkdir: fsMkdirRequestType.requestOne.bind(fsMkdirRequestType),
    unlink: fsUnlinkRequestType.requestOne.bind(fsUnlinkRequestType)

}