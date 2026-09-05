import * as esbuild from "esbuild";
import * as cpx from "cpx2";

const ctx = await esbuild.context({
  entryPoints: ["src/content.ts"],
  bundle: true,
  outfile: "dist/content.js",
  format: "iife",
});

await ctx.watch();

cpx
  .watch("src/manifest.json", "dist")
  .on("copy", (event) => console.log(`> Copied ${event.srcPath}`))
  .on("watch-error", (error) => console.error(error));

console.log("Watching for changes...");
