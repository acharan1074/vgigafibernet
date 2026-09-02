import { useRef } from "react";
import { Link } from "wouter";
import { motion, useInView } from "framer-motion";
import { Zap, Tv, Shield, Headphones, Wifi, Play, ChevronRight, Star, Users, Award, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useListPlans } from "@workspace/api-client-react";

const speedCards = [
  { speed: "20 Mbps", color: "from-blue-500 to-cyan-400", desc: "Home Basic" },
  { speed: "30 Mbps", color: "from-cyan-400 to-teal-400", desc: "Home Plus" },
  { speed: "50 Mbps", color: "from-teal-400 to-green-400", desc: "Home Pro" },
  { speed: "100 Mbps", color: "from-yellow-400 to-orange-400", desc: "Power User" },
  { speed: "200 Mbps", color: "from-orange-400 to-red-400", desc: "Ultra Speed" },
  { speed: "1 Gbps", color: "from-purple-500 to-pink-500", desc: "Gigabit" },
];

const features = [
  { icon: Zap, title: "High-Speed Internet", desc: "Blazing fast fiber speeds up to 1 Gbps", color: "text-yellow-400" },
  { icon: Wifi, title: "Unlimited Data", desc: "No data caps, stream all you want", color: "text-cyan-400" },
  { icon: Award, title: "Free Installation", desc: "Professional setup at zero cost", color: "text-green-400" },
  { icon: Headphones, title: "24x7 Support", desc: "Round-the-clock customer care", color: "text-blue-400" },
  { icon: Play, title: "OTT Entertainment", desc: "Netflix, Prime, Hotstar & more", color: "text-red-400" },
  { icon: Tv, title: "1000+ Telugu Channels", desc: "Exclusive Telugu & regional content", color: "text-orange-400" },
  { icon: Zap, title: "Low Ping Gaming", desc: "Sub-10ms latency for gamers", color: "text-purple-400" },
  { icon: Users, title: "Business Connectivity", desc: "Dedicated lines for enterprises", color: "text-teal-400" },
  { icon: Shield, title: "Secure Network", desc: "Enterprise-grade fiber security", color: "text-pink-400" },
];

const ottApps = [
  { name: "Netflix",         logo: "/logos/netflix.svg",      fallback: "N", bg: "#000000" },
  { name: "Prime Video",     logo: "/logos/primevideo.svg",   fallback: "P", bg: "#0F172A" },
  { name: "JioHotstar",      logo: "/logos/hotstar.png",      fallback: "H", bg: "#0F1035" },
  { name: "Aha",             logo: "/logos/aha.png",          fallback: "A", bg: "#D92200" },
  { name: "Sun NXT",         logo: "/logos/sunnxt.png",       fallback: "S", bg: "#0D0D11" },
  { name: "ZEE5",            logo: "/logos/zee5.png",         fallback: "Z", bg: "#180A2E" },
  { name: "Sony LIV",        logo: "/logos/sonyliv.png",      fallback: "S", bg: "#0A0A14" },
  { name: "JioCinema",       logo: "/logos/jiocinema.png",    fallback: "J", bg: "#93005A" },
  { name: "MX Player",       logo: "/logos/mxplayer.png",     fallback: "M", bg: "#0033AA" },
  { name: "YouTube",         logo: "/logos/youtube.png",      fallback: "Y", bg: "#FF0000" },
  { name: "Discovery+",      logo: "/logos/discoveryplus.png",fallback: "D", bg: "#002D40" },
  { name: "Lionsgate Play",  logo: "/logos/lionsgate.svg",    fallback: "L", bg: "#0B0E14" },
  { name: "Hungama Play",    logo: "/logos/hungama.png",      fallback: "H", bg: "#99004C" },
  { name: "ShemarooMe",      logo: "/logos/shemaroome.png",   fallback: "S", bg: "#CC4400" },
];

// Channel rows for the scrolling marquee — each row scrolls independently
const channelRows = [
  [
    { name: "Star Maa",       logo: "/logos/starmaa.png" },
    { name: "Zee Telugu",     logo: "/logos/zeetelugu.png" },
    { name: "ETV Telugu",     logo: "/logos/etv.png" },
    { name: "Gemini TV",      logo: "/logos/gemini.png" },
    { name: "Colors Telugu",  logo: "/logos/colors.png" },
    { name: "ETV Plus",       logo: "/logos/etvplus.png" },
    { name: "Zee Cinemalu",   logo: "/logos/zeecinemalu.png" },
    { name: "Gemini Movies",  logo: "/logos/geminimovies.png" },
    { name: "Sony Max",       logo: "/logos/sonymax.png" },
    { name: "Maa Movies",     logo: "/logos/maamovies.png" },
    { name: "Star Gold",      logo: "/logos/stargold.png" },
    { name: "Star Movies",    logo: "/logos/starmovies.png" },
  ],
  [
    { name: "TV9 Telugu",     logo: "/logos/tv9.png" },
    { name: "NTV",            logo: "/logos/ntv.png" },
    { name: "10TV",           logo: "/logos/10tv.png" },
    { name: "ABN Andhra Jyothy", logo: "/logos/abn.png" },
    { name: "HMTV",           logo: "/logos/hmtv.png" },
    { name: "V6 News",        logo: "/logos/v6.png" },
    { name: "Sakshi TV",      logo: "/logos/sakshi.png" },
    { name: "Mahaa TV",       logo: "/logos/mahaa.svg" },
    { name: "iNews",          logo: "/logos/inews.png" },
    { name: "T News",         logo: "/logos/tnews.png" },
    { name: "Studio N",       logo: "/logos/studion.svg" },
    { name: "TV5 News",       logo: "/logos/tv5.png" },
  ],
  [
    { name: "YoYo TV",        logo: "/logos/yoyo.png" },
    { name: "Bhakthi TV",     logo: "/logos/bhakthi.png" },
    { name: "Aastha",         logo: "/logos/aastha.svg" },
    { name: "Star Vijay",     logo: "/logos/starvijay.png" },
    { name: "Sun TV",         logo: "/logos/suntv.png" },
    { name: "ZEE5",           logo: "/logos/zee5.png" },
    { name: "JioCinema",      logo: "/logos/jiocinema.png" },
    { name: "Sony LIV",       logo: "/logos/sonyliv.png" },
    { name: "Sun NXT",        logo: "/logos/sunnxt.png" },
    { name: "MX Player",      logo: "/logos/mxplayer.png" },
    { name: "Aha",            logo: "/logos/aha.png" },
    { name: "JioHotstar",     logo: "/logos/hotstar.png" },
  ],
];

const stats = [
  { value: "50,000+", label: "Active Customers", icon: Users },
  { value: "99.9%", label: "Uptime Guarantee", icon: Shield },
  { value: "1 Gbps", label: "Max Speed", icon: Zap },
  { value: "24x7", label: "Support Available", icon: Clock },
];

function FiberBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Dark gradient base */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-blue-950/30" />
      {/* Animated fiber streaks */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute h-px"
          style={{
            top: `${10 + i * 12}%`,
            left: 0,
            right: 0,
            background: i % 2 === 0
              ? "linear-gradient(90deg, transparent, hsl(38 92% 50% / 0.6), transparent)"
              : "linear-gradient(90deg, transparent, hsl(185 100% 50% / 0.5), transparent)",
          }}
          animate={{ x: ["-100%", "100%"] }}
          transition={{ duration: 3 + i * 0.7, repeat: Infinity, delay: i * 0.4, ease: "linear" }}
        />
      ))}
      {/* Glowing orbs */}
      <motion.div
        className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full opacity-10"
        style={{ background: "radial-gradient(circle, hsl(38 92% 50%), transparent)" }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.08, 0.15, 0.08] }}
        transition={{ duration: 4, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-1/4 left-1/4 w-64 h-64 rounded-full opacity-10"
        style={{ background: "radial-gradient(circle, hsl(185 100% 50%), transparent)" }}
        animate={{ scale: [1, 1.3, 1], opacity: [0.06, 0.12, 0.06] }}
        transition={{ duration: 5, repeat: Infinity, delay: 1 }}
      />
      {/* Floating particles */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={`p${i}`}
          className="absolute w-1 h-1 rounded-full"
          style={{
            left: `${(i * 8) % 100}%`,
            top: `${(i * 13) % 80 + 10}%`,
            background: i % 3 === 0 ? "hsl(38 92% 50%)" : i % 3 === 1 ? "hsl(185 100% 50%)" : "hsl(24 95% 55%)",
          }}
          animate={{
            y: [-10, 10, -10],
            x: [-5, 5, -5],
            opacity: [0.4, 1, 0.4],
          }}
          transition={{ duration: 3 + i * 0.3, repeat: Infinity, delay: i * 0.2 }}
        />
      ))}
    </div>
  );
}



export default function Home() {
  const { data: plans } = useListPlans();
  const featuresRef = useRef(null);
  const plansRef = useRef(null);
  const channelRef = useRef(null);
  const ottRef = useRef(null);
  const featuresInView = useInView(featuresRef, { once: true, margin: "-100px" });
  const plansInView = useInView(plansRef, { once: true, margin: "-100px" });
  const channelInView = useInView(channelRef, { once: true, margin: "-100px" });
  const ottInView = useInView(ottRef, { once: true, margin: "-100px" });


  return (
    <div className="w-full">
      {/* HERO */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <FiberBackground />
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Badge className="mb-6 gradient-cyan border-0 text-background font-semibold px-4 py-1.5 text-xs tracking-widest font-display">
              TELANGANA
            </Badge>
          </motion.div>
          <motion.h1
            className="font-display text-3xl sm:text-5xl lg:text-6xl font-black leading-tight mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <span className="gradient-text neon-text-gold">Ultra Fast</span>
            <br />
            <span className="text-foreground">Fiber Internet</span>
            <br />
            <span className="text-accent neon-text-cyan">& TV Services</span>
          </motion.h1>
          <motion.p
            className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto mb-10 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Unlimited High-Speed Broadband with 1000+ Telugu Channels, OTT Apps & Free Installation
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Link href="/book">
              <Button size="lg" className="gradient-gold border-0 text-background font-bold text-base px-8 neon-gold hover:opacity-90 transition-all" data-testid="hero-book-btn">
                Book New Connection
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
            <Link href="/plans">
              <Button size="lg" variant="outline" className="border-accent/50 text-accent hover:bg-accent/10 font-semibold text-base px-8 neon-cyan" data-testid="hero-plans-btn">
                View Plans
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="ghost" className="text-muted-foreground hover:text-foreground" data-testid="hero-support-btn">
                Contact Support
              </Button>
            </Link>
          </motion.div>

          {/* Speed Cards */}
          <motion.div
            className="mt-16 grid grid-cols-3 sm:grid-cols-6 gap-3"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {speedCards.map((card, i) => (
              <motion.div
                key={card.speed}
                className="glass rounded-xl p-3 text-center"
                whileHover={{ scale: 1.08, y: -4 }}
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 2 + i * 0.3, repeat: Infinity, delay: i * 0.2 }}
                data-testid={`speed-card-${card.speed.replace(" ", "-")}`}
              >
                <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${card.color} mx-auto mb-2 flex items-center justify-center`}>
                  <Zap className="w-4 h-4 text-white" />
                </div>
                <p className="font-display text-xs font-bold text-foreground leading-tight">{card.speed}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{card.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-12 bg-card/30 border-y border-border/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <p className="font-display text-2xl sm:text-3xl font-black gradient-text">{stat.value}</p>
                <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PLANS SECTION */}
      <section ref={plansRef} id="plans" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={plansInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <Badge className="mb-4 bg-primary/20 text-primary border-primary/30 font-display tracking-wider">PRICING PLANS</Badge>
          <h2 className="font-display text-3xl sm:text-4xl font-black text-foreground mb-3">
            Choose Your <span className="gradient-text">Perfect Plan</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto mb-8">Affordable high-speed internet and TV packages for every home and business</p>
          <Link href="/plans">
            <Button className="gradient-gold border-0 text-background font-bold neon-gold py-6 px-8 text-base" data-testid="view-all-plans-btn">
              View All Plans <ChevronRight className="w-5 h-5 ml-1" />
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* FEATURES */}
      <section ref={featuresRef} className="py-20 bg-card/20 border-y border-border/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={featuresInView ? { opacity: 1, y: 0 } : {}}
          >
            <Badge className="mb-4 bg-accent/20 text-accent border-accent/30 font-display tracking-wider">WHY CHOOSE US</Badge>
            <h2 className="font-display text-3xl sm:text-4xl font-black text-foreground mb-3">
              <span className="text-accent neon-text-cyan">Premium Features</span> Included
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((feat, i) => (
              <motion.div
                key={feat.title}
                className="glass rounded-2xl p-6 flex gap-4 hover:neon-gold transition-all group"
                initial={{ opacity: 0, y: 20 }}
                animate={featuresInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.07 }}
                whileHover={{ scale: 1.02 }}
                data-testid={`feature-card-${feat.title.toLowerCase().replace(/ /g, "-")}`}
              >
                <div className={`w-12 h-12 rounded-xl glass flex items-center justify-center shrink-0 ${feat.color}`}>
                  <feat.icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">{feat.title}</h3>
                  <p className="text-sm text-muted-foreground">{feat.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TV CHANNELS */}
      <section ref={channelRef} className="py-20 overflow-hidden">
        <motion.div
          className="text-center mb-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          initial={{ opacity: 0, y: 20 }}
          animate={channelInView ? { opacity: 1, y: 0 } : {}}
        >
          <Badge className="mb-4 bg-orange-500/20 text-orange-300 border-orange-500/30 font-display tracking-wider">TV CHANNELS</Badge>
          <h2 className="font-display text-3xl sm:text-4xl font-black text-foreground mb-3">
            1000+ <span className="gradient-text">Telugu Channels</span>
          </h2>
          <p className="text-muted-foreground">Entertainment, news, movies, devotional and more</p>
        </motion.div>

        <div className="space-y-4">
          {channelRows.map((row, rowIdx) => (
            <motion.div
              key={rowIdx}
              className="overflow-hidden"
              initial={{ opacity: 0, x: rowIdx % 2 === 0 ? -40 : 40 }}
              animate={channelInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: rowIdx * 0.15, duration: 0.6 }}
            >
              <div className={`marquee-track ${rowIdx % 2 === 0 ? "animate-marquee-ltr" : "animate-marquee-rtl"}`}>
                {[...row, ...row].map((ch, i) => (
                  <div
                    key={`${ch.name}-${i}`}
                    className="glass mx-2.5 rounded-2xl flex flex-col items-center gap-2.5 p-3.5 w-28 shrink-0 hover:border-primary/50 hover:scale-105 transition-all shadow-md"
                    data-testid={i < row.length ? `channel-logo-${ch.name.toLowerCase().replace(/ /g, "-")}` : undefined}
                  >
                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-black/40 border border-white/10 flex items-center justify-center p-1 shadow-inner">
                      <img
                        src={ch.logo}
                        alt={ch.name}
                        className="w-full h-full object-contain rounded-lg"
                        onError={(e) => {
                          const t = e.currentTarget;
                          t.style.display = "none";
                          const fallback = t.nextElementSibling as HTMLElement | null;
                          if (fallback) fallback.style.display = "flex";
                        }}
                      />
                      <span
                        className="text-foreground font-bold font-display text-sm hidden w-full h-full items-center justify-center"
                        aria-hidden="true"
                      >
                        {ch.name.charAt(0)}
                      </span>
                    </div>
                    <p className="text-[11px] text-center text-foreground font-semibold leading-tight line-clamp-1">{ch.name}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* OTT APPS */}
      <section ref={ottRef} className="py-20 bg-card/20 border-y border-border/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={ottInView ? { opacity: 1, y: 0 } : {}}
          >
            <Badge className="mb-4 bg-purple-500/20 text-purple-300 border-purple-500/30 font-display tracking-wider">OTT PLATFORMS</Badge>
            <h2 className="font-display text-3xl sm:text-4xl font-black text-foreground mb-3">
              Stream Your <span className="gradient-text">Favorites</span>
            </h2>
            <p className="text-muted-foreground">All major streaming platforms included with select plans</p>
          </motion.div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
            {ottApps.map((app, i) => (
              <motion.div
                key={app.name}
                className="glass rounded-2xl p-4 flex flex-col items-center gap-3 hover:neon-cyan transition-all cursor-default"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={ottInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -4, scale: 1.06 }}
                data-testid={`ott-card-${app.name.toLowerCase().replace(/ /g, "-")}`}
              >
                <div
                  className="w-16 h-16 rounded-2xl overflow-hidden flex items-center justify-center shadow-lg p-1"
                  style={{ background: app.bg }}
                >
                  <img
                    src={app.logo}
                    alt={app.name}
                    className="w-full h-full object-contain rounded-xl"
                    onError={(e) => {
                      const t = e.currentTarget;
                      t.style.display = "none";
                      const fb = t.nextElementSibling as HTMLElement | null;
                      if (fb) fb.style.display = "flex";
                    }}
                  />
                  <span
                    className="text-white font-bold font-display text-xl hidden w-full h-full items-center justify-center"
                    aria-hidden="true"
                  >
                    {app.fallback}
                  </span>
                </div>
                <p className="text-xs text-center text-foreground font-semibold leading-tight">{app.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          className="glass rounded-3xl p-10 sm:p-16 relative overflow-hidden"
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 pointer-events-none" />
          <h2 className="font-display text-2xl sm:text-4xl font-black text-foreground mb-4 relative z-10">
            Ready for <span className="gradient-text">Blazing Fast</span> Internet?
          </h2>
          <p className="text-muted-foreground mb-8 relative z-10">Get connected today. Free installation, same-day activation in most areas.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
            <Link href="/book">
              <Button size="lg" className="gradient-gold border-0 text-background font-bold text-base px-10 neon-gold" data-testid="cta-book-btn">
                Book Free Installation
              </Button>
            </Link>
            <a href="tel:+919948046456">
              <Button size="lg" variant="outline" className="border-accent/50 text-accent hover:bg-accent/10 font-semibold px-10">
                Call +91 99480 46456
              </Button>
            </a>
          </div>
        </motion.div>
      </section>
    </div>
  );
}

