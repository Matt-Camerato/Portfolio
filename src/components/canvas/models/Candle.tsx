import { useEffect } from "react";
import { useGLTF } from "@react-three/drei";
import { Mesh } from "three";
import {
  createToonMaterial,
  createTransparentMaterial,
} from "../../../utils/materials";

export function Candle() {
  const { scene } = useGLTF("/models/candle.glb");

  useEffect(() => {
    scene.traverse((child) => {
      if (child instanceof Mesh) {
        child.receiveShadow = true;
        child.castShadow = true;

        const baseColor =
          "#" + child.material.color?.getHexString() || "#ffffff";

        if (child.material.name === "transparent") {
          child.material = createTransparentMaterial(baseColor, 0.6);
        } else {
          child.material = createToonMaterial(baseColor);
        }
      }
    });
  }, [scene]);

  return <primitive object={scene} />;
}
