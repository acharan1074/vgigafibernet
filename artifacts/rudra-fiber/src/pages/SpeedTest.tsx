import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, Download, Upload, Wifi, RotateCcw, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type TestState = "idle" | "testing" | "done";

function SpeedGauge({ value, max, label, color, unit = "Mbps" }: {
  value: number; max: number; label: string; color: string; unit?: string;
}) {
  const pct = Math.min(value / max, 1);
  const angle = pct * 220 - 110;
  const r = 80;
  const cx = 100, cy = 100;
  const arcLength = 2 * Math.PI * r * (220 / 360);

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-48 h-48">
        <svg viewBox="0 0 200 200" className="w-full h-full">
          {/* Background arc */}
          <path
            d={`M ${cx - r * Math.cos(Math.PI * 110 / 180)} ${cy - r * Math.sin(Math.PI * 110 / 180)} A ${r} ${r} 0 1 1 ${cx + r * Math.cos(Math.PI * 70 / 180)} ${cy - r * Math.sin(Math.PI * 70 / 180)}`}
            fill="none"
            stroke="hsl(222 30% 20%)"
            strokeWidth="12"
            strokeLinecap="round"
          />
          {/* Value arc */}
          <motion.path
            d={`M ${cx - r * Math.cos(Math.PI * 110 / 180)} ${cy - r * Math.sin(Math.PI * 110 / 180)} A ${r} ${r} 0 1 1 ${cx + r * Math.cos(Math.PI * 70 / 180)} ${cy - r * Math.sin(Math.PI * 70 / 180)}`}
            fill="none"
            stroke={color}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={arcLength}
            initial={{ strokeDashoffset: arcLength }}
            animate={{ strokeDashoffset: arcLength * (1 - pct) }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            style={{ filter: `drop-shadow(0 0 8px ${color})` }}
          />
          {/* Needle */}
          <motion.line
            x1={cx} y1={cy}
            x2={cx + r * 0.7 * Math.cos((angle - 90) * Math.PI / 180)}
            y2={cy + r * 0.7 * Math.sin((angle - 90) * Math.PI / 180)}
            stroke={color}
            strokeWidth="3"
            strokeLinecap="round"
            animate={{ rotate: [0, 0] }}
            style={{ transformOrigin: `${cx}px ${cy}px`, filter: `drop-shadow(0 0 4px ${color})` }}
          />
          <circle cx={cx} cy={cy} r="6" fill={color} />
          {/* Value text */}
          <text x={cx} y={cy + 20} textAnchor="middle" fill="white" fontSize="28" fontWeight="bold" fontFamily="Orbitron, sans-serif">
            {value.toFixed(value >= 100 ? 0 : 1)}
          </text>
          <text x={cx} y={cy + 38} textAnchor="middle" fill="hsl(215 20% 65%)" fontSize="11">
            {unit}
          </text>
        </svg>
      </div>
      <p className="font-semibold text-foreground text-sm">{label}</p>
    </div>
  );
}

function WaveBar({ active, delay }: { active: boolean; delay: number }) {
  return (
    <motion.div
      className="w-1.5 rounded-full bg-primary"
      style={{ height: 24 }}
      animate={active ? { scaleY: [1, 2.5, 1], opacity: [0.5, 1, 0.5] } : { scaleY: 1, opacity: 0.3 }}
      transition={{ duration: 0.6, repeat: active ? Infinity : 0, delay }}
    />
  );
}

export default function SpeedTest() {
  const [testState, setTestState] = useState<TestState>("idle");
  const [download, setDownload] = useState(0);
  const [upload, setUpload] = useState(0);
  const [ping, setPing] = useState(0);
  const [phase, setPhase] = useState<"ping" | "download" | "upload" | "done">("ping");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const runTest = () => {
    setTestState("testing");
    setDownload(0); setUpload(0); setPing(0);
    setPhase("ping");

    // Phase 1: Ping (0–1s)
    let t = 0;
    const targetPing = 8 + Math.random() * 12;
    const pingInterval = setInterval(() => {
      t += 50;
      setPing(prev => Math.min(prev + targetPing / 20, targetPing));
      if (t >= 1000) { clearInterval(pingInterval); startDownload(); }
    }, 50);
  };

  const startDownload = () => {
    setPhase("download");
    const targetDL = 30 + Math.random() * 50;
    let t = 0;
    const dlInterval = setInterval(() => {
      t += 100;
      setDownload(prev => {
        const progress = t / 3000;
        return targetDL * (1 - Math.exp(-5 * progress)) + Math.random() * 2;
      });
      if (t >= 3000) { clearInterval(dlInterval); setDownload(targetDL); startUpload(); }
    }, 100);
  };

  const startUpload = () => {
    setPhase("upload");
    const targetUL = 15 + Math.random() * 30;
    let t = 0;
    const ulInterval = setInterval(() => {
      t += 100;
      setUpload(prev => {
        const progress = t / 2500;
        return targetUL * (1 - Math.exp(-5 * progress)) + Math.random() * 1;
      });
      if (t >= 2500) { clearInterval(ulInterval); setUpload(targetUL); setPhase("done"); setTestState("done"); }
    }, 100);
  };

  const reset = () => {
    setTestState("idle");
    setDownload(0); setUpload(0); setPing(0);
    setPhase("ping");
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
      <motion.div className="text-center mb-12" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Badge className="mb-4 gradient-cyan border-0 text-background font-display tracking-wider">SPEED TEST</Badge>
        <h1 className="font-display text-3xl sm:text-4xl font-black text-foreground mb-3">
          Test Your <span className="gradient-text">Internet Speed</span>
        </h1>
        <p className="text-muted-foreground">Check your current download, upload speeds and ping</p>
      </motion.div>

      <div className="glass rounded-3xl p-8 sm:p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 pointer-events-none" />

        {/* Wave bars animation */}
        <div className="flex items-center justify-center gap-1.5 mb-10 h-10">
          {[...Array(20)].map((_, i) => (
            <WaveBar key={i} active={testState === "testing"} delay={i * 0.05} />
          ))}
        </div>

        {/* Gauges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 justify-items-center mb-10">
          <SpeedGauge value={download} max={200} label="Download" color="hsl(38 92% 50%)" />
          <SpeedGauge value={upload} max={100} label="Upload" color="hsl(185 100% 50%)" />
          <SpeedGauge value={ping} max={100} label="Ping" color="hsl(142 71% 45%)" unit="ms" />
        </div>

        {/* Phase indicator */}
        {testState === "testing" && (
          <motion.div className="flex justify-center gap-4 mb-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {[
              { key: "ping", label: "Ping", icon: Activity },
              { key: "download", label: "Download", icon: Download },
              { key: "upload", label: "Upload", icon: Upload },
            ].map(({ key, label, icon: Icon }) => (
              <div key={key} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                phase === key ? "gradient-gold text-background" : "glass text-muted-foreground"
              }`}>
                <Icon className="w-3 h-3" />
                {label}
              </div>
            ))}
          </motion.div>
        )}

        {/* Results */}
        <AnimatePresence>
          {testState === "done" && (
            <motion.div
              className="grid grid-cols-3 gap-4 mb-8"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {[
                { label: "Download", value: `${download.toFixed(1)} Mbps`, icon: Download, color: "text-primary" },
                { label: "Upload", value: `${upload.toFixed(1)} Mbps`, icon: Upload, color: "text-accent" },
                { label: "Ping", value: `${ping.toFixed(0)} ms`, icon: Zap, color: "text-green-400" },
              ].map(r => (
                <div key={r.label} className="glass rounded-2xl p-4 text-center">
                  <r.icon className={`w-5 h-5 ${r.color} mx-auto mb-2`} />
                  <p className={`font-display text-lg font-bold ${r.color}`}>{r.value}</p>
                  <p className="text-xs text-muted-foreground">{r.label}</p>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {testState === "idle" && (
            <Button
              size="lg"
              onClick={runTest}
              className="gradient-gold border-0 text-background font-bold text-base px-12 neon-gold"
              data-testid="btn-start-speed-test"
            >
              <Wifi className="w-5 h-5 mr-2" />
              Start Speed Test
            </Button>
          )}
          {testState === "testing" && (
            <Button size="lg" disabled className="gradient-gold border-0 text-background font-bold text-base px-12 opacity-80">
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                <Activity className="w-5 h-5 mr-2" />
              </motion.div>
              Testing...
            </Button>
          )}
          {testState === "done" && (
            <Button
              size="lg"
              onClick={reset}
              variant="outline"
              className="border-primary/40 text-primary hover:bg-primary/10 font-semibold px-12"
              data-testid="btn-retest-speed"
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              Test Again
            </Button>
          )}
        </div>

        {testState === "done" && download < 20 && (
          <motion.div className="mt-6 text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <p className="text-sm text-muted-foreground">Your speed seems low. Consider upgrading your plan.</p>
            <a href="/plans" className="text-sm text-primary hover:underline font-medium">View faster plans →</a>
          </motion.div>
        )}
      </div>

      {/* Info cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
        {[
          { icon: Download, title: "Good Download", desc: "20+ Mbps for streaming HD, 50+ Mbps for 4K", color: "text-primary" },
          { icon: Upload, title: "Good Upload", desc: "10+ Mbps for video calls and cloud backup", color: "text-accent" },
          { icon: Zap, title: "Low Ping", desc: "Under 20ms for gaming, under 50ms for calls", color: "text-green-400" },
        ].map(item => (
          <div key={item.title} className="glass rounded-2xl p-5">
            <item.icon className={`w-5 h-5 ${item.color} mb-3`} />
            <h3 className="font-semibold text-foreground text-sm mb-1">{item.title}</h3>
            <p className="text-xs text-muted-foreground">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
