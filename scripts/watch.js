import * as esbuild from "esbuild";
import * as cpx from "cpx2";
import { watch } from "node:fs";
import { basename, dirname } from "node:path";
import { generateIcons, ICON_SRC } from "./icons.js";

const ICON_DEBOUNCE_MS = 25;

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

async function regenerateIcons() {
  try {
    await generateIcons();
    console.log(`> Regenerated icons from ${ICON_SRC}`);
  } catch (error) {
    // Editors that save via write-temp-then-rename briefly remove the file;
    // the rename's own watch event will trigger a follow-up regeneration.
    if (error.code !== "ENOENT") {
      throw error;
    }
  }
}

await regenerateIcons();

let iconDebounceTimer;
watch(dirname(ICON_SRC), (_eventType, filename) => {
  if (filename !== basename(ICON_SRC)) {
    return;
  }
  clearTimeout(iconDebounceTimer);
  iconDebounceTimer = setTimeout(regenerateIcons, ICON_DEBOUNCE_MS);
});

console.log("Watching for changes...");
