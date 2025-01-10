import { useState } from "react";
import { ThreeEvent, useThree } from "@react-three/fiber";
import { Plane, Html } from "@react-three/drei";
import * as THREE from "three";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faRepeat } from "@fortawesome/free-solid-svg-icons";
import { useFocus } from "../context/FocusContext";
import "../../styles/Overlay.scss";

export const Overlay = () => {
  const { camera } = useThree();
  const { focusConfig, actions, showOverlay, canInteract } = useFocus();
  const [isDragging, setIsDragging] = useState(false);

  const overlayMaterial = new THREE.MeshBasicMaterial({
    color: 0x000000,
    transparent: true,
    opacity: 0.6,
    depthWrite: false,
  });

  const getOverlayPosition = (distance: number) => {
    const planeVector = new THREE.Vector3(0, 0, -distance);
    planeVector.applyQuaternion(camera.quaternion);
    planeVector.add(camera.position);
    return planeVector;
  };

  const getOverlayScale = () => {
    const height =
      2 *
      Math.tan(
        THREE.MathUtils.degToRad((camera as THREE.PerspectiveCamera).fov / 2)
      ) *
      0.75;
    const width = height * (camera as THREE.PerspectiveCamera).aspect;
    return new THREE.Vector3(width, height, 1);
  };

  const handleDragStart = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    if (!focusConfig?.canRotate) return;
    setIsDragging(true);
  };

  const handleDragMove = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    if (!isDragging || !focusConfig?.canRotate) return;

    const deltaX = e.movementX / 500;
    const deltaY = e.movementY / 500;

    const cameraRight = new THREE.Vector3(1, 0, 0).applyQuaternion(
      camera.quaternion
    );
    const cameraUp = new THREE.Vector3(0, 1, 0).applyQuaternion(
      camera.quaternion
    );
    const rightRotation = new THREE.Quaternion().setFromAxisAngle(
      cameraUp,
      deltaX
    );
    const upRotation = new THREE.Quaternion().setFromAxisAngle(
      cameraRight,
      deltaY
    );
    const combinedRotation = rightRotation.multiply(upRotation);

    focusConfig!.object.quaternion.multiplyQuaternions(
      combinedRotation,
      focusConfig!.object.quaternion
    );
  };

  const handleDragEnd = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    if (!focusConfig?.canRotate) return;
    setIsDragging(false);
  };

  return (
    showOverlay &&
    focusConfig && (
      <>
        <Html
          position={getOverlayPosition(0.5)}
          quaternion={camera.quaternion}
          renderOrder={1}
          style={{
            pointerEvents: "none", // Add this line
          }}
        >
          <div className="overlay">
            {actions.has("close") && (
              <button
                className="closeButton"
                onClick={() => {
                  if (canInteract) actions.get("close")?.();
                }}
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            )}
            {actions.has("shuffle") && (
              <button
                className="shuffleButton"
                onClick={actions.get("shuffle")}
              >
                <FontAwesomeIcon icon={faRepeat} />
              </button>
            )}
          </div>
        </Html>
        {focusConfig.transition.type === "OBJECT_TO_CAMERA" && (
          <Plane
            args={[1, 1]}
            position={getOverlayPosition(0.75)}
            quaternion={camera.quaternion}
            scale={getOverlayScale()}
            material={overlayMaterial}
            renderOrder={-1}
            onPointerDown={handleDragStart}
            onPointerMove={handleDragMove}
            onPointerUp={handleDragEnd}
            onPointerLeave={handleDragEnd}
          />
        )}
      </>
    )
  );
};
