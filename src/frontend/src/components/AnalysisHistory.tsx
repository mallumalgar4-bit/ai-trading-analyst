import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Clock, Minus, TrendingDown, TrendingUp } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import type { AnalysisRecord } from "../backend.d";
import { formatTimestampShort, getSignalClass } from "../utils/format";

interface AnalysisHistoryProps {
  analyses: AnalysisRecord[];
  isLoading: boolean;
  selectedId: bigint | null;
  onSelect: (record: AnalysisRecord) => void;
}

function SignalIcon({ signal }: { signal: string }) {
  const cls = getSignalClass(signal);
  if (cls === "bull")
    return <TrendingUp className="h-3 w-3 text-bull flex-shrink-0" />;
  if (cls === "bear")
    return <TrendingDown className="h-3 w-3 text-bear flex-shrink-0" />;
  return <Minus className="h-3 w-3 text-neutral-signal flex-shrink-0" />;
}

function SignalBadge({ signal }: { signal: string }) {
  const cls = getSignalClass(signal);
  return (
    <span
      className={cn(
        "inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold tracking-wider",
        cls === "bull" && "signal-bull",
        cls === "bear" && "signal-bear",
        cls === "neutral" && "signal-neutral",
      )}
    >
      {signal.toUpperCase()}
    </span>
  );
}

export function AnalysisHistory({
  analyses,
  isLoading,
  selectedId,
  onSelect,
}: AnalysisHistoryProps) {
  if (isLoading) {
    return (
      <div className="space-y-2 mt-2" data-ocid="trading.history_list">
        {[1, 2, 3].map((i) => (
          <div key={i} className="terminal-card rounded p-3 space-y-2">
            <Skeleton className="h-3 w-20 bg-muted/60" />
            <Skeleton className="h-3 w-32 bg-muted/40" />
          </div>
        ))}
      </div>
    );
  }

  if (analyses.length === 0) {
    return (
      <div data-ocid="trading.history_list" className="mt-2">
        <div
          data-ocid="trading.empty_state"
          className="terminal-card rounded p-6 text-center"
        >
          <Clock className="h-6 w-6 mx-auto mb-2 text-muted-foreground/40" />
          <p className="text-xs text-muted-foreground font-mono">
            No analyses yet
          </p>
          <p className="text-xs text-muted-foreground/50 mt-1">
            Submit market data to begin
          </p>
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="mt-2 max-h-[320px]">
      <div data-ocid="trading.history_list" className="space-y-1.5 pr-2">
        <AnimatePresence initial={false}>
          {analyses.map((record, idx) => {
            const isSelected = selectedId === record.id;

            const ocidIndex = idx + 1;

            return (
              <motion.button
                key={record.id.toString()}
                data-ocid={`trading.history_item.${ocidIndex}`}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: idx * 0.04 }}
                onClick={() => onSelect(record)}
                className={cn(
                  "w-full text-left p-3 rounded border transition-all duration-150",
                  "hover:border-ring/40 hover:bg-accent/30",
                  isSelected ? "border-ring/60 bg-accent/40" : "terminal-card",
                  "group",
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <SignalIcon signal={record.analysis.tradeSignal} />
                      <span className="font-mono font-semibold text-sm text-foreground truncate">
                        {record.marketData.symbol}
                      </span>
                      <span className="text-xs text-muted-foreground font-mono bg-muted/40 px-1 rounded">
                        {record.marketData.timeframe}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <SignalBadge signal={record.analysis.tradeSignal} />
                      <span className="text-[10px] text-muted-foreground font-mono truncate">
                        {record.analysis.trend}
                      </span>
                    </div>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <span className="text-[10px] text-muted-foreground font-mono">
                      {formatTimestampShort(record.timestamp)}
                    </span>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>
    </ScrollArea>
  );
}
