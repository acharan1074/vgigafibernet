import { db } from "./index.js";
import { plansTable } from "./schema/index.js";

async function seed() {
  const existing = await db.select().from(plansTable);
  if (existing.length > 0) {
    console.log(`Already have ${existing.length} plans, skipping seed.`);
    process.exit(0);
  }

  await db.insert(plansTable).values([
    { name: "SD 20 Mbps", category: "sd_tv", speed: 20, price: 530, features: ["SD TV Channels", "Unlimited Data", "Free Installation", "24x7 Support", "1000+ Telugu Channels"], isPopular: false },
    { name: "SD 30 Mbps", category: "sd_tv", speed: 30, price: 520, features: ["SD TV Channels", "Unlimited Data", "Free Installation", "24x7 Support", "1000+ Telugu Channels"], isPopular: false },
    { name: "SD 50 Mbps", category: "sd_tv", speed: 50, price: 560, features: ["SD TV Channels", "Unlimited Data", "Free Installation", "24x7 Support", "1000+ Telugu Channels"], isPopular: false },
    { name: "HD 20 Mbps", category: "hd_tv", speed: 20, price: 550, features: ["HD TV Channels", "Unlimited Data", "Free Installation", "24x7 Support", "OTT Access"], isPopular: false },
    { name: "HD 30 Mbps", category: "hd_tv", speed: 30, price: 540, features: ["HD TV Channels", "Unlimited Data", "Free Installation", "24x7 Support", "OTT Access"], isPopular: true },
    { name: "HD 50 Mbps", category: "hd_tv", speed: 50, price: 580, features: ["HD TV Channels", "Unlimited Data", "Free Installation", "24x7 Support", "OTT Access"], isPopular: false },
    { name: "Net 20 Mbps", category: "internet_only", speed: 20, price: 360, features: ["No TV Channels", "Unlimited Data", "Free Installation", "24x7 Support", "Static IP Available"], isPopular: false },
    { name: "Net 30 Mbps", category: "internet_only", speed: 30, price: 350, features: ["No TV Channels", "Unlimited Data", "Free Installation", "24x7 Support", "Static IP Available"], isPopular: false },
    { name: "Net 50 Mbps", category: "internet_only", speed: 50, price: 390, features: ["No TV Channels", "Unlimited Data", "Free Installation", "24x7 Support", "Static IP Available"], isPopular: false },
  ]);

  console.log("Plans seeded successfully!");
  process.exit(0);
}

seed().catch(e => { console.error(e); process.exit(1); });
