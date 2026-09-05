import sharp from "sharp";

export const ICON_SRC = "src/dollar.png";
export const ICON_SIZES = [16, 32, 48, 128];

export async function generateIcons() {
  await Promise.all(
    ICON_SIZES.map((size) =>
      sharp(ICON_SRC).resize(size, size).toFile(`dist/icon${size}.png`),
    ),
  );
}
