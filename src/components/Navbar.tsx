import { useState } from "react";
import { Flame, Menu, X, LogIn, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "Features", href: "#features" },
  { label: "Integrations", href: "#integrations" },
  { label: "Security", href: "#security" },
  { label: "Dashboard", href: "#dashboard" },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, signOut, loading } = useAuth();
  const navigate = useNavigate();

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
          {!loading && (
            user ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground font-body flex items-center gap-1">
                  <User className="w-4 h-4" />
                  {user.user_metadata?.full_name || user.email?.split("@")[0]}
                </span>
                <Button onClick={signOut} variant="outline" size="sm" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground font-display text-xs uppercase tracking-wider">
                  <LogOut className="w-3 h-3 mr-1" /> Sign Out
                </Button>
              </div>
            ) : (
              <Button onClick={() => navigate("/auth")} className="fire-gradient-bg border-0 font-display text-sm uppercase tracking-wider fire-glow hover:scale-105 transition-transform">
                <LogIn className="w-4 h-4 mr-1" /> Sign In
              </Button>
            )
          )}
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
          {!loading && (
            user ? (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground font-body flex items-center gap-1">
                  <User className="w-4 h-4" />
                  {user.user_metadata?.full_name || user.email?.split("@")[0]}
                </p>
                <Button onClick={signOut} variant="outline" className="w-full border-primary text-primary font-display">
                  <LogOut className="w-4 h-4 mr-1" /> Sign Out
                </Button>
              </div>
            ) : (
              <Button onClick={() => { navigate("/auth"); setMobileOpen(false); }} className="w-full fire-gradient-bg border-0 font-display">
                <LogIn className="w-4 h-4 mr-1" /> Sign In
              </Button>
            )
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
