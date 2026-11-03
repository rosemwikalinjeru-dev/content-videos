import "@fontsource/inter/400.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/800.css";
import "@fontsource/inter/900.css";
import "@fontsource/jetbrains-mono/700.css";
import React from "react";
import { Composition } from "remotion";
import { FPS, loadTiming, ScriptScene, VideoProps } from "./lib/timing";
import { Teardown } from "./videos/teardown/Teardown";
import { SPECS } from "./videos/teardown/specs";
import type { TeardownSpec } from "./videos/teardown/types";

import terra from "./generated/gpt61-terra.scenes.json";
import apple from "./generated/apple-numbers-mcp.scenes.json";
import missed from "./generated/missed-calls.scenes.json";
import noShows from "./generated/no-shows.scenes.json";
import slowQuotes from "./generated/slow-quotes.scenes.json";
import aiPermissions from "./generated/ai-receptionist-permissions.scenes.json";
import aiRefunds from "./generated/ai-receptionist-refunds.scenes.json";
import aiClinical from "./generated/ai-receptionist-clinical.scenes.json";

const SCRIPTS: Record<string, ScriptScene[]> = {
  "gpt61-terra": terra.scenes,
  "apple-numbers-mcp": apple.scenes,
  "missed-calls": missed.scenes,
  "no-shows": noShows.scenes,
  "slow-quotes": slowQuotes.scenes,
  "ai-receptionist-permissions": aiPermissions.scenes,
  "ai-receptionist-refunds": aiRefunds.scenes,
  "ai-receptionist-clinical": aiClinical.scenes,
};

type Props = VideoProps & { spec: TeardownSpec };

export const RemotionRoot: React.FC = () => (
  <>
    {SPECS.map((spec) => (
      <Composition
        key={spec.id}
        id={spec.compositionId}
        component={Teardown}
        width={1080}
        height={1920}
        fps={FPS}
        durationInFrames={30}
        defaultProps={{ video: spec.id, preview: true, scenes: [], spec } as Props}
        calculateMetadata={async ({ props }) => {
          const timing = await loadTiming(spec.id, SCRIPTS[spec.id]);
          return {
            props: { ...props, ...timing, spec },
            durationInFrames: timing.scenes.reduce((n, s) => n + s.durationInFrames, 0),
          };
        }}
      />
    ))}
  </>
);
