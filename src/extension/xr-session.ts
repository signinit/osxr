import { XRWebGLLayer } from "./xr-webgl-layer";
import { XRView } from "./xr-view";
import { EventTarget } from "event-target-shim";
import { mat4 } from "gl-matrix";
import {InputDevice} from "./input-device";
import {KeyboardInput} from "./input/keyboard-input";

export type XRRenderStateInit = {
  baseLayer?: XRWebGLLayer;
  depthFar?: number;
  depthNear?: number;
  inlineVerticalFieldOfView?: null;
};

export class XRSession extends EventTarget {
  renderState: XRRenderState = {
    baseLayer: undefined,
    depthFar: 100,
    depthNear: 0.1,
    inlineVerticalFieldOfView: null,
  };

  inputSources: Array<any> = []; //TODO

  visibilityState = "visible";

  intervalRef: NodeJS.Timeout;
  private running = true;

  private frameCallbacks: Array<
    (time: DOMHighResTimeStamp, xrFrame: XRFrame) => void
  > = [];

  private inputDevice = new KeyboardInput();
  private frame = new XRFrame(this);

  constructor(
    public readonly device: any,
    public readonly mode: "inline" | "immersive-vr" | "immersive-ar",
    public readonly sessionId: number
  ) {
    super();
    //start device frame loop
    this.intervalRef = setInterval(() => {
      if (this.renderState.baseLayer == null) {
        return;
      }
      this.device.onFrameStart(this.sessionId, this.renderState);
      this.inputDevice.update();
      this.frame.update(0.05); //TODO get eye offset from display
      const callbacks = this.frameCallbacks;

      this.frameCallbacks = [];
      if (callbacks.length > 0) {
        //just execute the last one
        try {
          callbacks[callbacks.length - 1](0, this.frame); //TODO timing
        } catch (error) {
          console.error(error);
        }
      }
      this.device.onFrameEnd(this.sessionId);
    }, 30);
  }

  updateRenderState(xrRenderStateInit: XRRenderStateInit): void {
    Object.assign(this.renderState, xrRenderStateInit);
    if (xrRenderStateInit.baseLayer != null) {
      this.device.onBaseLayerSet(this.sessionId, this.renderState.baseLayer);
    }
  }

  async end(): Promise<void> {
    this.running = false;
    this.dispatchEvent(new XRSessionEvent("end", { session: this }));
    clearInterval(this.intervalRef);
    return this.device.endSession(this.sessionId);
  }

  requestReferenceSpace(type: string): Promise<XRReferenceSpace> {
    return Promise.resolve({});
  }

  requestAnimationFrame(
    callback: (time: DOMHighResTimeStamp, frame: XRFrame) => void
  ): void {
    if (!this.running) {
      return;
    }
    this.frameCallbacks.push(callback);
  }

  cancelAnimationFrame(): void {
    this.device.cancelAnimationFrame();
    this.frameCallbacks = [];
  }

  getInputDevice(): InputDevice {
    return this.inputDevice;
  }
}

export class XRSessionEvent {
  public session: XRSession;

  constructor(public type: string, { session }: XRSessionEventInit) {
    this.session = session;
  }
}

export type XRSessionEventInit = {
  session: XRSession;
};

export type XRViewport = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type XRRenderState = {
  baseLayer?: XRWebGLLayer;
  depthFar: number;
  depthNear: number;
  inlineVerticalFieldOfView: number | null;
};

export type XRReferenceSpace = {};

export type XRViewerPose = {
  views: Array<XRView>;
};

export class XRFrame {
  private leftEye = new XRView("left", 90, 0.1, 100);
  private rightEye = new XRView("right", 90, 0.1, 100);

  constructor(public session: XRSession) {}

  update(eyeOffset: number): void {
    let headMatrix = this.session.getInputDevice().getHeadTransform().matrix;

    mat4.copy(this.leftEye.transform.matrix, headMatrix);
    mat4.translate(this.leftEye.transform.matrix, headMatrix, [
      -eyeOffset,
      0,
      0,
    ]);
    this.leftEye.transform.fromMatrix(this.leftEye.transform.matrix);

    mat4.copy(this.rightEye.transform.matrix, headMatrix);
    mat4.translate(this.rightEye.transform.matrix, headMatrix, [
      eyeOffset,
      0,
      0,
    ]);
    this.rightEye.transform.fromMatrix(this.rightEye.transform.matrix);
  }

  getViewerPose(referenceSpace: XRReferenceSpace): XRViewerPose {
    return {
      views: [this.leftEye, this.rightEye],
    };
  }
  getPose(): any {}
}
