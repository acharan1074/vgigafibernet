import { Link } from "wouter";
import { motion } from "framer-motion";
import { Wifi, Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-px"
            style={{
              top: `${20 + i * 15}%`,
              left: 0, right: 0,
              background: "linear-gradient(90deg, transparent, hsl(38 92% 50% / 0.3), transparent)",
            }}
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 4 + i * 0.5, repeat: Infinity, delay: i * 0.4, ease: "linear" }}
          />
        ))}
      </div>

      <motion.div
        className="text-center relative z-10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          className="w-24 h-24 rounded-3xl gradient-gold mx-auto mb-6 flex items-center justify-center neon-gold"
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Wifi className="w-12 h-12 text-background" />
        </motion.div>
        <h1 className="font-display text-8xl font-black gradient-text mb-4">404</h1>
        <h2 className="font-display text-2xl font-bold text-foreground mb-3">Signal Lost</h2>
        <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
          The page you're looking for has gone offline. Let's get you back on the network.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <Button className="gradient-gold border-0 text-background font-bold neon-gold" data-testid="404-home-btn">
              <Home className="w-4 h-4 mr-2" /> Go Home
            </Button>
          </Link>
          <Button variant="outline" onClick={() => window.history.back()} className="border-primary/40 text-primary hover:bg-primary/10" data-testid="404-back-btn">
            <ArrowLeft className="w-4 h-4 mr-2" /> Go Back
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
