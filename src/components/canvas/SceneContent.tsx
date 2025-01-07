import { useEffect, useState } from "react";
import { EffectComposer, Selection } from "@react-three/postprocessing";
import { getSkyColor } from "../../utils/colors";
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
import { Envelope, Resume, RubiksCube } from "./objects";

export function SceneContent() {
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
    <Selection>
      {/* Background Color */}
      <color attach="background" args={[backgroundColor]} />

      {/* Lighting & Post Processing */}
      <EffectComposer multisampling={8} autoClear={false} depthBuffer={true}>
        <Environment />
        <PostProcessing />
      </EffectComposer>

      {/* Static Objects */}
      <Candle />
      <Clock />
      <Computer />
      <Controller />
      <Workspace />

      {/* Interactable Objects */}
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
  );
}
