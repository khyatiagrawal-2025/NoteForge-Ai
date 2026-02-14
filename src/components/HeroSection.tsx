import { motion } from "framer-motion";
import { Rocket, Play, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const highlights = ["Instant AI Analysis", "Smart Extraction", "100% Secure"];

const HeroSection = () => {
  const scrollTo = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="home" className="min-h-screen flex items-center justify-center text-center px-6 py-20 relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-5xl"
      >
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 fire-gradient-text leading-tight fire-glow-text">
          IGNITE YOUR PRODUCTIVITY
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground font-body font-medium mb-8 max-w-3xl mx-auto">
          AI-Powered Meeting Intelligence | Smart Analysis | Instant Organization
        </p>

        <div className="flex flex-wrap justify-center gap-6 mb-10">
          {highlights.map((h) => (
            <div key={h} className="flex items-center gap-2 text-foreground font-body text-lg">
              <CheckCircle className="w-5 h-5 text-primary" />
              <span>{h}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          <Button
            size="lg"
            onClick={() => scrollTo("#dashboard")}
            className="fire-gradient-bg border-0 font-display uppercase tracking-wider text-lg px-8 py-6 fire-glow hover:scale-105 transition-transform"
          >
            <Rocket className="w-5 h-5 mr-2" /> Try Now Free
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-primary text-primary font-display uppercase tracking-wider text-lg px-8 py-6 hover:bg-primary/10 transition-colors"
          >
            <Play className="w-5 h-5 mr-2" /> Watch Demo
          </Button>
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
