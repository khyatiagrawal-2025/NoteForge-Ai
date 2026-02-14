import { motion } from "framer-motion";
import { Brain, Shield, Zap } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI Analysis",
    desc: "Advanced AI automatically extracts action items, decisions, and insights with high accuracy.",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    desc: "Your data is encrypted and processed securely. We never share your information.",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    desc: "Get results in seconds with our optimized AI processing pipeline.",
  },
];

const FeaturesSection = () => (
  <section id="features" className="py-24 px-6 max-w-7xl mx-auto relative z-10">
    <h2 className="text-4xl md:text-5xl font-black text-center fire-gradient-text mb-4">POWERFUL FEATURES</h2>
    <p className="text-center text-muted-foreground text-lg mb-16 max-w-2xl mx-auto font-body">
      Everything you need for perfect meeting management
    </p>

    <div className="grid md:grid-cols-3 gap-8">
      {features.map((f, i) => (
        <motion.div
          key={f.title}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.15, duration: 0.5 }}
          className="bg-card p-8 rounded-2xl border-2 border-transparent hover:border-primary transition-all duration-500 hover:-translate-y-4 hover:shadow-[0_20px_60px_hsl(var(--primary)/0.4)] group cursor-pointer"
        >
          <f.icon className="w-14 h-14 text-primary mb-6 group-hover:scale-110 transition-transform" />
          <h3 className="font-display text-2xl font-bold mb-3 text-foreground">{f.title}</h3>
          <p className="text-muted-foreground font-body text-lg leading-relaxed">{f.desc}</p>
        </motion.div>
      ))}
    </div>
  </section>
);

export default FeaturesSection;
