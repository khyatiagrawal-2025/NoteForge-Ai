import { motion } from "framer-motion";
import { Video, MessageSquare, LayoutGrid, Trello, Chrome, Clapperboard } from "lucide-react";
import { useState } from "react";

const integrations = [
  { icon: Chrome, name: "Google Meet" },
  { icon: LayoutGrid, name: "Microsoft Teams" },
  { icon: Video, name: "Zoom" },
  { icon: MessageSquare, name: "Slack" },
  { icon: Trello, name: "Trello" },
  { icon: Clapperboard, name: "Jira" },
];

const IntegrationCard = ({ item, index }: { item: typeof integrations[0]; index: number }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative cursor-pointer group"
    >
      {/* Animated rotating border */}
      <div className={`absolute -inset-[1px] rounded-2xl overflow-hidden transition-opacity duration-400 ${hovered ? "opacity-100" : "opacity-0"}`}>
        <motion.div
          className="absolute inset-0"
          style={{
            background: "conic-gradient(from 0deg, hsl(var(--primary)), hsl(var(--accent)), transparent, hsl(var(--primary)))",
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
        />
      </div>

      <div className={`relative bg-card p-6 rounded-2xl text-center transition-all duration-400 ${hovered ? "-translate-y-3 shadow-[0_20px_40px_hsl(var(--primary)/0.3)]" : ""}`}>
        {/* Sparkle particles on hover */}
        {hovered && (
          <>
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 rounded-full bg-primary"
                initial={{
                  x: "50%",
                  y: "50%",
                  opacity: 0,
                  scale: 0,
                }}
                animate={{
                  x: `${20 + Math.random() * 60}%`,
                  y: `${10 + Math.random() * 80}%`,
                  opacity: [0, 1, 0],
                  scale: [0, 1.5, 0],
                }}
                transition={{
                  duration: 0.8,
                  delay: i * 0.15,
                  repeat: Infinity,
                  repeatDelay: 0.5,
                }}
              />
            ))}
          </>
        )}

        <motion.div animate={hovered ? { scale: 1.15, y: -4 } : { scale: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <item.icon className="w-12 h-12 mx-auto mb-3 text-primary" />
        </motion.div>
        <h4 className="font-display text-sm font-bold text-foreground">{item.name}</h4>
      </div>
    </motion.div>
  );
};

const IntegrationsSection = () => (
  <section id="integrations" className="py-24 px-6 max-w-7xl mx-auto relative z-10">
    <motion.h2
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-4xl md:text-5xl font-black text-center fire-gradient-text mb-4"
    >
      SEAMLESS INTEGRATIONS
    </motion.h2>
    <motion.p
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay: 0.2 }}
      className="text-center text-muted-foreground text-lg mb-16 max-w-2xl mx-auto font-body"
    >
      Connect with your favorite tools and platforms
    </motion.p>

    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
      {integrations.map((item, i) => (
        <IntegrationCard key={item.name} item={item} index={i} />
      ))}
    </div>
  </section>
);

export default IntegrationsSection;
