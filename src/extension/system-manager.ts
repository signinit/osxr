import { XRRigidTransform } from "./xr-rigid-transform";
import { quat } from "gl-matrix";

export class SystemManager {
  public readonly headTransform = new XRRigidTransform();

  rot = 0;
  quaternion: quat = quat.create();

  public update(): void {
    /*this.rot += 1;
    quat.fromEuler(this.quaternion, 0, this.rot, 0);
    this.headTransform.orientation = new DOMPointReadOnly(...this.quaternion);*/
  }
}
