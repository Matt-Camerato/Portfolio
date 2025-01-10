import { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Vector3 } from "three";
import { useFocus } from "../context/FocusContext";

export function CameraControls() {
  const { camera } = useThree();
  const { setCamera, cameraEnabled } = useFocus();

  useEffect(() => {
    setCamera(camera);
  }, [camera]);

  return (
    <OrbitControls
      enabled={cameraEnabled}
      enableZoom={true}
      enablePan={false}
      rotateSpeed={0.1}
      minPolarAngle={Math.PI / 2.0}
      maxPolarAngle={Math.PI / 1.7}
      minAzimuthAngle={Math.PI / 9}
      maxAzimuthAngle={Math.PI / 3}
      minDistance={1.8}
      maxDistance={1.9}
      target={new Vector3(-2, 2, -1.5)}
    />
  );
}
