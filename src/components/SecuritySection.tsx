import { motion } from "framer-motion";
import { Lock, Award, ShieldCheck, UserX } from "lucide-react";

const items = [
  { icon: Lock, title: "AES-256 Encryption", desc: "Bank-level encryption for all your data" },
  { icon: Award, title: "SOC 2 Certified", desc: "Industry-standard security compliance" },
  { icon: ShieldCheck, title: "GDPR Compliant", desc: "Full European data protection" },
  { icon: UserX, title: "Zero-Knowledge", desc: "We can't see your data, ever" },
];

const SecuritySection = () => (
  <section id="security" className="py-24 px-6 relative z-10">
    <div className="max-w-7xl mx-auto bg-card/30 rounded-3xl p-12 md:p-16">
      <h2 className="text-4xl md:text-5xl font-black text-center fire-gradient-text mb-4">ENTERPRISE-GRADE SECURITY</h2>
      <p className="text-center text-muted-foreground text-lg mb-16 max-w-2xl mx-auto font-body">
        Your data is protected with military-grade encryption
      </p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map((item, i) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="bg-card p-6 rounded-2xl border-2 border-border hover:border-primary text-center transition-all duration-400 hover:-translate-y-2 hover:shadow-[0_10px_30px_hsl(var(--primary)/0.3)]"
          >
            <item.icon className="w-12 h-12 mx-auto mb-4 text-primary" />
            <h4 className="font-display text-lg font-bold mb-2 text-foreground">{item.title}</h4>
            <p className="text-muted-foreground font-body">{item.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default SecuritySection;
