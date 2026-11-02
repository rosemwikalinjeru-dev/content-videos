import "@fontsource/inter/400.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/800.css";
import "@fontsource/inter/900.css";
import "@fontsource/jetbrains-mono/700.css";
import React from "react";
import { Composition } from "remotion";
import { Gpt61Terra } from "./videos/gpt61-terra/Gpt61Terra";
import terraScript from "./generated/gpt61-terra.scenes.json";
import { FPS, loadTiming, VideoProps } from "./lib/timing";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Gpt61Terra"
        component={Gpt61Terra}
        width={1080}
        height={1920}
        fps={FPS}
        durationInFrames={30}
        defaultProps={{ video: "gpt61-terra", preview: true, scenes: [] } as VideoProps}
        calculateMetadata={async () => {
          const props = await loadTiming("gpt61-terra", terraScript.scenes);
          return {
            props,
            durationInFrames: props.scenes.reduce((n, s) => n + s.durationInFrames, 0),
          };
        }}
      />
    </>
  );
};
