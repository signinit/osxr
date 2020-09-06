import { XRViewport } from "./xr-session";
import { XRWebGLLayer } from "./xr-webgl-layer";
import { mat4 } from "gl-matrix";
import { XRRigidTransform } from "./xr-rigid-transform";
import { systemManager } from "./browser";

export class XRView {
  private viewport: XRViewport = {
    width: 100,
    height: 100,
    x: 0,
    y: 0,
  };

  private aspectRatio = 1;

  public projectionMatrix = new Float32Array(16);
  public transform = new XRRigidTransform();

  constructor(
    public readonly eye: "left" | "right",
    private readonly fov: number,
    private readonly nearPlane: number,
    private readonly farPlane: number
  ) {
    this.calculateProjectionMatrix();
  }

  private calculateProjectionMatrix(): void {
    const matrix = mat4.create();
    mat4.perspective(
      matrix,
      this.fov * (Math.PI / 180),
      this.aspectRatio,
      this.nearPlane,
      this.farPlane
    );
    this.projectionMatrix.set(matrix);
  }

  getViewport(layer: XRWebGLLayer): XRViewport {
    layer.session.device.getViewport(
      layer.session.sessionId,
      this.eye,
      layer,
      this.viewport
    );
    const newAspectRatio = this.viewport.width / this.viewport.height;
    if (newAspectRatio != this.aspectRatio) {
      this.aspectRatio = newAspectRatio;
      this.calculateProjectionMatrix();
    }
    return this.viewport;
  }
}
