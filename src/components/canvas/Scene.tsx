import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { CameraProvider } from "../context/CameraContext";
import { FocusProvider } from "../context/FocusContext";
import { SceneContent } from "./SceneContent";

export function Scene() {
  return (
    <div
      style={{
        width: "100vw",
        height: "calc(100vh - 64px)",
        marginTop: "64px",
      }}
    >
      <Canvas camera={{ fov: 75 }} shadows>
        <CameraProvider>
          <FocusProvider>
            <SceneContent />
          </FocusProvider>
        </CameraProvider>
      </Canvas>
    </div>
  );
}
