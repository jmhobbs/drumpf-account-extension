import * as esbuild from "esbuild";
import * as cpx from "cpx2";

await esbuild.build({
  entryPoints: ["src/content.ts"],
  bundle: true,
  outfile: "dist/content.js",
  format: "iife",
});

cpx.copySync("src/manifest.json", "dist");
