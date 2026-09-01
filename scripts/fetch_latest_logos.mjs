import fs from "fs";
import path from "path";
import https from "https";
import http from "http";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const destDir = path.resolve(__dirname, "../artifacts/rudra-fiber/public/logos");

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

const directLogos = [
  // OTT Platforms
  { file: "netflix.svg", url: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg" },
  { file: "primevideo.svg", url: "https://upload.wikimedia.org/wikipedia/commons/1/11/Amazon_Prime_Video_logo.svg" },
  { file: "hotstar.svg", url: "https://upload.wikimedia.org/wikipedia/commons/1/1e/Jio_Hotstar_logo.svg" },
  { file: "aha.png", url: "https://upload.wikimedia.org/wikipedia/commons/1/17/Aha_OTT_logo.png" },
  { file: "sunnxt.svg", url: "https://upload.wikimedia.org/wikipedia/commons/4/4a/Sun_NXT_logo.svg" },
  { file: "zee5.svg", url: "https://upload.wikimedia.org/wikipedia/commons/9/98/ZEE5_logo.svg" },
  { file: "sonyliv.svg", url: "https://upload.wikimedia.org/wikipedia/commons/9/9f/Sony_LIV_2020.svg" },
  { file: "jiocinema.svg", url: "https://upload.wikimedia.org/wikipedia/commons/3/3c/JioCinema_2023_logo.svg" },
  { file: "mxplayer.svg", url: "https://upload.wikimedia.org/wikipedia/commons/3/37/MX_Player_logo.svg" },
  { file: "youtube.svg", url: "https://upload.wikimedia.org/wikipedia/commons/0/09/YouTube_full-color_icon_%282017%29.svg" },
  { file: "lionsgate.svg", url: "https://upload.wikimedia.org/wikipedia/commons/5/5b/Lionsgate_Play_logo.svg" },
  { file: "hungama.svg", url: "https://upload.wikimedia.org/wikipedia/commons/4/4e/Hungama_Play_Logo.svg" },
  { file: "shemaroome.svg", url: "https://upload.wikimedia.org/wikipedia/commons/3/38/ShemarooMe_logo.svg" },
  { file: "discoveryplus.svg", url: "https://upload.wikimedia.org/wikipedia/commons/1/14/Discovery%2B_logo.svg" },

  // TV Channels
  { file: "zeetelugu.svg", url: "https://upload.wikimedia.org/wikipedia/commons/5/5a/Zee_Telugu_logo.svg" },
  { file: "etv.svg", url: "https://upload.wikimedia.org/wikipedia/commons/5/5d/ETV_Telugu_logo.svg" },
  { file: "gemini.svg", url: "https://upload.wikimedia.org/wikipedia/commons/d/d0/Gemini_TV_logo.svg" },
  { file: "colors.svg", url: "https://upload.wikimedia.org/wikipedia/commons/f/ff/Colors_Telugu_logo.svg" },
  { file: "etvplus.svg", url: "https://upload.wikimedia.org/wikipedia/commons/a/ae/ETV_Plus_logo.svg" },
  { file: "zeecinemalu.svg", url: "https://upload.wikimedia.org/wikipedia/commons/6/61/Zee_Cinemalu_logo.svg" },
  { file: "geminimovies.svg", url: "https://upload.wikimedia.org/wikipedia/commons/d/d7/Gemini_Movies_logo.svg" },
  { file: "sonymax.svg", url: "https://upload.wikimedia.org/wikipedia/commons/4/4e/Sony_MAX_Logo.svg" },
  { file: "stargold.svg", url: "https://upload.wikimedia.org/wikipedia/commons/d/d8/Star_Gold_logo.svg" },
  { file: "starmovies.svg", url: "https://upload.wikimedia.org/wikipedia/commons/8/8c/Star_Movies_logo.svg" },
  { file: "tv9.svg", url: "https://upload.wikimedia.org/wikipedia/commons/1/1b/TV9_Telugu_logo.svg" },
  { file: "ntv.svg", url: "https://upload.wikimedia.org/wikipedia/commons/e/e2/NTV_Telugu_logo.svg" },
  { file: "abn.svg", url: "https://upload.wikimedia.org/wikipedia/commons/1/1f/ABN_Andhra_Jyothy_logo.svg" },
  { file: "hmtv.svg", url: "https://upload.wikimedia.org/wikipedia/commons/d/dc/HMTV_logo.svg" },
  { file: "sakshi.svg", url: "https://upload.wikimedia.org/wikipedia/commons/1/16/Sakshi_TV_logo.svg" },
  { file: "mahaa.svg", url: "https://upload.wikimedia.org/wikipedia/commons/a/af/Mahaa_TV_Logo.svg" },
  { file: "inews.svg", url: "https://upload.wikimedia.org/wikipedia/commons/4/43/INews_Telugu_logo.svg" },
  { file: "tnews.svg", url: "https://upload.wikimedia.org/wikipedia/commons/1/1d/T_News_logo.svg" },
  { file: "studion.svg", url: "https://upload.wikimedia.org/wikipedia/commons/8/85/Studio_N_logo.svg" },
  { file: "tv5.svg", url: "https://upload.wikimedia.org/wikipedia/commons/e/e4/TV5_Telugu_Logo.svg" },
  { file: "bhakthi.svg", url: "https://upload.wikimedia.org/wikipedia/commons/4/4f/Bhakthi_TV_logo.svg" },
  { file: "aastha.svg", url: "https://upload.wikimedia.org/wikipedia/commons/1/12/Aastha_channel.svg" },
  { file: "starvijay.svg", url: "https://upload.wikimedia.org/wikipedia/commons/7/78/Star_Vijay_logo.svg" },
  { file: "suntv.svg", url: "https://upload.wikimedia.org/wikipedia/commons/b/bb/Sun_TV_logo.svg" },
  { file: "starmaa.png", url: "https://upload.wikimedia.org/wikipedia/commons/2/2c/Star_Maa_logo.png" },
  { file: "v6.png", url: "https://upload.wikimedia.org/wikipedia/commons/e/e6/V6_News_Logo.png" },
  { file: "10tv.jpg", url: "https://upload.wikimedia.org/wikipedia/commons/e/e9/10TV_News_Logo.jpg" },
  { file: "yoyo.jpg", url: "https://upload.wikimedia.org/wikipedia/commons/e/e9/YoYo_TV_Channel_logo.jpg" },
  { file: "maamovies.png", url: "https://upload.wikimedia.org/wikipedia/commons/f/f9/Maa_Movies_Logo.png" },
];

function download(url, dest, redirects = 5) {
  return new Promise((resolve, reject) => {
    if (redirects === 0) return reject(new Error("Too many redirects"));

    const client = url.startsWith("https") ? https : http;
    const req = client.get(url, {
      headers: {
        "User-Agent": "VGigaFiberBot/1.0 (https://vgigafiber.net; info@vgigafiber.net)",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,image/svg+xml,*/*;q=0.8"
      }
    }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        let redirectUrl = res.headers.location;
        if (!redirectUrl.startsWith("http")) {
          const u = new URL(url);
          redirectUrl = `${u.protocol}//${u.host}${redirectUrl}`;
        }
        return resolve(download(redirectUrl, dest, redirects - 1));
      }

      if (res.statusCode !== 200) {
        return reject(new Error(`HTTP ${res.statusCode}`));
      }

      const fileStream = fs.createWriteStream(dest);
      res.pipe(fileStream);
      fileStream.on("finish", () => {
        fileStream.close();
        resolve(true);
      });
      fileStream.on("error", (err) => {
        fs.unlink(dest, () => {});
        reject(err);
      });
    });

    req.on("error", (err) => reject(err));
  });
}

async function start() {
  console.log(`Downloading ${directLogos.length} official vector SVGs and logos...`);
  let ok = 0;
  let fail = 0;

  for (const item of directLogos) {
    const dest = path.join(destDir, item.file);
    try {
      await download(item.url, dest);
      console.log(`[OK] ${item.file}`);
      ok++;
    } catch (e) {
      console.log(`[FAIL] ${item.file}: ${e.message}`);
      fail++;
    }
  }

  console.log(`\nCompleted: ${ok} passed, ${fail} failed.`);
}

start();