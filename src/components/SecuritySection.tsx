import { motion } from "framer-motion";
import { Lock, Award, ShieldCheck, UserX, Fingerprint, KeyRound } from "lucide-react";
import { useState } from "react";

const items = [
  { icon: Lock, title: "AES-256 Encryption", desc: "Bank-level encryption for all your data at rest and in transit." },
  { icon: Award, title: "SOC 2 Certified", desc: "Industry-standard security compliance audited annually." },
  { icon: ShieldCheck, title: "GDPR Compliant", desc: "Full European data protection with right to erasure." },
  { icon: UserX, title: "Zero-Knowledge", desc: "We can't see your data, ever. Only you hold the keys." },
  { icon: Fingerprint, title: "Biometric Auth", desc: "Multi-factor authentication with biometric verification." },
  { icon: KeyRound, title: "SSO & SAML", desc: "Enterprise single sign-on with SAML 2.0 support." },
];

const SecurityCard = ({ item, index }: { item: typeof items[0]; index: number }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative cursor-pointer"
    >
      {/* Rotating gradient border */}
      <div className={`absolute -inset-[1px] rounded-2xl overflow-hidden transition-opacity duration-500 ${hovered ? "opacity-100" : "opacity-0"}`}>
        <motion.div
          className="absolute inset-0"
          style={{
            background: "conic-gradient(from 0deg, hsl(var(--primary)), hsl(var(--accent)), transparent, hsl(var(--primary)))",
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />
      </div>

      <div className={`relative bg-card p-6 rounded-2xl text-center transition-all duration-500 ${hovered ? "-translate-y-3 shadow-[0_25px_60px_hsl(var(--primary)/0.35)]" : "shadow-[0_4px_15px_hsl(var(--primary)/0.08)]"}`}>
        {/* Sparkle particles */}
        {hovered && (
          <>
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 rounded-full bg-primary"
                initial={{ x: "50%", y: "50%", opacity: 0, scale: 0 }}
                animate={{
                  x: `${15 + Math.random() * 70}%`,
                  y: `${10 + Math.random() * 80}%`,
                  opacity: [0, 1, 0],
                  scale: [0, 1.5, 0],
                }}
                transition={{ duration: 0.8, delay: i * 0.12, repeat: Infinity, repeatDelay: 0.6 }}
              />
            ))}
          </>
        )}

        {/* Shield pulse ring behind icon */}
        <div className="relative mx-auto w-16 h-16 mb-4 flex items-center justify-center">
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-primary/30"
            animate={hovered ? { scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] } : { scale: 1, opacity: 0 }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <motion.div animate={hovered ? { scale: 1.15, rotate: [0, -5, 5, 0] } : { scale: 1, rotate: 0 }} transition={{ duration: 0.4 }}>
            <item.icon className="w-12 h-12 text-primary" />
          </motion.div>
        </div>

        <h4 className="font-display text-lg font-bold mb-2 text-foreground">{item.title}</h4>
        <p className="text-muted-foreground font-body text-sm">{item.desc}</p>

        {/* Bottom glow line */}
        <motion.div
          className="absolute bottom-0 left-[15%] right-[15%] h-[2px] rounded-full"
          style={{ background: "linear-gradient(90deg, transparent, hsl(var(--primary)), transparent)" }}
          initial={{ scaleX: 0, opacity: 0 }}
          animate={hovered ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
          transition={{ duration: 0.4 }}
        />
      </div>
    </motion.div>
  );
};

const SecuritySection = () => (
  <section id="security" className="py-24 px-6 relative z-10">
    <div className="max-w-7xl mx-auto relative">
      {/* Background container with subtle gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-primary/5 rounded-3xl" />

      <div className="relative rounded-3xl p-12 md:p-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.div
            className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-full px-4 py-1.5 mb-6"
            animate={{ boxShadow: ["0 0 10px hsl(var(--primary)/0.2)", "0 0 20px hsl(var(--primary)/0.4)", "0 0 10px hsl(var(--primary)/0.2)"] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <ShieldCheck className="w-4 h-4 text-primary" />
            <span className="font-body text-sm text-primary font-semibold">Trusted by 10,000+ teams</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
            className="text-4xl md:text-5xl font-black fire-gradient-text mb-4 relative inline-block"
          >
            ENTERPRISE-GRADE SECURITY
            <motion.div
              className="absolute -bottom-2 left-0 right-0 h-[3px] rounded-full mx-auto"
              style={{ background: "linear-gradient(90deg, transparent, hsl(var(--primary)), hsl(var(--accent)), hsl(var(--primary)), transparent)" }}
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
            />
          </motion.h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-body">
            Your data is protected with military-grade encryption and zero-knowledge architecture
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, i) => (
            <SecurityCard key={item.title} item={item} index={i} />
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default SecuritySection;
