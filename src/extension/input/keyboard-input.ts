import { Euler, Quaternion, Vector3 } from "three";
import { InputDevice } from "../input-device";
import { XRRigidTransform } from "../xr-rigid-transform";

//TODO: move this to the electron env

export class KeyboardInput implements InputDevice {
  private readonly headTransform = new XRRigidTransform();

  private moveDirection = new Vector3();
  private euler = new Euler(0,0,0, "YXZ");

  private rotationSpeed = 0.06;
  private moveSpeed = 0.1;

  quaternion = new Quaternion();

  private keyPressedList: Array<String>;

  constructor() {
    const _this = this;
    this.keyPressedList = [];

    window.addEventListener("keydown", function (event: KeyboardEvent) {
      _this.keyPressedList.push(event.key);
    });

    window.addEventListener("keyup", function (event: KeyboardEvent) {
      _this.keyPressedList = _this.keyPressedList.filter(
        (value) => value != event.key
      );
    });
  }

  isKeyPressed(key: String) {
    return this.keyPressedList.includes(key);
  }

  getHeadTransform(): XRRigidTransform {
    return this.headTransform;
  }

  update(): void {
    //TODO: use deltaTime
    if (this.isKeyPressed("ArrowUp")) {
      this.euler.x += this.rotationSpeed;
    }
    if (this.isKeyPressed("ArrowLeft")) {
      this.euler.y += this.rotationSpeed;
    }
    if (this.isKeyPressed("ArrowDown")) {
      this.euler.x -= this.rotationSpeed;
    }
    if (this.isKeyPressed("ArrowRight")) {
      this.euler.y -= this.rotationSpeed;
    }
    this.moveDirection.set(0, 0, 0);
    if (this.isKeyPressed("w")) {
      this.moveDirection.z -= this.moveSpeed;
    }
    if (this.isKeyPressed("a")) {
      this.moveDirection.x -= this.moveSpeed;
    }
    if (this.isKeyPressed("s")) {
      this.moveDirection.z += this.moveSpeed;
    }
    if (this.isKeyPressed("d")) {
      this.moveDirection.x += this.moveSpeed;
    }
    if (this.isKeyPressed("q")) {
      this.moveDirection.y -= this.moveSpeed;
    }
    if (this.isKeyPressed("e")) {
      this.moveDirection.y += this.moveSpeed;
    }

    this.quaternion.setFromEuler(this.euler);
    this.headTransform.orientation = new DOMPointReadOnly(
      this.quaternion.x,
      this.quaternion.y,
      this.quaternion.z,
      this.quaternion.w
    );

    this.moveDirection.applyQuaternion(this.quaternion);

    this.headTransform.position = new DOMPointReadOnly(
      this.headTransform.position.x + this.moveDirection.x,
      this.headTransform.position.y + this.moveDirection.y,
      this.headTransform.position.z + this.moveDirection.z
    );

    if (this.isKeyPressed("r")) {
      //TODO reset
    }
  }
}
