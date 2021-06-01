import React from "react";
import { Canvas } from "@react-three/fiber";
import { InteractionManager, XR } from "@react-three/xr";
import ReactDOM from "react-dom";
import { Navigator } from "webxr";
import { PerspectiveCamera } from "@react-three/drei";

//workarround (see app/index.ts) - a extension can't be loaded when using loadFile
import "../extension/browser";
import { App } from "./app";

declare let navigator: Navigator;

ReactDOM.render(
  <Canvas
    vr
    onCreated={(state) => {
      Object.assign(state.gl.getContext(), {
        makeXRCompatible: () => Promise.resolve(),
      });
      navigator.xr
        .requestSession("immersive-vr", {
          optionalFeatures: ["local-floor", "bounded-floor", "hand-tracking"],
        })
        .then((session) => state.gl.xr.setSession(session as any));
    }}
  >
    <PerspectiveCamera makeDefault />
    <XR>
      <InteractionManager>
        <App />
      </InteractionManager>
    </XR>
  </Canvas>,
  document.getElementById("root")!
);
