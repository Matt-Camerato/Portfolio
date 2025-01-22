import { useEffect } from "react";
import { Mesh } from "three";
import { useGLTF } from "@react-three/drei";
import { Select } from "@react-three/postprocessing";
import { useInteraction } from "../../../hooks/useInteraction";
import { useFocus } from "../../context/FocusContext";

export function LinkedInFrame() {
  const { scene } = useGLTF("/models/linkedInFrame.glb");
  const { isHovered, pulseIntensity, interactionHandlers } =
    useInteraction("LinkedIn");
  const { focusConfig } = useFocus();

  useEffect(() => {
    scene.traverse((child) => {
      if (child instanceof Mesh) {
        child.receiveShadow = true;
        child.castShadow = true;
      }
    });
  }, [scene]);

  const handleClick = () => {
    window.open(
      "https://www.linkedin.com/in/matthew-camerato-74906b23b/",
      "_blank"
    );
  };

  return (
    <Select enabled={isHovered || pulseIntensity > 0}>
      <primitive
        object={scene}
        {...interactionHandlers}
        {...(!focusConfig && { onClick: handleClick })}
      />
    </Select>
  );
}
