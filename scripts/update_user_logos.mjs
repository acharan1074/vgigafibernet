import fs from "fs";
import path from "path";

const logosDir = "C:/Users/charan/.gemini/antigravity/scratch/vgigafibernet/artifacts/rudra-fiber/public/logos";

const updates = [
  { name: "gemini", file: "gemini.png" },
  { name: "colors", file: "colors.png" },
  { name: "etvplus", file: "etvplus.png" },
  { name: "zeecinemalu", file: "zeecinemalu.png" },
  { name: "geminimovies", file: "geminimovies.png" },
];

for (const item of updates) {
  const pngPath = path.join(logosDir, item.file);
  const pngBuf = fs.readFileSync(pngPath);
  const base64 = pngBuf.toString("base64");
  const dataUri = `data:image/png;base64,${base64}`;

  const width = pngBuf.readUInt32BE(16);
  const height = pngBuf.readUInt32BE(20);

  const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <rect width="${width}" height="${height}" rx="24" fill="#FFFFFF"/>
  <image href="${dataUri}" width="${width}" height="${height}" preserveAspectRatio="xMidYMid meet"/>
</svg>`;

  fs.writeFileSync(path.join(logosDir, `${item.name}.svg`), svgContent, "utf8");
  console.log(`Updated ${item.name}.svg (${width}x${height})`);
}