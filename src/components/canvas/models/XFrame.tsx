import { useGLTF } from "@react-three/drei";
import { Select } from "@react-three/postprocessing";
import { useInteraction } from "../../../hooks/useInteraction";
import { useFocus } from "../../context/FocusContext";

export function XFrame() {
  const { scene } = useGLTF("/models/xFrame.glb");
  const { isHovered, pulseIntensity, interactionHandlers } =
    useInteraction("X");
  const { focusConfig } = useFocus();

  const handleClick = () => {
    window.open("https://x.com/MattCamerato", "_blank");
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
