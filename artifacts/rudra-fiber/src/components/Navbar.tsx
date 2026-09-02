import { useState } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sun, Moon, Phone } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { Button } from "@/components/ui/button";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/plans", label: "Plans" },
  { href: "/book", label: "Book Connection" },
  { href: "/speed-test", label: "Speed Test" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [location] = useLocation();
  const { theme, toggle } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full glass-dark border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" data-testid="nav-logo">
            <div className="flex items-center gap-2.5 cursor-pointer">
              <img
                src="/vgiga-logo-rect.png"
                alt="VGIGA FIBER NET"
                className="h-10 sm:h-11 w-auto max-w-[140px] sm:max-w-[160px] object-contain rounded-lg border border-white/10 shadow-sm"
              />
              <div className="leading-tight">
                <span className="font-display text-sm sm:text-base font-bold gradient-text tracking-wider block">
                  VGIGA FIBER NET
                </span>
                <span className="text-[10px] text-muted-foreground tracking-widest">
                  ULTRA FAST CONNECTIVITY
                </span>
              </div>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <Link key={link.href} href={link.href}>
                <span
                  data-testid={`nav-link-${link.label.toLowerCase().replace(/ /g, "-")}`}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-all cursor-pointer ${
                    location === link.href
                      ? "text-primary neon-text-gold"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  {link.label}
                </span>
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <a
              href="tel:+919948046456"
              className="hidden sm:flex items-center gap-1.5 text-xs text-accent font-medium hover:text-accent/80 transition-colors"
              data-testid="nav-phone"
            >
              <Phone className="w-3.5 h-3.5" />
              +91 99480 46456
            </a>
            <Button variant="ghost" size="icon" onClick={toggle} data-testid="theme-toggle" className="hidden sm:flex">
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
            <Link href="/login">
              <Button
                size="sm"
                className="hidden md:flex gradient-gold border-0 text-background font-semibold hover:opacity-90 neon-gold transition-all"
                data-testid="nav-login-btn"
              >
                Customer Login
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
              data-testid="mobile-menu-btn"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass-dark border-t border-border/50"
          >
            <div className="px-4 py-3 space-y-1">
              {navLinks.map(link => (
                <Link key={link.href} href={link.href}>
                  <span
                    onClick={() => setMobileOpen(false)}
                    className={`block px-3 py-2.5 rounded-md text-sm font-medium cursor-pointer transition-all ${
                      location === link.href
                        ? "text-primary bg-primary/10"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    }`}
                  >
                    {link.label}
                  </span>
                </Link>
              ))}
              <div className="flex items-center justify-between pt-2 border-t border-border/30">
                <Link href="/login">
                  <Button
                    size="sm"
                    onClick={() => setMobileOpen(false)}
                    className="gradient-gold border-0 text-background font-semibold"
                  >
                    Customer Login
                  </Button>
                </Link>
                <Button variant="ghost" size="icon" onClick={toggle}>
                  {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
