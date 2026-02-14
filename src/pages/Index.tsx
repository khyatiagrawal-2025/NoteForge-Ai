import FireBackground from "@/components/FireBackground";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import IntegrationsSection from "@/components/IntegrationsSection";
import SecuritySection from "@/components/SecuritySection";
import Dashboard from "@/components/Dashboard";
import { ShieldCheck } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <FireBackground />
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <IntegrationsSection />
      <SecuritySection />
      <Dashboard />

      {/* Privacy badge */}
      <div className="fixed bottom-6 left-6 z-50 bg-card border-2 border-primary rounded-full px-4 py-2 flex items-center gap-2 text-sm font-bold text-primary shadow-[0_0_20px_hsl(var(--primary)/0.4)] animate-pulse">
        <ShieldCheck className="w-4 h-4" />
        <span className="font-body">100% Private & Secure</span>
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border py-8 text-center text-muted-foreground font-body">
        <p>© {new Date().getFullYear()} NoteForge AI. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Index;
