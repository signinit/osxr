import React from "react";

//the user spawns in (0,0,0) and looks towards (0,0,-1)

export function App() {
  return (
    <group>
      <mesh position={[0, 0, -5]}>
        <boxBufferGeometry />
        <meshBasicMaterial color={0xff0000} />
      </mesh>
    </group>
  );
}
