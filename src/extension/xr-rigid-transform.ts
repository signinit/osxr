import { mat4, quat, vec3 } from "gl-matrix";

export class XRRigidTransform {
  private _orientation: DOMPointReadOnly;
  get orientation(): DOMPointReadOnly {
    return this._orientation;
  }

  private _position: DOMPointReadOnly;
  get position(): DOMPointReadOnly {
    return this._position;
  }

  private matrixDirty = true;
  private _matrix = new Float32Array(16);
  get matrix(): Float32Array {
    if (this.matrixDirty) {
      this.calculateMatrix(this._matrix, this._position, this._orientation);
      this.matrixDirty = false;
    }
    return this._matrix;
  }

  private inverseDirty = true;
  private _inverse: XRRigidTransform;
  get inverse(): XRRigidTransform {
    if (this.inverseDirty) {
      this._inverse.updateAsInverse(this._position, this._orientation);
      this.inverseDirty = false;
    }
    return this._inverse;
  }

  constructor(
    position?: DOMPointReadOnly,
    orientation?: DOMPointReadOnly,
    matrix?: Float32Array,
    inverse?: XRRigidTransform
  ) {
    this._position = position ?? new DOMPointReadOnly(0, 0, 0, 1);
    this._orientation = orientation ?? new DOMPointReadOnly(0, 0, 0, 1);
    if (matrix != null) {
      this._matrix = matrix;
      this.matrixDirty = false;
    }
    if (inverse != null) {
      this._inverse = inverse;
      this.inverseDirty = false;
    } else {
      this._inverse = new XRRigidTransform(
        undefined,
        undefined,
        undefined,
        this
      );
    }
  }

  set position(position: DOMPointReadOnly) {
    this._position = position;
    this.inverseDirty = true;
    this.matrixDirty = true;
  }

  set orientation(orientation: DOMPointReadOnly) {
    this._orientation = orientation;
    this.inverseDirty = true;
    this.matrixDirty = true;
  }

  private updateAsInverse(
    position: DOMPointReadOnly,
    orientation: DOMPointReadOnly
  ): void {
    this._position = new DOMPointReadOnly(
      -position.x,
      -position.y,
      -position.z,
      1
    );
    let invertQuat: quat = [0, 0, 0, 1];
    quat.invert(invertQuat, [
      orientation.x,
      orientation.y,
      orientation.z,
      orientation.w,
    ]);
    this._orientation = new DOMPointReadOnly(...invertQuat);
    this.calculateMatrix(this._matrix, this._position, this._orientation);
  }

  private calculateMatrix(
    out: Float32Array,
    position: DOMPointReadOnly,
    orientation: DOMPointReadOnly
  ): void {
    mat4.fromRotationTranslation(
      out,
      [orientation.x, orientation.y, orientation.z, orientation.w],
      [position.x, position.y, position.z]
    );
  }

  public fromMatrix(matrix: Float32Array): void {
    let orientationArray: quat = [0, 0, 0, 1];
    mat4.getRotation(orientationArray, matrix);
    let positionArray: vec3 = [0, 0, 0];
    mat4.getTranslation(positionArray, matrix);
    this._orientation = new DOMPointReadOnly(...orientationArray);
    this._position = new DOMPointReadOnly(...positionArray);
    this._matrix = matrix;
    this.matrixDirty = false;
    this.inverseDirty = true;
  }
}
