import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Zap, Tv, Wifi, Check, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useListPlans } from "@workspace/api-client-react";

const planMeta: Record<string, { label: string; subtitle: string; icon: typeof Wifi; color: string; border: string; badge: string }> = {
  sd_tv: {
    label: "SD TV Plan",
    subtitle: "Silver Package",
    icon: Tv,
    color: "from-blue-500/20 to-cyan-500/20",
    border: "border-blue-500/40",
    badge: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  },
  hd_tv: {
    label: "HD TV Plan",
    subtitle: "Gold Package",
    icon: Tv,
    color: "from-yellow-500/20 to-orange-500/20",
    border: "border-yellow-500/40",
    badge: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  },
  internet_only: {
    label: "Internet Only",
    subtitle: "Net Package",
    icon: Wifi,
    color: "from-green-500/20 to-teal-500/20",
    border: "border-green-500/40",
    badge: "bg-green-500/20 text-green-300 border-green-500/30",
  },
};

const defaultPlans = [
  { id: 1, name: "SD 20 Mbps", category: "sd_tv", speed: 20, price: 530, isPopular: false, features: ["SD TV Channels", "Unlimited Data", "Free Installation", "24x7 Support"] },
  { id: 2, name: "SD 30 Mbps", category: "sd_tv", speed: 30, price: 520, isPopular: false, features: ["SD TV Channels", "Unlimited Data", "Free Installation", "24x7 Support"] },
  { id: 3, name: "SD 50 Mbps", category: "sd_tv", speed: 50, price: 560, isPopular: false, features: ["SD TV Channels", "Unlimited Data", "Free Installation", "24x7 Support"] },
  { id: 4, name: "HD 20 Mbps", category: "hd_tv", speed: 20, price: 550, isPopular: false, features: ["HD TV Channels", "1000+ Channels", "Free Installation", "OTT Access"] },
  { id: 5, name: "HD 30 Mbps", category: "hd_tv", speed: 30, price: 540, isPopular: true, features: ["HD TV Channels", "1000+ Channels", "Free Installation", "OTT Access"] },
  { id: 6, name: "HD 50 Mbps", category: "hd_tv", speed: 50, price: 580, isPopular: false, features: ["HD TV Channels", "1000+ Channels", "Free Installation", "OTT Access"] },
  { id: 7, name: "Net 20 Mbps", category: "internet_only", speed: 20, price: 360, isPopular: false, features: ["No TV Channels", "Unlimited Data", "Free Installation", "24x7 Support"] },
  { id: 8, name: "Net 30 Mbps", category: "internet_only", speed: 30, price: 350, isPopular: false, features: ["No TV Channels", "Unlimited Data", "Free Installation", "24x7 Support"] },
  { id: 9, name: "Net 50 Mbps", category: "internet_only", speed: 50, price: 390, isPopular: false, features: ["No TV Channels", "Unlimited Data", "Free Installation", "24x7 Support"] },
];

const bsnlPlans = [
  { id: 101, name: "FIBER HOME", category: "internet_only", speed: 40, price: 399, isPopular: false, features: ["1400 GB Data at 40 Mbps", "4 Mbps after FUP", "Unlimited Local & STD Calls", "Free Installation"] },
  { id: 102, name: "FIBER BASIC", category: "internet_only", speed: 60, price: 499, isPopular: true, features: ["3300 GB Data at 60 Mbps", "4 Mbps after FUP", "Unlimited Local & STD Calls", "Free Installation"] },
  { id: 103, name: "FIBER BASIC PLUS", category: "internet_only", speed: 100, price: 599, isPopular: false, features: ["4000 GB Data at 100 Mbps", "4 Mbps after FUP", "Unlimited Local & STD Calls", "Free Installation"] },
  { id: 104, name: "FIBER TB", category: "internet_only", speed: 150, price: 799, isPopular: false, features: ["4000 GB Data at 150 Mbps", "10 Mbps after FUP", "Unlimited Local & STD Calls", "Free Installation"] },
  { id: 105, name: "SUPER STAR PREMIUM PLUS", category: "internet_only", speed: 200, price: 999, isPopular: true, features: ["5000 GB Data at 200 Mbps", "10 Mbps after FUP", "JioHotstar OTT Free", "Unlimited Calls"] },
  { id: 106, name: "FIBER PREMIUM PLUS", category: "internet_only", speed: 250, price: 1499, isPopular: false, features: ["6000 GB Data at 250 Mbps", "15 Mbps after FUP", "Unlimited Local & STD Calls", "Free Installation"] },
  { id: 107, name: "FIBER ULTRA", category: "internet_only", speed: 300, price: 1799, isPopular: false, features: ["6500 GB Data at 300 Mbps", "20 Mbps after FUP", "Unlimited Local & STD Calls", "Free Installation"] },
];

const allFeatures = ["Unlimited Data", "Free Installation", "24x7 Support", "Fiber Connection", "Static IP Option", "Multi-device Support"];

const normalizePlanCategory = (category: string) => {
  const normalized = category.toLowerCase().replace(/[^a-z]/g, "");
  if (normalized.includes("hd")) return "hd_tv";
  if (normalized.includes("sd")) return "sd_tv";
  return "internet_only";
};

export default function Plans() {
  const { data: plans } = useListPlans();
  const [activeService, setActiveService] = useState<"bsnl" | "excell">("bsnl");
  const excellPlans = plans && plans.length > 0
    ? plans.map(plan => ({ ...plan, category: normalizePlanCategory(plan.category) }))
    : defaultPlans;
  const displayPlans = activeService === "excell" ? excellPlans : bsnlPlans;
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const categories = ["all", "sd_tv", "hd_tv", "internet_only"];
  const filtered = activeCategory === "all" ? displayPlans : displayPlans.filter(p => p.category === activeCategory);
  const grouped = {
    sd_tv: filtered.filter(p => p.category === "sd_tv"),
    hd_tv: filtered.filter(p => p.category === "hd_tv"),
    internet_only: filtered.filter(p => p.category === "internet_only"),
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">


      {/* Header */}
      <motion.div className="text-center mb-12" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Badge className="mb-4 gradient-gold border-0 text-background font-display tracking-wider">BROADBAND PLANS</Badge>
        <h1 className="font-display text-4xl sm:text-5xl font-black text-foreground mb-4">
          Internet & <span className="gradient-text">TV Plans</span>
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
          Choose from our range of high-speed fiber broadband and cable TV packages.
          All plans include free installation and unlimited data.
        </p>
      </motion.div>

      {/* Service selection tabs */}
      <div className="flex justify-center mb-12">
        <div className="glass p-1.5 rounded-full flex gap-3 border border-border/30 shadow-lg">
          <button
            onClick={() => setActiveService("bsnl")}
            className={`px-6 py-2.5 rounded-full text-sm font-semibold font-display tracking-wider transition-all cursor-pointer flex items-center gap-2.5 ${
              activeService === "bsnl" ? "gradient-gold text-background neon-gold font-bold" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <img src="/bsnl-logo.png" alt="BSNL Logo" className="h-6 w-auto object-contain" />
            <span>BSNL</span>
          </button>
          <button
            onClick={() => setActiveService("excell")}
            className={`px-6 py-2.5 rounded-full text-sm font-semibold font-display tracking-wider transition-all cursor-pointer flex items-center gap-2.5 ${
              activeService === "excell" ? "gradient-gold text-background neon-gold font-bold" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <img src="/excell-logo.png" alt="Excell Logo" className="h-6 w-auto object-contain rounded-full" />
            <span>EXCELL</span>
          </button>
        </div>
      </div>

      <>
          {/* Category filter */}
          <div className="flex flex-wrap gap-3 justify-center mb-12">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                data-testid={`filter-${cat}`}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
                  activeCategory === cat ? "gradient-gold text-background neon-gold" : "glass text-muted-foreground hover:text-foreground"
                }`}
              >
                {cat === "all" ? "All Plans" : planMeta[cat]?.label || cat}
              </button>
            ))}
          </div>

          {/* Plans grid by category */}
          {(["sd_tv", "hd_tv", "internet_only"] as const).map(cat => {
            if (grouped[cat].length === 0) return null;
            const meta = planMeta[cat];
            return (
              <motion.div
                key={cat}
                className="mb-14"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-10 h-10 rounded-xl glass flex items-center justify-center ${meta.badge}`}>
                    <meta.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="font-display text-xl font-bold text-foreground">{meta.label}</h2>
                    <p className="text-sm text-muted-foreground">{meta.subtitle}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {grouped[cat].map((plan, i) => (
                    <motion.div
                      key={plan.id}
                      className={`relative rounded-2xl bg-gradient-to-br ${meta.color} border ${meta.border} p-6 flex flex-col gap-5 transition-all hover:scale-[1.02]`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08 }}
                      whileHover={{ y: -4 }}
                      data-testid={`plan-detail-${plan.id}`}
                    >
                      {plan.isPopular && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                          <span className="gradient-gold text-background text-xs font-bold px-4 py-1 rounded-full font-display neon-gold">
                            MOST POPULAR
                          </span>
                        </div>
                      )}
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-display text-base font-semibold text-foreground">{plan.name}</p>
                          <div className="flex items-center gap-1.5 mt-1">
                            <Zap className="w-4 h-4 text-yellow-400" />
                            <span className="font-display text-2xl font-black text-foreground">{plan.speed}</span>
                            <span className="text-sm text-muted-foreground">Mbps</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-display text-3xl font-black text-primary">₹{plan.price}</p>
                          <p className="text-xs text-muted-foreground">/month</p>
                        </div>
                      </div>
                      <ul className="space-y-2 flex-1">
                        {[...plan.features, ...allFeatures.slice(0, Math.max(0, 5 - plan.features.length))].slice(0, 5).map((f, fi) => (
                          <li key={fi} className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Check className="w-4 h-4 text-primary shrink-0" />
                            {f}
                          </li>
                        ))}
                      </ul>
                      <div className="flex gap-2">
                        <Link href="/book">
                          <Button className="flex-1 gradient-gold border-0 text-background font-semibold hover:opacity-90" data-testid={`plan-buy-${plan.id}`}>
                            Buy Now <ChevronRight className="w-4 h-4 ml-1" />
                          </Button>
                        </Link>
                        <Link href="/login">
                          <Button variant="outline" className="border-primary/40 text-primary hover:bg-primary/10" data-testid={`plan-recharge-link-${plan.id}`}>
                            Recharge
                          </Button>
                        </Link>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </>

      {/* Compare banner */}
      <motion.div
        className="glass rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden mt-8"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5 pointer-events-none" />
        <h3 className="font-display text-2xl font-bold text-foreground mb-3">Not sure which plan is right for you?</h3>
        <p className="text-muted-foreground mb-6">Our support team is available 24x7 to help you choose the best plan for your needs.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/book">
            <Button className="gradient-gold border-0 text-background font-bold neon-gold" data-testid="plans-book-cta">
              Book Free Consultation
            </Button>
          </Link>
          <a href="tel:+919948046456">
            <Button variant="outline" className="border-accent/50 text-accent hover:bg-accent/10">
              Call +91 99480 46456
            </Button>
          </a>
        </div>
      </motion.div>
    </div>
  );
}
