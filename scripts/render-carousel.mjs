// Renders each carousel slide to PNG.
//   node scripts/render-carousel.mjs [CompositionId] [outDir] [slides]
import { execFileSync } from "node:child_process";
import { mkdirSync } from "node:fs";

const id = process.argv[2] || "PermissionCarousel";
const outDir = process.argv[3] || "out/carousel/permission-map";
const slides = Number(process.argv[4] || 7);
const browser =
  process.env.REMOTION_BROWSER ||
  "/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell";

mkdirSync(outDir, { recursive: true });
for (let i = 0; i < slides; i++) {
  const file = `${outDir}/slide-${String(i + 1).padStart(2, "0")}.png`;
  execFileSync(
    "npx",
    ["remotion", "still", id, file, `--frame=${i}`, "--image-format=png", `--browser-executable=${browser}`, "--log=error"],
    { stdio: "inherit" },
  );
  console.log("✓", file);
}
