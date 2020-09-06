declare module "webxr-polyfill" {
  export default class WebXRPolyfill {
    constructor(config: any);
    global: any;
  }
}

declare module "webxr-polyfill/src/api/XRSystem" {
  export default class XRSystem {
    constructor(devicePromise: Promise<any>);
  }
}

declare module "webxr-polyfill/src/devices/CardboardXRDevice" {
  export default class CardboardXRDevice {
    constructor(global: any, display: any);
  }
}

declare module "webxr-polyfill/src/devices/WebVRDevice" {
  export default class WebVRDevice {
    constructor(global: any, display: any);
  }
}

declare module "cardboard-vr-display" {
  export default class CardboardVRDisplay {
    constructor(config: CardboardVRDisplayConfig);
  }

  export type EyeParameter = {
    renderWidth: number;
    renderHeight: number;
  };

  export type CardboardVRDisplayConfig = {};
}
