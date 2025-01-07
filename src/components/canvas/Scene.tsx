import { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { EffectComposer, Selection } from "@react-three/postprocessing";
import { CameraProvider } from "../context/CameraContext";
import { FocusProvider } from "../context/FocusContext";
import { Environment } from "./Environment";
import { PostProcessing } from "./PostProcessing";
import {
  Candle,
  Clock,
  Computer,
  Controller,
  Diploma,
  GithubFrame,
  ItchFrame,
  LinkedInFrame,
  Monitor1,
  Monitor2,
  Workspace,
} from "./models";
import { Envelope } from "./objects/Envelope";
import { Resume } from "./objects/Resume";
import { RubiksCube } from "./objects/RubiksCube";
import { getSkyColor } from "../../utils/colors";

export function Scene() {
  const [backgroundColor, setBackgroundColor] = useState<string>("#ffffff");

  //update the background color every minute
  useEffect(() => {
    const updateColor = () => {
      const now = new Date();
      setBackgroundColor(getSkyColor(now.getHours(), now.getMinutes()));
    };
    updateColor();
    const interval = setInterval(updateColor, 1000 * 60);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        width: "100vw",
        height: "calc(100vh - 64px)",
        marginTop: "64px",
      }}
    >
      <Canvas camera={{ fov: 75 }} shadows>
        {/* TODO: Make this change with day/night cycle */}
        <color attach="background" args={[backgroundColor]} />
        <Suspense fallback={null}>
          <CameraProvider>
            <FocusProvider>
              <Selection>
                {/* Lighting & Post Processing */}
                <EffectComposer
                  multisampling={8}
                  autoClear={false}
                  depthBuffer={true}
                >
                  <Environment />
                  <PostProcessing />
                </EffectComposer>

                {/* Models */}
                <Candle />
                <Clock />
                <Computer />
                <Controller />
                <Workspace />

                {/* Interactable Models */}
                <Diploma />
                <Envelope />
                <GithubFrame />
                <ItchFrame />
                <LinkedInFrame />
                <Monitor1 />
                <Monitor2 />
                <Resume />
                <RubiksCube />
              </Selection>
            </FocusProvider>
          </CameraProvider>
        </Suspense>
      </Canvas>
    </div>
  );
}
