import { useEffect } from "react";
import { Mesh } from "three";
import { useGLTF } from "@react-three/drei";
import { createToonMaterial } from "../../../utils/materials";

export function Controller() {
  const { scene } = useGLTF("/models/controller.glb");

  useEffect(() => {
    scene.traverse((child) => {
      if (child instanceof Mesh) {
        child.receiveShadow = true;
        child.castShadow = true;

        const baseColor =
          "#" + child.material.color?.getHexString() || "#ffffff";

        child.material = createToonMaterial(baseColor);
      }
    });
  }, [scene]);

  return <primitive object={scene} />;
}
