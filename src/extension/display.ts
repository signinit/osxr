import { XRFrame } from "./xr-session";

type XRDisplayState =
  | {
      isPresenting: false;
    }
  | {
      isPresenting: true;
      canvas: HTMLCanvasElement;
    };

export class XRDisplay {
  //these are just for now so we dont get an error from WebVRDevice
  depthNear: number = 0;
  depthFar: number = 0;

  capabilities: {
    hasExternalDisplay: boolean;
  } = {
    hasExternalDisplay: false,
  };

  stageParameters: {
    sizeX: number;
    sizeY: number;
  } = {
    sizeX: 1,
    sizeY: 1,
  };

  sittingToStandingTransform: null = null;

  state: XRDisplayState = {
    isPresenting: false,
  };

  get isPresenting(): boolean {
    return this.state.isPresenting;
  }

  constructor(
    private width: number,
    private height: number,
    private eyeOffset: number
  ) {}

  getEyeParameters(
    eye: "left" | "right"
  ): { renderWidth: number; renderHeight: number } {
    return {
      renderWidth: this.width / 2,
      renderHeight: this.height,
    };
  }

  async requestPresent(
    presentationSources: Array<{ source: HTMLCanvasElement; attributes: any }>
  ): Promise<void> {
    if (presentationSources.length === 1) {
      const canvas = presentationSources[0].source;
      this.state = {
        canvas,
        isPresenting: true,
      };
    }
  }

  requestAnimationFrame(
    callback: (time: DOMHighResTimeStamp, xrFrame: XRFrame) => void
  ): void {
    throw new Error("no implemented");
  }

  getFrameData(frame: VRFrameData): void {}

  submitFrame(): void {
    if (this.state.isPresenting) {
      //this should be placed in request present, WebVRDevice will change the canvas style after
      this.state.canvas.setAttribute(
        "style",
        [
          `width: ${this.width}px`,
          `height: ${this.height}px`,
          `position: absolute`,
          `left: 0`,
          `right: 0`,
          `z-index: 999999`,
        ].join(";")
      );
    }
    //execute everything here right before the frame will be rendered
  }

  cancelAnimationFrame(handle: any): void {
    throw new Error("no implemented");
  }

  async exitPresent(): Promise<void> {
    if (this.state.isPresenting) {
      this.state.canvas.parentElement?.removeChild(this.state.canvas);
    }
    this.state = {
      isPresenting: false,
    };
  }
}
