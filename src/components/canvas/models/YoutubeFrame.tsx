import { useGLTF } from "@react-three/drei";
import { Select } from "@react-three/postprocessing";
import { useInteraction } from "../../../hooks/useInteraction";
import { useFocus } from "../../context/FocusContext";

export function YoutubeFrame() {
  const { scene } = useGLTF("/models/youtubeFrame.glb");
  const { isHovered, pulseIntensity, interactionHandlers } =
    useInteraction("Youtube");
  const { focusConfig } = useFocus();

  const handleClick = () => {
    window.open("https://www.youtube.com/@mattcamerato", "_blank");
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
