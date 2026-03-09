import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
import { Activity, AlertCircle, Clock, Terminal } from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useRef } from "react";
import { useState } from "react";
import { toast } from "sonner";
import type { AnalysisRecord, MarketData } from "./backend.d";
import { AnalysisHistory } from "./components/AnalysisHistory";
import { AnalysisResults } from "./components/AnalysisResults";
import { MarketDataForm } from "./components/MarketDataForm";
import { useAnalyzeMarket, useGetAllAnalyses } from "./hooks/useQueries";

export default function App() {
  const [selectedRecord, setSelectedRecord] = useState<AnalysisRecord | null>(
    null,
  );
  const resultsRef = useRef<HTMLDivElement>(null);

  const {
    data: analyses = [],
    isLoading: analysesLoading,
    error: analysesError,
  } = useGetAllAnalyses();
  const { mutate: analyzeMarket, isPending: isAnalyzing } = useAnalyzeMarket();

  const handleSubmit = useCallback(
    (marketData: MarketData) => {
      analyzeMarket(marketData, {
        onSuccess: (record) => {
          setSelectedRecord(record);
          toast.success(`Analysis complete for ${record.marketData.symbol}`, {
            description: `Signal: ${record.analysis.tradeSignal.toUpperCase()} — ${record.analysis.trend}`,
          });
          // Scroll to results on mobile
          if (window.innerWidth < 1024) {
            setTimeout(() => {
              resultsRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "start",
              });
            }, 100);
          }
        },
        onError: (err) => {
          toast.error("Analysis failed", {
            description:
              err instanceof Error ? err.message : "Please try again",
          });
        },
      });
    },
    [analyzeMarket],
  );

  const handleHistorySelect = useCallback((record: AnalysisRecord) => {
    setSelectedRecord(record);
    // Scroll to results on mobile
    if (window.innerWidth < 1024) {
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    }
  }, []);

  const currentYear = new Date().getFullYear();
  const footerLink = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border/60 bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-[1400px] mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded bg-primary/20 border border-primary/30 flex items-center justify-center">
              <Activity className="h-3.5 w-3.5 text-cyan" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-mono font-bold text-sm text-foreground tracking-wide">
                  AI Trading Analyst
                </h1>
                <span className="hidden sm:inline-block text-[9px] font-mono px-1.5 py-0.5 rounded bg-primary/10 text-cyan border border-primary/20 tracking-widest">
                  PRO
                </span>
              </div>
              <p className="text-[10px] font-mono text-muted-foreground tracking-wider hidden sm:block">
                Advanced Technical Analysis &amp; Trade Signal Engine
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-1.5 text-xs font-mono text-muted-foreground">
              <span className="w-1.5 h-1.5 rounded-full bg-bull animate-pulse" />
              <span>LIVE</span>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 text-xs font-mono text-muted-foreground border border-border px-2 py-1 rounded">
              <Terminal className="h-3 w-3" />
              <span>Terminal v1.0</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-[1400px] mx-auto w-full px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* Left Column — Input + History */}
          <div className="w-full lg:w-[40%] flex flex-col gap-5">
            {/* Input Form */}
            <motion.section
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="terminal-card rounded-lg p-5"
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="flex gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-bear/70" />
                  <span className="w-2.5 h-2.5 rounded-full bg-neutral-signal/70" />
                  <span className="w-2.5 h-2.5 rounded-full bg-bull/70" />
                </div>
                <h2 className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
                  Market Data Input
                </h2>
              </div>
              <MarketDataForm onSubmit={handleSubmit} isLoading={isAnalyzing} />
            </motion.section>

            {/* Analysis History */}
            <motion.section
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="terminal-card rounded-lg p-5"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Clock className="h-3.5 w-3.5 text-cyan" />
                  <h2 className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
                    Analysis History
                  </h2>
                </div>
                {analyses.length > 0 && (
                  <span className="text-[10px] font-mono text-muted-foreground bg-muted/40 px-1.5 py-0.5 rounded">
                    {analyses.length} record{analyses.length !== 1 ? "s" : ""}
                  </span>
                )}
              </div>

              {analysesError && (
                <div className="flex items-center gap-2 p-2 rounded bg-destructive/10 border border-destructive/30 mb-2">
                  <AlertCircle className="h-3 w-3 text-destructive flex-shrink-0" />
                  <span className="text-xs text-destructive/80 font-mono">
                    Failed to load history
                  </span>
                </div>
              )}

              <AnalysisHistory
                analyses={analyses}
                isLoading={analysesLoading}
                selectedId={selectedRecord?.id ?? null}
                onSelect={handleHistorySelect}
              />
            </motion.section>
          </div>

          {/* Right Column — Results */}
          <motion.div
            ref={resultsRef}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="w-full lg:w-[60%] lg:sticky lg:top-[73px]"
          >
            <div
              className={cn(
                "terminal-card rounded-lg p-5",
                "lg:max-h-[calc(100vh-120px)] lg:overflow-y-auto",
              )}
            >
              <div className="flex items-center gap-2 mb-4">
                <Activity className="h-3.5 w-3.5 text-cyan" />
                <h2 className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
                  Analysis Results
                </h2>
                {selectedRecord && (
                  <span className="ml-auto text-[10px] font-mono text-muted-foreground/60">
                    #{selectedRecord.id.toString()}
                  </span>
                )}
              </div>
              <AnalysisResults record={selectedRecord} />
            </div>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-card/40 mt-auto">
        <div className="max-w-[1400px] mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-[10px] font-mono text-muted-foreground/50">
            © {currentYear}. Built with ❤️ using{" "}
            <a
              href={footerLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan/60 hover:text-cyan transition-colors underline-offset-2 hover:underline"
            >
              caffeine.ai
            </a>
          </p>
          <p className="text-[10px] font-mono text-muted-foreground/40">
            For informational purposes only. Not financial advice.
          </p>
        </div>
      </footer>

      <Toaster
        theme="dark"
        toastOptions={{
          classNames: {
            toast: "bg-card border-border font-mono text-xs",
          },
        }}
      />
    </div>
  );
}
