import { useEffect } from "react";
import { Mesh } from "three";
import { useGLTF } from "@react-three/drei";
import { Select } from "@react-three/postprocessing";
import { useInteraction } from "../../../hooks/useInteraction";
import { useFocus } from "../../context/FocusContext";

export function GithubFrame() {
  const { scene } = useGLTF("/models/githubFrame.glb");
  const { isHovered, pulseIntensity, interactionHandlers } = useInteraction();
  const { isFocused } = useFocus();

  useEffect(() => {
    scene.traverse((child) => {
      if (child instanceof Mesh) {
        child.receiveShadow = true;
        child.castShadow = true;
      }
    });
  }, [scene]);

  const handleClick = () => {
    window.open("https://github.com/Matt-Camerato", "_blank");
  };

  return (
    <Select enabled={isHovered || pulseIntensity > 0}>
      <primitive
        object={scene}
        {...interactionHandlers}
        {...(!isFocused && { onClick: handleClick })}
      />
    </Select>
  );
}
