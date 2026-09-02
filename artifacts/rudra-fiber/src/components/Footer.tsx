import { Link } from "wouter";
import { Phone, Mail, MapPin, Facebook, Youtube, Instagram } from "lucide-react";
import { SiWhatsapp } from "react-icons/si";

export default function Footer() {
  return (
    <footer className="bg-card/80 border-t border-border/50 mt-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/vgiga-logo-rect.png"
                alt="VGIGA FIBER NET"
                className="h-12 w-auto max-w-[170px] object-contain rounded-lg border border-white/10 shadow-sm"
              />
              <div>
                <p className="font-display font-bold gradient-text tracking-wider">VGIGA FIBER NET</p>
                <p className="text-xs text-muted-foreground">Ultra Fast Connectivity</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Delivering ultra-fast fiber broadband and 1000+ Telugu channels across Telangana.
            </p>
            <div className="flex gap-3">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full glass flex items-center justify-center text-muted-foreground hover:text-primary transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full glass flex items-center justify-center text-muted-foreground hover:text-primary transition-colors">
                <Youtube className="w-4 h-4" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full glass flex items-center justify-center text-muted-foreground hover:text-primary transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="https://wa.me/919948046456" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full glass flex items-center justify-center text-muted-foreground hover:text-[#25D366] transition-colors">
                <SiWhatsapp className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-sm font-semibold text-foreground mb-4 tracking-wider">QUICK LINKS</h4>
            <ul className="space-y-2">
              {[
                { href: "/", label: "Home" },
                { href: "/plans", label: "Internet & TV Plans" },
                { href: "/book", label: "Book Connection" },
                { href: "/login", label: "Customer Login" },
                { href: "/speed-test", label: "Speed Test" },
                { href: "/admin", label: "Admin Panel" },
              ].map(l => (
                <li key={l.href}>
                  <Link href={l.href}>
                    <span className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer">
                      {l.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Plans */}
          <div>
            <h4 className="font-display text-sm font-semibold text-foreground mb-4 tracking-wider">OUR PLANS</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>SD TV Plan — From ₹520/mo</li>
              <li>HD TV Plan — From ₹540/mo</li>
              <li>Internet Only — From ₹350/mo</li>
              <li>20 Mbps Plans</li>
              <li>30 Mbps Plans</li>
              <li>50 Mbps Plans</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-sm font-semibold text-foreground mb-4 tracking-wider">CONTACT US</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="w-4 h-4 text-primary shrink-0" />
                <a href="tel:+919948046456" className="hover:text-primary transition-colors">+91 99480 46456</a>
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <SiWhatsapp className="w-4 h-4 text-[#25D366] shrink-0" />
                <a href="https://wa.me/919948046456" className="hover:text-primary transition-colors">WhatsApp Support</a>
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="w-4 h-4 text-accent shrink-0" />
                <a href="mailto:vgigafibernet@gmail.com" className="hover:text-accent transition-colors">vgigafibernet@gmail.com</a>
              </li>
              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 text-chart-3 shrink-0 mt-0.5" />
                <span>Telangana, India</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © 2026 VGIGA FIBER NET. All rights reserved.
          </p>
          <div className="flex gap-4 text-xs text-muted-foreground">
            <span className="hover:text-primary cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-primary cursor-pointer transition-colors">Terms & Conditions</span>
            <span className="hover:text-primary cursor-pointer transition-colors">Refund Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
