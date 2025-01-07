import * as THREE from "three";
import { ColorPalette } from "../../utils/colors";

export const Environment = () => {
  return (
    <>
      <ambientLight intensity={0.2} color={ColorPalette.White} />

      <spotLight
        position={new THREE.Vector3(0, 4.5, 0)}
        intensity={15}
        angle={1.4}
        penumbra={0.1}
        color={"#ea8dad"}
      />
    </>
  );
};
