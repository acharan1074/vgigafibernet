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
  { name: "Netflix",         logo: "https://upload.wikimedia.org/wikipedia/commons/7/7a/Logonetflix.png",                                                                           fallback: "N", bg: "#E50914" },
  { name: "Prime Video",     logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Amazon_Prime_Video_logo.svg/640px-Amazon_Prime_Video_logo.svg.png",              fallback: "P", bg: "#00A8E1" },
  { name: "JioHotstar",      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Jio_Hotstar_logo.svg/640px-Jio_Hotstar_logo.svg.png",                           fallback: "H", bg: "#1C1C76" },
  { name: "Aha",             logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Aha_OTT_logo.png/640px-Aha_OTT_logo.png",                                      fallback: "A", bg: "#CF0001" },
  { name: "Sun NXT",         logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Sun_NXT_logo.svg/640px-Sun_NXT_logo.svg.png",                                   fallback: "S", bg: "#FF6B00" },
  { name: "ZEE5",            logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/ZEE5_logo.svg/640px-ZEE5_logo.svg.png",                                         fallback: "Z", bg: "#6B3FA0" },
  { name: "Sony LIV",        logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Sony_LIV_2020.svg/640px-Sony_LIV_2020.svg.png",                                 fallback: "S", bg: "#0060FF" },
  { name: "JioCinema",       logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/JioCinema_2023_logo.svg/640px-JioCinema_2023_logo.svg.png",                     fallback: "J", bg: "#0033CC" },
  { name: "MX Player",       logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/MX_Player_logo.svg/640px-MX_Player_logo.svg.png",                               fallback: "M", bg: "#01B4E4" },
  { name: "YouTube",         logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/YouTube_full-color_icon_%282017%29.svg/640px-YouTube_full-color_icon_%282017%29.svg.png", fallback: "Y", bg: "#FF0000" },
  { name: "Manorama MAX",    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/Manorama_Max_logo.svg/640px-Manorama_Max_logo.svg.png",                          fallback: "M", bg: "#E31E24" },
  { name: "Lionsgate Play",  logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Lionsgate_Play_logo.svg/640px-Lionsgate_Play_logo.svg.png",                     fallback: "L", bg: "#111827" },
  { name: "Hungama Play",    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Hungama_Play_Logo.svg/640px-Hungama_Play_Logo.svg.png",                          fallback: "H", bg: "#FF0080" },
  { name: "ShemarooMe",      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/ShemarooMe_logo.svg/640px-ShemarooMe_logo.svg.png",                             fallback: "S", bg: "#FF6600" },
];

// Channel rows for the scrolling marquee — each row scrolls independently
const channelRows = [
  [
    { name: "Star Maa",       logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Star_Maa_logo.png/200px-Star_Maa_logo.png" },
    { name: "Zee Telugu",     logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Zee_Telugu_logo.svg/200px-Zee_Telugu_logo.svg.png" },
    { name: "ETV Telugu",     logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/ETV_Telugu_logo.svg/200px-ETV_Telugu_logo.svg.png" },
    { name: "Gemini TV",      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Gemini_TV_logo.svg/200px-Gemini_TV_logo.svg.png" },
    { name: "Colors Telugu",  logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/Colors_Telugu_logo.svg/200px-Colors_Telugu_logo.svg.png" },
    { name: "ETV Plus",       logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/ETV_Plus_logo.svg/200px-ETV_Plus_logo.svg.png" },
    { name: "Zee Cinemalu",   logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/Zee_Cinemalu_logo.svg/200px-Zee_Cinemalu_logo.svg.png" },
    { name: "Gemini Movies",  logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Gemini_Movies_logo.svg/200px-Gemini_Movies_logo.svg.png" },
    { name: "Sony Max",       logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Sony_MAX_Logo.svg/200px-Sony_MAX_Logo.svg.png" },
    { name: "Maa Movies",     logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Maa_Movies_Logo.png/200px-Maa_Movies_Logo.png" },
    { name: "Star Gold",      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/Star_Gold_logo.svg/200px-Star_Gold_logo.svg.png" },
    { name: "Star Movies",    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Star_Movies_logo.svg/200px-Star_Movies_logo.svg.png" },
  ],
  [
    { name: "TV9 Telugu",     logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/TV9_Telugu_logo.svg/200px-TV9_Telugu_logo.svg.png" },
    { name: "NTV",            logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/NTV_Telugu_logo.svg/200px-NTV_Telugu_logo.svg.png" },
    { name: "10TV",           logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/10TV_News_Logo.jpg/200px-10TV_News_Logo.jpg" },
    { name: "ABN Andhra Jyothy", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/ABN_Andhra_Jyothy_logo.svg/200px-ABN_Andhra_Jyothy_logo.svg.png" },
    { name: "HMTV",           logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/HMTV_logo.svg/200px-HMTV_logo.svg.png" },
    { name: "V6 News",        logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/V6_News_Logo.png/200px-V6_News_Logo.png" },
    { name: "Sakshi TV",      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/Sakshi_TV_logo.svg/200px-Sakshi_TV_logo.svg.png" },
    { name: "Mahaa TV",       logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Mahaa_TV_Logo.svg/200px-Mahaa_TV_Logo.svg.png" },
    { name: "iNews",          logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/INews_Telugu_logo.svg/200px-INews_Telugu_logo.svg.png" },
    { name: "T News",         logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/T_News_logo.svg/200px-T_News_logo.svg.png" },
    { name: "Studio N",       logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Studio_N_logo.svg/200px-Studio_N_logo.svg.png" },
    { name: "TV5 News",       logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/TV5_Telugu_Logo.svg/200px-TV5_Telugu_Logo.svg.png" },
  ],
  [
    { name: "YoYo TV",        logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/YoYo_TV_Channel_logo.jpg/200px-YoYo_TV_Channel_logo.jpg" },
    { name: "Bhakthi TV",     logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Bhakthi_TV_logo.svg/200px-Bhakthi_TV_logo.svg.png" },
    { name: "Aastha",         logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Aastha_channel.svg/200px-Aastha_channel.svg.png" },
    { name: "Star Vijay",     logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Star_Vijay_logo.svg/200px-Star_Vijay_logo.svg.png" },
    { name: "Sun TV",         logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bb/Sun_TV_logo.svg/200px-Sun_TV_logo.svg.png" },
    { name: "ZEE5",           logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/ZEE5_logo.svg/200px-ZEE5_logo.svg.png" },
    { name: "JioCinema",      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/JioCinema_2023_logo.svg/200px-JioCinema_2023_logo.svg.png" },
    { name: "Sony LIV",       logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Sony_LIV_2020.svg/200px-Sony_LIV_2020.svg.png" },
    { name: "Sun NXT",        logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Sun_NXT_logo.svg/200px-Sun_NXT_logo.svg.png" },
    { name: "MX Player",      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/MX_Player_logo.svg/200px-MX_Player_logo.svg.png" },
    { name: "Aha",            logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Aha_OTT_logo.png/200px-Aha_OTT_logo.png" },
    { name: "JioHotstar",     logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Jio_Hotstar_logo.svg/200px-Jio_Hotstar_logo.svg.png" },
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
                    className="glass mx-2 rounded-2xl flex flex-col items-center gap-2 p-3 w-24 shrink-0 hover:border-primary/40 transition-all"
                    data-testid={i < row.length ? `channel-logo-${ch.name.toLowerCase().replace(/ /g, "-")}` : undefined}
                  >
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-white/10 flex items-center justify-center">
                      <img
                        src={ch.logo}
                        alt={ch.name}
                        className="w-full h-full object-contain p-1"
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
                    <p className="text-[10px] text-center text-muted-foreground font-medium leading-tight line-clamp-2">{ch.name}</p>
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
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 gap-4">
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
                  className="w-14 h-14 rounded-xl overflow-hidden flex items-center justify-center"
                  style={{ background: app.bg }}
                >
                  <img
                    src={app.logo}
                    alt={app.name}
                    className="w-full h-full object-contain p-1.5"
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
                <p className="text-xs text-center text-muted-foreground font-medium leading-tight">{app.name}</p>
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

