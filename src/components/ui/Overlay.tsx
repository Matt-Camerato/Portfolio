import { useState } from "react";
import { ThreeEvent, useThree } from "@react-three/fiber";
import { Plane, Html } from "@react-three/drei";
import * as THREE from "three";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTimes,
  faRepeat,
  faLink,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import { useFocus } from "../context/FocusContext";
import "../../styles/Overlay.scss";

export const Overlay = () => {
  const { camera } = useThree();
  const { focusConfig, actions, showOverlay, interactState } = useFocus();
  const [isDragging, setIsDragging] = useState(false);

  const overlayMaterial = new THREE.MeshBasicMaterial({
    color: 0x000000,
    transparent: true,
    opacity: 0.6,
    depthWrite: false,
  });

  const getOverlayWidth = () => {
    if (!focusConfig) return window.innerWidth * 0.5;

    switch (focusConfig.id) {
      case "monitor1":
      case "monitor2":
        return Math.min(window.innerWidth * 0.85, 1450);
      case "diploma":
        return Math.min(window.innerWidth * 0.9, 1200);
      default:
        return Math.max(window.innerWidth * 0.5, 400);
    }
  };

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
            pointerEvents: "none",
          }}
        >
          <div className="overlay">
            <div className="overlay-btns" style={{ width: getOverlayWidth() }}>
              {actions.has("close") && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: [1, 0.5, 1], scale: [1, 0.9, 1] }}
                  transition={{
                    duration: 0.6,
                    ease: "easeInOut",
                    repeat: 3,
                    repeatType: "reverse",
                  }}
                  className="overlay-btn"
                  onClick={() => {
                    if (interactState > 0) actions.get("close")?.();
                  }}
                  style={{ fontSize: "max(5vw, 60px)" }}
                >
                  <FontAwesomeIcon icon={faTimes} />
                </motion.button>
              )}
              {interactState > 1 && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: [1, 0.5, 1], scale: [1, 0.9, 1] }}
                  transition={{
                    duration: 0.6,
                    ease: "easeInOut",
                    repeat: 3,
                    repeatType: "reverse",
                  }}
                  className="overlay-btn"
                  onClick={() => actions.get("back")?.()}
                  style={{ fontSize: "max(4vw, 50px)" }}
                >
                  <FontAwesomeIcon icon={faArrowLeft} />
                </motion.button>
              )}
              {actions.has("shuffle") && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: [1, 0.5, 1], scale: [1, 0.9, 1] }}
                  transition={{
                    duration: 0.6,
                    ease: "easeInOut",
                    repeat: 3,
                    repeatType: "reverse",
                  }}
                  className="overlay-btn"
                  onClick={actions.get("shuffle")}
                >
                  <FontAwesomeIcon icon={faRepeat} />
                </motion.button>
              )}
              {actions.has("resume") && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: [1, 0.5, 1], scale: [1, 0.9, 1] }}
                  transition={{
                    duration: 0.6,
                    ease: "easeInOut",
                    repeat: 3,
                    repeatType: "reverse",
                  }}
                  className="overlay-btn"
                  onClick={actions.get("resume")}
                >
                  <FontAwesomeIcon icon={faLink} />
                </motion.button>
              )}
            </div>
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
