import { motion } from "framer-motion";
import { Video, MessageSquare, LayoutGrid, Trello, Chrome, Clapperboard } from "lucide-react";

const integrations = [
  { icon: Chrome, name: "Google Meet" },
  { icon: LayoutGrid, name: "Microsoft Teams" },
  { icon: Video, name: "Zoom" },
  { icon: MessageSquare, name: "Slack" },
  { icon: Trello, name: "Trello" },
  { icon: Clapperboard, name: "Jira" },
];

const IntegrationsSection = () => (
  <section id="integrations" className="py-24 px-6 max-w-7xl mx-auto relative z-10">
    <h2 className="text-4xl md:text-5xl font-black text-center fire-gradient-text mb-4">SEAMLESS INTEGRATIONS</h2>
    <p className="text-center text-muted-foreground text-lg mb-16 max-w-2xl mx-auto font-body">
      Connect with your favorite tools and platforms
    </p>

    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
      {integrations.map((item, i) => (
        <motion.div
          key={item.name}
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1 }}
          className="bg-card p-6 rounded-2xl border-2 border-border hover:border-primary text-center transition-all duration-400 hover:-translate-y-3 hover:shadow-[0_20px_40px_hsl(var(--primary)/0.3)] cursor-pointer group"
        >
          <item.icon className="w-12 h-12 mx-auto mb-3 text-primary group-hover:scale-110 transition-transform" />
          <h4 className="font-display text-sm font-bold text-foreground">{item.name}</h4>
        </motion.div>
      ))}
    </div>
  </section>
);

export default IntegrationsSection;
