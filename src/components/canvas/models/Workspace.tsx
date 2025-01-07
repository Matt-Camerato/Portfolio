import { useGLTF } from "@react-three/drei";
import { Mesh } from "three";
import { useEffect } from "react";
import { createToonMaterial } from "../../../utils/materials";

export function Workspace() {
  const { scene } = useGLTF("/models/workspace.glb");

  useEffect(() => {
    scene.traverse((child) => {
      if (child instanceof Mesh) {
        if (!child.name.includes("ceiling") && !child.name.includes("wall")) {
          child.receiveShadow = true;
        }

        child.castShadow = true;

        const baseColor =
          "#" + child.material.color?.getHexString() || "#ffffff";

        child.material = createToonMaterial(baseColor);
      }
    });
  }, [scene]);

  return <primitive name="workspace" object={scene} />;
}
