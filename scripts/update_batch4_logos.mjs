import fs from "fs";
import path from "path";

const logosDir = "C:/Users/charan/.gemini/antigravity/scratch/vgigafibernet/artifacts/rudra-fiber/public/logos";

const items = [
  "tv9", "tv5", "tnews", "inews", "sakshi",
  "v6", "hmtv", "abn", "suntv", "zee5",
  "jiocinema", "sonyliv", "sunnxt", "mxplayer", "aha",
  "hotstar", "yoyo", "bhakthi", "starvijay", "youtube",
  "discoveryplus", "hungama", "shemaroome"
];

for (const name of items) {
  const pngPath = path.join(logosDir, `${name}.png`);
  if (!fs.existsSync(pngPath)) {
    console.log(`[SKIP] ${name}.png not found`);
    continue;
  }
  const pngBuf = fs.readFileSync(pngPath);
  const base64 = pngBuf.toString("base64");
  const dataUri = `data:image/png;base64,${base64}`;

  const width = pngBuf.readUInt32BE(16);
  const height = pngBuf.readUInt32BE(20);

  const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <rect width="${width}" height="${height}" rx="20" fill="#FFFFFF"/>
  <image href="${dataUri}" width="${width}" height="${height}" preserveAspectRatio="xMidYMid meet"/>
</svg>`;

  fs.writeFileSync(path.join(logosDir, `${name}.svg`), svgContent, "utf8");
  console.log(`Updated ${name}.svg (${width}x${height})`);
}