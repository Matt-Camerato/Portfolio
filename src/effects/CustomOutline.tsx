import { useMemo, useEffect, forwardRef, useContext } from "react";
import { Object3D } from "three";
import { EffectComposerContext } from "@react-three/postprocessing";
import { CustomOutlineEffect } from "./CustomOutlineEffect";

interface CustomOutlineProps {
  selectedObjects: Object3D[];
  outlineColor?: string | undefined;
  width?: number | undefined;
  height?: number | undefined;
}

export const CustomOutline = forwardRef(
  (
    {
      selectedObjects,
      outlineColor,
      width,
      height,
      ...props
    }: CustomOutlineProps,
    forwardRef: React.Ref<CustomOutlineEffect>
  ) => {
    const { scene, camera } = useContext(EffectComposerContext);

    const effect = useMemo(
      () =>
        new CustomOutlineEffect(scene, camera, {
          outlineColor,
          width,
          height,
          ...props,
        }),
      [scene, camera, outlineColor, width, height]
    );

    useEffect(() => {
      effect.selection.set(selectedObjects);
    }, [selectedObjects]);

    useEffect(() => {
      effect.selection.layer = 5;
      return () => {
        effect.dispose();
      };
    }, [effect]);

    return <primitive ref={forwardRef} object={effect} />;
  }
);
