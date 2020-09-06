import { XRViewport, XRSession } from "./xr-session";
import { XRView } from "./xr-view";

export class XRWebGLLayer {
  antialias = false;
  framebuffer?: WebGLFramebuffer;
  framebufferWidth?: number;
  framebufferHeight?: number;
  ignoreDepthValues = false;

  constructor(
    public readonly session: XRSession,
    public readonly context: WebGL2RenderingContext
  ) {
    this.framebuffer = context.getParameter(context.FRAMEBUFFER_BINDING);
    this.framebufferWidth = context.canvas.width * window.devicePixelRatio;
    this.framebufferHeight = context.canvas.height * window.devicePixelRatio;
  }

  getViewport(view: XRView): XRViewport {
    return view.getViewport(this);
  }
}
