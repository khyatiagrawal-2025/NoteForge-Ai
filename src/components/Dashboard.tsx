import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wand2, BarChart3, History, Download, Loader2, ListTodo, Scale, ArrowRight, User, Inbox, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ActionItem {
  text: string;
  assignee: string;
  priority: "high" | "medium" | "low";
}

interface AnalysisResult {
  actionItems: ActionItem[];
  decisions: string[];
  nextSteps: string[];
  summary: string;
}

interface HistoryEntry {
  id: number;
  date: string;
  preview: string;
  result: AnalysisResult;
}

const tabs = [
  { id: "analyze", label: "AI Analyze", icon: Wand2 },
  { id: "results", label: "Results", icon: BarChart3 },
  { id: "history", label: "History", icon: History },
];

const priorityColors: Record<string, string> = {
  high: "bg-secondary text-secondary-foreground",
  medium: "bg-primary text-primary-foreground",
  low: "bg-accent text-accent-foreground",
};

const TabButton = ({
  tab,
  isActive,
  onClick,
}: {
  tab: typeof tabs[0];
  isActive: boolean;
  onClick: () => void;
}) => {
  const [hovered, setHovered] = useState(false);
  const [justClicked, setJustClicked] = useState(false);

  const handleClick = () => {
    setJustClicked(true);
    setTimeout(() => setJustClicked(false), 700);
    onClick();
  };

  return (
    <motion.button
      onClick={handleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`relative flex-1 min-w-[140px] px-4 py-3 rounded-xl font-display text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 overflow-hidden ${
        isActive
          ? "fire-gradient-bg text-primary-foreground"
          : "border-2 border-border text-foreground"
      }`}
      animate={isActive ? { scale: 1.05 } : hovered ? { scale: 1.03, y: -2 } : { scale: 1, y: 0 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
    >
      {/* Active glow */}
      {isActive && (
        <motion.div
          className="absolute inset-0 rounded-xl"
          animate={{
            boxShadow: [
              "0 0 15px hsl(var(--primary)/0.4), 0 0 30px hsl(var(--primary)/0.2)",
              "0 0 25px hsl(var(--primary)/0.6), 0 0 50px hsl(var(--primary)/0.3)",
              "0 0 15px hsl(var(--primary)/0.4), 0 0 30px hsl(var(--primary)/0.2)",
            ],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}

      {/* Hover glow for inactive tabs */}
      {!isActive && hovered && (
        <motion.div
          className="absolute inset-0 rounded-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, boxShadow: "0 0 20px hsl(var(--primary)/0.2), inset 0 0 20px hsl(var(--primary)/0.05)" }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        />
      )}

      {/* Sparkle burst on click */}
      <AnimatePresence>
        {justClicked && (
          <>
            {[...Array(8)].map((_, i) => (
              <motion.span
                key={i}
                className="absolute w-1.5 h-1.5 rounded-full bg-accent pointer-events-none"
                initial={{ opacity: 1, scale: 0, x: 0, y: 0 }}
                animate={{
                  opacity: [1, 1, 0],
                  scale: [0, 1.5, 0],
                  x: (Math.random() - 0.5) * 80,
                  y: (Math.random() - 0.5) * 50,
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, delay: i * 0.05 }}
                style={{ left: "50%", top: "50%" }}
              />
            ))}
          </>
        )}
      </AnimatePresence>

      {/* Bottom active indicator line */}
      {isActive && (
        <motion.div
          className="absolute bottom-0 left-[15%] right-[15%] h-[2px] rounded-full"
          style={{ background: "linear-gradient(90deg, transparent, hsl(var(--accent)), transparent)" }}
          layoutId="tab-indicator"
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        />
      )}

      <motion.div
        animate={hovered || isActive ? { rotate: [0, -8, 8, 0] } : {}}
        transition={{ duration: 0.4 }}
      >
        <tab.icon className="w-4 h-4" />
      </motion.div>
      {tab.label}

      {/* Sparkles icon on active */}
      {isActive && (
        <motion.span
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
        >
          <Sparkles className="w-3 h-3" />
        </motion.span>
      )}
    </motion.button>
  );
};

/* Animated section heading component */
const AnimatedHeading = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <motion.h2
    initial={{ opacity: 0, y: 30, scale: 0.95 }}
    whileInView={{ opacity: 1, y: 0, scale: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
    className={`text-4xl md:text-5xl font-black text-center fire-gradient-text mb-4 relative ${className}`}
  >
    {children}
    {/* Animated underline */}
    <motion.div
      className="absolute -bottom-2 left-1/2 h-[3px] rounded-full"
      style={{ background: "linear-gradient(90deg, transparent, hsl(var(--primary)), hsl(var(--accent)), hsl(var(--primary)), transparent)" }}
      initial={{ width: 0, x: "-50%" }}
      whileInView={{ width: "60%", x: "-50%" }}
      viewport={{ once: true }}
      transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
    />
  </motion.h2>
);

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("analyze");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("noteforge_history");
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  const analyzeNotes = async () => {
    if (!notes.trim()) {
      toast.error("Please paste your meeting notes first!");
      return;
    }

    setLoading(true);
    try {
      const response = await supabase.functions.invoke("analyze-notes", {
        body: { notes: notes.trim() },
      });

      if (response.error) throw new Error(response.error.message);

      const data = response.data as AnalysisResult;
      setResult(data);

      const entry: HistoryEntry = {
        id: Date.now(),
        date: new Date().toISOString(),
        preview: notes.substring(0, 150) + (notes.length > 150 ? "..." : ""),
        result: data,
      };
      const newHistory = [entry, ...history].slice(0, 20);
      setHistory(newHistory);
      localStorage.setItem("noteforge_history", JSON.stringify(newHistory));

      setActiveTab("results");
      toast.success("Analysis complete!");
    } catch (error: any) {
      console.error("Analysis error:", error);
      toast.error("Failed to analyze notes. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const exportResults = () => {
    if (!result) return;
    const text = [
      "=== NoteForge AI Analysis ===",
      "",
      `Summary: ${result.summary}`,
      "",
      "--- Action Items ---",
      ...result.actionItems.map((a) => `[${a.priority.toUpperCase()}] ${a.text} (Assignee: ${a.assignee})`),
      "",
      "--- Decisions ---",
      ...result.decisions.map((d) => `• ${d}`),
      "",
      "--- Next Steps ---",
      ...result.nextSteps.map((s) => `→ ${s}`),
    ].join("\n");

    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `noteforge-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section id="dashboard" className="py-24 px-6 max-w-7xl mx-auto relative z-10">
      <AnimatedHeading>INTERACTIVE DASHBOARD</AnimatedHeading>
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
        className="text-center text-muted-foreground text-lg mb-12 max-w-2xl mx-auto font-body"
      >
        Experience the power of AI-driven meeting intelligence
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="bg-card border-2 border-primary rounded-3xl p-6 md:p-10 fire-glow"
      >
        {/* Tabs */}
        <div className="flex flex-wrap gap-3 mb-8 border-b border-border pb-4">
          {tabs.map((tab) => (
            <TabButton
              key={tab.id}
              tab={tab}
              isActive={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* Analyze Tab */}
          {activeTab === "analyze" && (
            <motion.div key="analyze" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <h3 className="font-display text-2xl mb-4">✍️ Paste Your Meeting Notes</h3>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={`Paste your meeting transcript or notes here...\n\nExample:\n- John will follow up with the client by Friday\n- We decided to use React for the new dashboard\n- Sarah needs urgent review of Q3 budget by EOD`}
                className="w-full min-h-[250px] bg-background border-2 border-primary rounded-2xl p-5 text-foreground font-body text-lg resize-y transition-all focus:outline-none focus:shadow-[0_0_30px_hsl(var(--primary)/0.4)] focus:border-accent placeholder:text-muted-foreground"
              />
              <Button
                onClick={analyzeNotes}
                disabled={loading}
                className="w-full mt-4 py-6 text-lg font-display uppercase tracking-wider fire-gradient-bg border-0 fire-glow hover:scale-[1.02] transition-transform disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Analyzing...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-5 h-5 mr-2" /> Analyze with AI
                  </>
                )}
              </Button>
            </motion.div>
          )}

          {/* Results Tab */}
          {activeTab === "results" && (
            <motion.div key="results" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              {result ? (
                <>
                  <div className="grid grid-cols-3 gap-4 mb-8">
                    {[
                      { label: "Action Items", count: result.actionItems.length },
                      { label: "Decisions", count: result.decisions.length },
                      { label: "Next Steps", count: result.nextSteps.length },
                    ].map((s) => (
                      <motion.div
                        key={s.label}
                        whileHover={{ y: -6, boxShadow: "0 20px 50px hsl(var(--primary)/0.4)" }}
                        className="bg-background border-2 border-primary rounded-xl p-4 text-center transition-colors cursor-default"
                      >
                        <div className="text-4xl font-black font-display fire-gradient-text">{s.count}</div>
                        <div className="text-muted-foreground font-body mt-1">{s.label}</div>
                      </motion.div>
                    ))}
                  </div>

                  {result.summary && (
                    <div className="bg-background border-l-4 border-primary rounded-xl p-4 mb-6">
                      <p className="text-foreground font-body text-lg">{result.summary}</p>
                    </div>
                  )}

                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-background rounded-xl p-5 border-l-4 border-primary">
                      <h4 className="font-display text-lg text-primary mb-4 flex items-center gap-2"><ListTodo className="w-5 h-5" /> Action Items</h4>
                      {result.actionItems.length > 0 ? result.actionItems.map((item, i) => (
                        <motion.div key={i} whileHover={{ x: 4, boxShadow: "4px 0 15px hsl(var(--primary)/0.2)" }} className="bg-card p-3 rounded-lg mb-3 border-l-2 border-primary cursor-default">
                          <p className="text-foreground font-body mb-2">{item.text}</p>
                          <div className="flex justify-between items-center flex-wrap gap-2">
                            <span className={`text-xs font-bold px-2 py-1 rounded-full ${priorityColors[item.priority]}`}>{item.priority.toUpperCase()}</span>
                            <span className="text-muted-foreground text-sm flex items-center gap-1"><User className="w-3 h-3" /> {item.assignee}</span>
                          </div>
                        </motion.div>
                      )) : <p className="text-muted-foreground text-center">None found</p>}
                    </div>

                    <div className="bg-background rounded-xl p-5 border-l-4 border-accent">
                      <h4 className="font-display text-lg text-accent mb-4 flex items-center gap-2"><Scale className="w-5 h-5" /> Decisions</h4>
                      {result.decisions.length > 0 ? result.decisions.map((d, i) => (
                        <motion.div key={i} whileHover={{ x: 4, boxShadow: "4px 0 15px hsl(var(--accent)/0.2)" }} className="bg-card p-3 rounded-lg mb-3 border-l-2 border-accent cursor-default">
                          <p className="text-foreground font-body">{d}</p>
                        </motion.div>
                      )) : <p className="text-muted-foreground text-center">None found</p>}
                    </div>

                    <div className="bg-background rounded-xl p-5 border-l-4 border-emerald-500">
                      <h4 className="font-display text-lg text-emerald-400 mb-4 flex items-center gap-2"><ArrowRight className="w-5 h-5" /> Next Steps</h4>
                      {result.nextSteps.length > 0 ? result.nextSteps.map((s, i) => (
                        <motion.div key={i} whileHover={{ x: 4, boxShadow: "4px 0 15px hsl(142 76% 36% / 0.2)" }} className="bg-card p-3 rounded-lg mb-3 border-l-2 border-emerald-500 cursor-default">
                          <p className="text-foreground font-body">{s}</p>
                        </motion.div>
                      )) : <p className="text-muted-foreground text-center">None found</p>}
                    </div>
                  </div>

                  <div className="text-center mt-8">
                    <Button onClick={exportResults} className="fire-gradient-bg border-0 font-display uppercase fire-glow hover:scale-105 transition-transform">
                      <Download className="w-4 h-4 mr-2" /> Export Results
                    </Button>
                  </div>
                </>
              ) : (
                <div className="text-center py-16 text-muted-foreground">
                  <Inbox className="w-16 h-16 mx-auto mb-4 opacity-30" />
                  <p className="font-body text-lg">No analysis yet. Analyze your notes to see results here.</p>
                </div>
              )}
            </motion.div>
          )}

          {/* History Tab */}
          {activeTab === "history" && (
            <motion.div key="history" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <h3 className="font-display text-2xl mb-6">📜 Meeting History</h3>
              {history.length > 0 ? (
                <div className="space-y-4">
                  {history.map((entry) => (
                    <motion.div
                      key={entry.id}
                      whileHover={{ x: 6, boxShadow: "6px 0 25px hsl(var(--primary)/0.3)" }}
                      onClick={() => { setResult(entry.result); setActiveTab("results"); }}
                      className="bg-background p-4 rounded-xl border-l-4 border-primary cursor-pointer"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-primary text-sm font-body">📅 {new Date(entry.date).toLocaleString()}</span>
                      </div>
                      <p className="text-muted-foreground font-body mb-2">{entry.preview}</p>
                      <div className="flex gap-4 text-sm text-muted-foreground font-body">
                        <span>📋 {entry.result.actionItems.length} Actions</span>
                        <span>⚖️ {entry.result.decisions.length} Decisions</span>
                        <span>➡️ {entry.result.nextSteps.length} Steps</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 text-muted-foreground">
                  <Inbox className="w-16 h-16 mx-auto mb-4 opacity-30" />
                  <p className="font-body text-lg">No meeting history yet.</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
};

export default Dashboard;
