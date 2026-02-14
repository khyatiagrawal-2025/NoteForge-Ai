import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wand2, BarChart3, History, Download, Loader2, ListTodo, Scale, ArrowRight, User, Inbox } from "lucide-react";
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

      // Save to history
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
      <h2 className="text-4xl md:text-5xl font-black text-center fire-gradient-text mb-4">INTERACTIVE DASHBOARD</h2>
      <p className="text-center text-muted-foreground text-lg mb-12 max-w-2xl mx-auto font-body">
        Experience the power of AI-driven meeting intelligence
      </p>

      <div className="bg-card border-2 border-primary rounded-3xl p-6 md:p-10 fire-glow">
        {/* Tabs */}
        <div className="flex flex-wrap gap-3 mb-8 border-b border-border pb-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 min-w-[140px] px-4 py-3 rounded-xl font-display text-sm font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 ${
                activeTab === tab.id
                  ? "fire-gradient-bg text-primary-foreground fire-glow scale-105"
                  : "border-2 border-border text-foreground hover:border-primary hover:-translate-y-0.5"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
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
                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-8">
                    {[
                      { label: "Action Items", count: result.actionItems.length },
                      { label: "Decisions", count: result.decisions.length },
                      { label: "Next Steps", count: result.nextSteps.length },
                    ].map((s) => (
                      <div key={s.label} className="bg-background border-2 border-primary rounded-xl p-4 text-center hover:-translate-y-2 transition-transform hover:shadow-[0_20px_50px_hsl(var(--primary)/0.4)]">
                        <div className="text-4xl font-black font-display fire-gradient-text">{s.count}</div>
                        <div className="text-muted-foreground font-body mt-1">{s.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Summary */}
                  {result.summary && (
                    <div className="bg-background border-l-4 border-primary rounded-xl p-4 mb-6">
                      <p className="text-foreground font-body text-lg">{result.summary}</p>
                    </div>
                  )}

                  {/* Results grid */}
                  <div className="grid md:grid-cols-3 gap-6">
                    {/* Action Items */}
                    <div className="bg-background rounded-xl p-5 border-l-4 border-primary">
                      <h4 className="font-display text-lg text-primary mb-4 flex items-center gap-2"><ListTodo className="w-5 h-5" /> Action Items</h4>
                      {result.actionItems.length > 0 ? result.actionItems.map((item, i) => (
                        <div key={i} className="bg-card p-3 rounded-lg mb-3 border-l-2 border-primary hover:translate-x-1 transition-transform">
                          <p className="text-foreground font-body mb-2">{item.text}</p>
                          <div className="flex justify-between items-center flex-wrap gap-2">
                            <span className={`text-xs font-bold px-2 py-1 rounded-full ${priorityColors[item.priority]}`}>
                              {item.priority.toUpperCase()}
                            </span>
                            <span className="text-muted-foreground text-sm flex items-center gap-1">
                              <User className="w-3 h-3" /> {item.assignee}
                            </span>
                          </div>
                        </div>
                      )) : <p className="text-muted-foreground text-center">None found</p>}
                    </div>

                    {/* Decisions */}
                    <div className="bg-background rounded-xl p-5 border-l-4 border-accent">
                      <h4 className="font-display text-lg text-accent mb-4 flex items-center gap-2"><Scale className="w-5 h-5" /> Decisions</h4>
                      {result.decisions.length > 0 ? result.decisions.map((d, i) => (
                        <div key={i} className="bg-card p-3 rounded-lg mb-3 border-l-2 border-accent hover:translate-x-1 transition-transform">
                          <p className="text-foreground font-body">{d}</p>
                        </div>
                      )) : <p className="text-muted-foreground text-center">None found</p>}
                    </div>

                    {/* Next Steps */}
                    <div className="bg-background rounded-xl p-5 border-l-4 border-emerald-500">
                      <h4 className="font-display text-lg text-emerald-400 mb-4 flex items-center gap-2"><ArrowRight className="w-5 h-5" /> Next Steps</h4>
                      {result.nextSteps.length > 0 ? result.nextSteps.map((s, i) => (
                        <div key={i} className="bg-card p-3 rounded-lg mb-3 border-l-2 border-emerald-500 hover:translate-x-1 transition-transform">
                          <p className="text-foreground font-body">{s}</p>
                        </div>
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
                    <div
                      key={entry.id}
                      onClick={() => { setResult(entry.result); setActiveTab("results"); }}
                      className="bg-background p-4 rounded-xl border-l-4 border-primary hover:translate-x-1 transition-transform cursor-pointer"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-primary text-sm font-body">
                          📅 {new Date(entry.date).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-muted-foreground font-body mb-2">{entry.preview}</p>
                      <div className="flex gap-4 text-sm text-muted-foreground font-body">
                        <span>📋 {entry.result.actionItems.length} Actions</span>
                        <span>⚖️ {entry.result.decisions.length} Decisions</span>
                        <span>➡️ {entry.result.nextSteps.length} Steps</span>
                      </div>
                    </div>
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
      </div>
    </section>
  );
};

export default Dashboard;
