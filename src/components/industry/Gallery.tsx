import React from "react";
import { AbsoluteFill } from "remotion";
import { IndustryArt, Industry } from "./IndustryArt";

const ALL: Industry[] = ["roofing", "hvac", "plumbing", "dental", "medspa", "salon", "law", "landscaping", "cleaning", "bookkeeping", "agency", "remodeling"];

// Dev-only contact sheet of every illustration.
export const IndustryGallery: React.FC = () => (
  <AbsoluteFill style={{ background: "#0b1020", flexDirection: "row", flexWrap: "wrap", gap: 20, padding: 20 }}>
    {ALL.map((k) => (
      <div key={k} style={{ width: 573, color: "#9aa5c4", font: "700 24px Inter" }}>
        <IndustryArt industry={k} width={573} />
        <div style={{ marginTop: 6 }}>{k}</div>
      </div>
    ))}
  </AbsoluteFill>
);
