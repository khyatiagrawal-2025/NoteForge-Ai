import { useState } from "react";
import { Flame, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "Features", href: "#features" },
  { label: "Integrations", href: "#integrations" },
  { label: "Security", href: "#security" },
  { label: "Dashboard", href: "#dashboard" },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const scrollTo = (href: string) => {
    const el = document.querySelector(href);
    el?.scrollIntoView({ behavior: "smooth" });
    setMobileOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 border-b-2 border-primary bg-background/95 backdrop-blur-xl shadow-[0_4px_30px_hsl(var(--primary)/0.3)]">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <button onClick={() => scrollTo("#home")} className="flex items-center gap-2 group">
          <Flame className="w-8 h-8 text-primary group-hover:drop-shadow-[0_0_15px_hsl(var(--primary))] transition-all" />
          <span className="font-display text-2xl font-black fire-gradient-text">NoteForge AI</span>
        </button>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => scrollTo(link.href)}
              className="font-body font-semibold text-foreground hover:text-primary transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-gradient-to-r after:from-primary after:to-accent hover:after:w-full after:transition-all"
            >
              {link.label}
            </button>
          ))}
          <Button onClick={() => scrollTo("#dashboard")} className="fire-gradient-bg border-0 font-display text-sm uppercase tracking-wider fire-glow hover:scale-105 transition-transform">
            Try Now
          </Button>
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden text-primary" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-background/98 backdrop-blur-xl px-6 py-6 space-y-4">
          {navLinks.map((link) => (
            <button key={link.href} onClick={() => scrollTo(link.href)} className="block w-full text-left font-body font-semibold text-lg text-foreground hover:text-primary transition-colors">
              {link.label}
            </button>
          ))}
          <Button onClick={() => scrollTo("#dashboard")} className="w-full fire-gradient-bg border-0 font-display">
            Try Now
          </Button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
