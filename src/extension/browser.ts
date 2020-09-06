// this file is loaded in the browser context

import WebXRPolyfill from "webxr-polyfill";
import XRSystem from "webxr-polyfill/src/api/XRSystem";
import WebVRDevice from "webxr-polyfill/src/devices/WebVRDevice";

import { mat4, quat, vec3 } from "gl-matrix";
import { XRSession } from "./xr-session";
import { XRWebGLLayer } from "./xr-webgl-layer";
import { SystemManager } from "./system-manager";
import { XRDisplay } from "./display";

export const systemManager = new SystemManager();

class VRFrameData {
  rightViewMatrix = mat4.create();
  leftViewMatrix = mat4.create();
  leftProjectionMatrix = mat4.create();
  rightProjectionMatrix = mat4.create();
  pose: {
    position?: vec3;
    orientation?: quat;
  } = {};
}

const cardboardDisplay = new XRDisplay(800, 480, 1);
//the display currently renders to a higher resolution then it needs to,
//either swap the whole display or make it recognize the pi profile

const customGlobal = createGlobal({
  VRFrameData,
});

customGlobal.navigator = {
  xr: new XRSystem(
    (async () => new WebVRDevice(customGlobal, cardboardDisplay))()
  ),
  getGamepads: () => [],
};

let config: any = {
  global: customGlobal,
};

const polyfill = new WebXRPolyfill(config);

Object.defineProperty(navigator, "xr", {
  value: polyfill.global.navigator.xr,
  configurable: false,
});

(window as any).XRSession = XRSession;
(window as any).XRWebGLLayer = XRWebGLLayer;

function createGlobal(partialGlobal: any): any {
  const keys = ["HTMLCanvasElement", "WebGLRenderingContext", "navigator"];
  const customGlobal = {
    ...keys.reduce(
      (prev, cur) => ({ ...prev, [cur]: window[cur as any] }),
      {} as any
    ),
    ...global,
    ...partialGlobal,
  };
  return customGlobal;
}
