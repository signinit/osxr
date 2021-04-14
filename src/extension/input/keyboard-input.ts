import {InputDevice} from "../input-device";
import {XRRigidTransform} from "../xr-rigid-transform";
import {quat} from "gl-matrix";

export class KeyboardInput implements InputDevice {

    private readonly headTransform = new XRRigidTransform();

    private speed = 2;

    private rotX = 0;
    private rotY = 0;
    private rotZ = 0;
    quaternion: quat = quat.create();

    private keyPressedList: Array<String>;

    constructor() {
        const _this = this;
        this.keyPressedList = [];

        window.addEventListener("keydown", function(event: KeyboardEvent){
            _this.keyPressedList.push(event.key);
        });

        window.addEventListener("keyup", function(event: KeyboardEvent){
            _this.keyPressedList = _this.keyPressedList.filter((value) => value != event.key);
        });
    }

    isKeyPressed(key: String){
        return this.keyPressedList.includes(key);
    }

    getHeadTransform(): XRRigidTransform {
        quat.fromEuler(this.quaternion, this.rotY, this.rotX, this.rotZ);
        this.headTransform.orientation = new DOMPointReadOnly(...this.quaternion);
        this.headTransform.position = new DOMPointReadOnly();

        return this.headTransform;
    }

    update(): void {
        if (this.isKeyPressed("w")){
            this.rotY += this.speed;
        }
        if (this.isKeyPressed("a")){
            this.rotX += this.speed;
        }
        if (this.isKeyPressed("s")){
            this.rotY -= this.speed;
        }
        if (this.isKeyPressed("d")){
            this.rotX -= this.speed;
        }
        if (this.isKeyPressed("q")){
            this.rotZ += this.speed;
        }
        if (this.isKeyPressed("e")){
            this.rotZ -= this.speed;
        }

        if (this.isKeyPressed("p")){
            this.rotZ = 0;
        }
    }
}