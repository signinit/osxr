import { ipcMain, IpcMainEvent, ipcRenderer } from "electron";
import type { BrowserWindow } from "electron/main";
import { fromEvent, merge, Observable, OperatorFunction, Subject, Subscription, throwError } from "rxjs";
import { filter, finalize, map, mergeMap, switchMap, takeUntil, tap } from "rxjs/operators";
import { v4 as uuid } from "uuid";

declare global {
  const rendererWindow: BrowserWindow;
}

export class MessageType<T extends Array<any>> {
  constructor(private name: string) {}

  send(...params: T) {
    (global.process.type === "renderer"
      ? ipcRenderer
      : rendererWindow.webContents
    ).send(this.name, ...params);
  }

  receive(): Observable<T> {
    return fromEvent<[IpcMainEvent, ...T]>(
      global.process.type === "renderer" ? ipcRenderer : ipcMain,
      this.name
    ).pipe(map(([evt, ...params]) => params));
  }
}

export class RequestType<RequestParams extends Array<any>, Response> {
  private requestMessageType = new MessageType<[string, ...RequestParams]>(
    `${this.name}_request`
  );
  private unsubscribeMessageType = new MessageType<[string]>(
    `${this.name}_unsubscrube`
  );
  private nextMessageType = new MessageType<[string, Response]>(
    `${this.name}_next`
  );
  private errorMessageType = new MessageType<[string, any]>(
    `${this.name}_error`
  );
  private completeMessageType = new MessageType<[string]>(
    `${this.name}_complete`
  );

  constructor(private name: string) {}

  public registerRequestHandler(
    handler: (...params: RequestParams) => Observable<Response>
  ): Subscription {
    return this.requestMessageType
      .receive()
      .pipe(
        mergeMap(([id, ...params]) =>
          handler(...params).pipe(
            tap(
              (response) => this.nextMessageType.send(id, response),
              (error) => this.errorMessageType.send(id, error),
              () => this.completeMessageType.send(id)
            ),
            takeUntil(this.unsubscribeMessageType.receive().pipe(
              filter(([_id]) => id === _id)
            ))
          )
        )
      )
      .subscribe();
  }

  public request(...params: RequestParams): Observable<Response> {
    const id = uuid();
    this.requestMessageType.send(id, ...params);
    return new Observable(subscriber => {
      let isActive = true
      const subscription = merge(
        this.nextMessageType.receive().pipe(
          filter(([_id]) => id === _id),
          map(([, response]) => response),
          tap(subscriber.next.bind(subscriber))
        ),
        this.errorMessageType.receive().pipe(
          filter(([_id]) => id === _id),
          map(([, response]) => response),
          tap(subscriber.error.bind(subscriber))
        ),
        this.completeMessageType.receive().pipe(
          filter(([_id]) => id === _id),
          tap(subscriber.complete.bind(subscriber))
        )
      ).pipe(finalize(() => isActive = false)).subscribe()
      return () => {
        subscription.unsubscribe()
        if(isActive) {
          this.unsubscribeMessageType.send(id)
        }
      }
    })
  }

  public requestOne(...params: RequestParams): Promise<Response> {
    return this.request(...params).toPromise();
  }
}

export * from "./transformation-interface";
export * from "./fs-interface";
