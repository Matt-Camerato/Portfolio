import { createContext, useContext, useState, ReactNode } from "react";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

interface CameraContextType {
  enabled: boolean;
  setEnabled: (enabled: boolean) => void;
}

const CameraContext = createContext<CameraContextType | undefined>(undefined);

export function CameraProvider({ children }: { children: ReactNode }) {
  const [enabled, setEnabled] = useState(true);

  return (
    <CameraContext.Provider value={{ enabled, setEnabled }}>
      {children}
      <OrbitControls
        enabled={enabled}
        enableZoom={true}
        enablePan={false}
        rotateSpeed={0.1}
        minPolarAngle={Math.PI / 2.0}
        maxPolarAngle={Math.PI / 1.7}
        minAzimuthAngle={Math.PI / 9}
        maxAzimuthAngle={Math.PI / 3}
        minDistance={1.8}
        maxDistance={1.9}
        target={new THREE.Vector3(-2, 2, -1.5)}
      />
    </CameraContext.Provider>
  );
}

export function useCamera() {
  const context = useContext(CameraContext);
  if (!context) {
    throw new Error("useCamera must be used within a CameraProvider");
  }
  return context;
}
