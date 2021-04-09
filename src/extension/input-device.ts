import { XRRigidTransform } from "./xr-rigid-transform";

export interface InputDevice {

  update(): void;
  getHeadTransform(): XRRigidTransform;
}
