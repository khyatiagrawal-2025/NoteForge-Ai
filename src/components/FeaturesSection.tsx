import { motion } from "framer-motion";
import { Brain, Shield, Zap, Mic, Users, TrendingUp, Cloud } from "lucide-react";
import { useState } from "react";

const features = [
  {
    icon: Mic,
    title: "Real-Time Transcription",
    desc: "98% accuracy across 100+ languages with live transcription and speaker identification.",
  },
  {
    icon: Brain,
    title: "AI Analysis",
    desc: "Advanced AI extracts action items, decisions, and insights automatically.",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    desc: "End-to-end encryption, SOC 2 compliant, GDPR ready with zero-knowledge architecture.",
  },
  {
    icon: Users,
    title: "Collaboration",
    desc: "Real-time collaboration with team members, shared notes, and role-based access.",
  },
  {
    icon: TrendingUp,
    title: "Smart Analytics",
    desc: "Track meeting trends, productivity metrics, and team performance over time.",
  },
  {
    icon: Cloud,
    title: "Cloud Sync",
    desc: "Seamless sync across all devices with automatic backups and version history.",
  },
];

const FeatureCard = ({ feature, index }: { feature: typeof features[0]; index: number }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative group cursor-pointer"
    >
      {/* Outer glow border on hover */}
      <div
        className={`absolute -inset-[1px] rounded-2xl transition-opacity duration-500 ${
          hovered ? "opacity-100" : "opacity-0"
        }`}
        style={{
          background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)), hsl(var(--secondary)))",
        }}
      />

      {/* Card body */}
      <div
        className={`relative rounded-2xl p-8 transition-all duration-500 ${
          hovered
            ? "bg-gradient-to-br from-primary/30 via-accent/20 to-secondary/20 -translate-y-2"
            : "bg-card"
        }`}
      >
        {/* Icon */}
        <motion.div
          animate={hovered ? { scale: 1.15, rotate: [0, -5, 5, 0] } : { scale: 1, rotate: 0 }}
          transition={{ duration: 0.4 }}
        >
          <feature.icon className="w-12 h-12 text-primary mb-6" />
        </motion.div>

        {/* Title */}
        <h3 className="font-display text-2xl font-bold mb-3 text-foreground">{feature.title}</h3>

        {/* Description */}
        <p className="text-muted-foreground font-body text-base leading-relaxed">{feature.desc}</p>

        {/* Bottom glow line */}
        <motion.div
          className="absolute bottom-0 left-[10%] right-[10%] h-[2px] rounded-full"
          style={{ background: "linear-gradient(90deg, transparent, hsl(var(--primary)), transparent)" }}
          initial={{ scaleX: 0, opacity: 0 }}
          animate={hovered ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
          transition={{ duration: 0.4 }}
        />
      </div>
    </motion.div>
  );
};

const FeaturesSection = () => (
  <section id="features" className="py-24 px-6 max-w-7xl mx-auto relative z-10">
    <motion.h2
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-4xl md:text-5xl font-black text-center fire-gradient-text mb-4"
    >
      POWERFUL FEATURES
    </motion.h2>
    <motion.p
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay: 0.2 }}
      className="text-center text-muted-foreground text-lg mb-16 max-w-2xl mx-auto font-body"
    >
      Everything you need for perfect meeting management
    </motion.p>

    <div className="grid md:grid-cols-3 gap-6">
      {features.map((f, i) => (
        <FeatureCard key={f.title} feature={f} index={i} />
      ))}
    </div>
  </section>
);

export default FeaturesSection;
