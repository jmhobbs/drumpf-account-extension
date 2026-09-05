import * as esbuild from "esbuild";
import * as cpx from "cpx2";
import { generateIcons } from "./icons.js";

await esbuild.build({
  entryPoints: ["src/content.ts"],
  bundle: true,
  outfile: "dist/content.js",
  format: "iife",
});

cpx.copySync("src/manifest.json", "dist");

await generateIcons();
