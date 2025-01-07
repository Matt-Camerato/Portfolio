import { Outline, SMAA } from "@react-three/postprocessing";
import { CustomOutline } from "../../effects/CustomOutline";
import { useThree } from "@react-three/fiber";
import { Object3D, Mesh } from "three";
import { useEffect, useState } from "react";

export const PostProcessing = () => {
  const { scene } = useThree();
  const [selectedObjects, setSelectedObjects] = useState<Object3D[]>([]);

  useEffect(() => {
    scene.traverse((child) => {
      if (child instanceof Mesh) {
        if (
          (child.name !== "" || child.parent?.name !== "") &&
          child.material.name !== "transparent"
        ) {
          setSelectedObjects((prev) => [...prev, child]);
        }
      }
    });
  }, [scene]);

  return (
    <>
      <CustomOutline
        selectedObjects={selectedObjects}
        outlineColor={"black"}
        width={window.innerWidth}
        height={window.innerHeight}
      />

      <SMAA />

      <Outline
        edgeStrength={15}
        visibleEdgeColor={0x808080}
        hiddenEdgeColor={0x808080}
        width={2000}
        pulseSpeed={0.5}
      />
    </>
  );
};
