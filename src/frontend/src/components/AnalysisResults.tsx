import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
  Activity,
  ArrowDown,
  ArrowUp,
  BarChart2,
  Layers,
  Minus,
  Quote,
  Shield,
  Target,
  TrendingDown,
  TrendingUp,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import type { AnalysisRecord } from "../backend.d";
import {
  formatPrice,
  formatTimestamp,
  getConfidenceClass,
  getSignalClass,
  getTrendClass,
} from "../utils/format";

interface AnalysisResultsProps {
  record: AnalysisRecord | null;
}

// ── Signal Badge ──────────────────────────────────────────────────────────────
function SignalBadge({
  signal,
  large = false,
}: { signal: string; large?: boolean }) {
  const cls = getSignalClass(signal);
  return (
    <span
      data-ocid="trading.signal_badge"
      className={cn(
        "inline-flex items-center gap-1.5 font-mono font-bold tracking-widest rounded",
        large ? "px-4 py-2 text-base" : "px-2 py-1 text-xs",
        cls === "bull" && "signal-bull signal-glow-bull",
        cls === "bear" && "signal-bear signal-glow-bear",
        cls === "neutral" && "signal-neutral signal-glow-neutral",
      )}
    >
      {cls === "bull" && (
        <TrendingUp className={large ? "h-4 w-4" : "h-3 w-3"} />
      )}
      {cls === "bear" && (
        <TrendingDown className={large ? "h-4 w-4" : "h-3 w-3"} />
      )}
      {cls === "neutral" && <Minus className={large ? "h-4 w-4" : "h-3 w-3"} />}
      {signal.toUpperCase()}
    </span>
  );
}

// ── Trend Badge ───────────────────────────────────────────────────────────────
function TrendBadge({ trend }: { trend: string }) {
  const cls = getTrendClass(trend);
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2.5 py-1 rounded font-mono text-xs font-semibold tracking-wide",
        cls === "bull" && "signal-bull",
        cls === "bear" && "signal-bear",
        cls === "neutral" && "signal-neutral",
      )}
    >
      {cls === "bull" && <TrendingUp className="h-3 w-3" />}
      {cls === "bear" && <TrendingDown className="h-3 w-3" />}
      {cls === "neutral" && <Minus className="h-3 w-3" />}
      {trend}
    </span>
  );
}

// ── Confidence Badge ──────────────────────────────────────────────────────────
function ConfidenceBadge({ level }: { level: string }) {
  const cls = getConfidenceClass(level);
  return (
    <span
      data-ocid="trading.confidence_badge"
      className={cn(
        "inline-flex items-center gap-1 px-2.5 py-1 rounded font-mono text-xs font-semibold tracking-wide",
        cls === "bull" && "signal-bull",
        cls === "neutral" && "signal-neutral",
        cls === "muted" &&
          "bg-muted/40 text-muted-foreground border border-border",
      )}
    >
      <Shield className="h-3 w-3" />
      {level}
    </span>
  );
}

// ── Indicator Chip ────────────────────────────────────────────────────────────
function IndicatorChip({ label, value }: { label: string; value: string }) {
  const cls = getSignalClass(value);
  return (
    <div
      className={cn(
        "flex flex-col gap-1 p-2.5 rounded border",
        cls === "bull" && "signal-bull",
        cls === "bear" && "signal-bear",
        cls === "neutral" && "signal-neutral",
        cls !== "bull" &&
          cls !== "bear" &&
          cls !== "neutral" &&
          "bg-muted/30 text-muted-foreground border-border",
      )}
    >
      <span className="text-[10px] font-mono uppercase tracking-widest opacity-70">
        {label}
      </span>
      <span className="text-xs font-mono font-semibold">{value}</span>
    </div>
  );
}

// ── Level Card ────────────────────────────────────────────────────────────────
function LevelCard({
  icon,
  label,
  value,
  valueClass,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  valueClass?: string;
}) {
  return (
    <div className="terminal-card rounded p-3 space-y-1">
      <div className="flex items-center gap-1.5 text-muted-foreground">
        {icon}
        <span className="text-[10px] font-mono uppercase tracking-widest">
          {label}
        </span>
      </div>
      <span className={cn("font-mono font-semibold text-sm", valueClass)}>
        {value}
      </span>
    </div>
  );
}

// ── Empty State ───────────────────────────────────────────────────────────────
function EmptyState() {
  return (
    <div
      data-ocid="trading.empty_state"
      className="flex flex-col items-center justify-center h-full min-h-[400px] text-center gap-4"
    >
      <div className="relative">
        <div className="w-16 h-16 rounded-full bg-muted/20 border border-border/60 flex items-center justify-center">
          <Activity className="h-7 w-7 text-muted-foreground/30" />
        </div>
        <div className="absolute inset-0 rounded-full border border-primary/10 animate-ping" />
      </div>
      <div className="space-y-1">
        <p className="text-sm font-mono text-muted-foreground">
          Enter market data to generate analysis
        </p>
        <p className="text-xs text-muted-foreground/50 font-mono">
          AI-powered technical analysis awaits
        </p>
      </div>
      <div className="grid grid-cols-3 gap-2 mt-2">
        {["RSI", "MACD", "MA"].map((ind) => (
          <div
            key={ind}
            className="px-3 py-1.5 rounded border border-border/40 bg-muted/10"
          >
            <span className="text-[10px] font-mono text-muted-foreground/40">
              {ind}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export function AnalysisResults({ record }: AnalysisResultsProps) {
  if (!record) {
    return (
      <div data-ocid="trading.result_panel" className="h-full flex flex-col">
        <EmptyState />
      </div>
    );
  }

  const { marketData, analysis, timestamp } = record;

  return (
    <div data-ocid="trading.result_panel" className="h-full flex flex-col">
      <AnimatePresence mode="wait">
        <motion.div
          key={record.id.toString()}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="flex flex-col gap-4"
        >
          {/* Header */}
          <div className="terminal-card-accent rounded-lg p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="font-mono font-bold text-xl text-foreground tracking-wide">
                    {marketData.symbol}
                  </h2>
                  <span className="font-mono text-xs bg-muted/40 border border-border px-2 py-0.5 rounded text-muted-foreground">
                    {marketData.timeframe}
                  </span>
                </div>
                <p className="text-xs font-mono text-muted-foreground mt-1">
                  {formatTimestamp(timestamp)}
                </p>
              </div>
              <SignalBadge signal={analysis.tradeSignal} large />
            </div>

            {/* OHLCV summary */}
            <div className="grid grid-cols-5 gap-2 mt-3 pt-3 border-t border-border/50">
              {[
                { label: "O", value: formatPrice(marketData.open), cls: "" },
                {
                  label: "H",
                  value: formatPrice(marketData.high),
                  cls: "text-bull",
                },
                {
                  label: "L",
                  value: formatPrice(marketData.low),
                  cls: "text-bear",
                },
                {
                  label: "C",
                  value: formatPrice(marketData.close),
                  cls:
                    Number(marketData.close) >= Number(marketData.open)
                      ? "text-bull"
                      : "text-bear",
                },
                {
                  label: "Vol",
                  value: marketData.volume.toLocaleString(),
                  cls: "text-cyan",
                },
              ].map(({ label, value, cls }) => (
                <div key={label} className="text-center">
                  <div className="text-[9px] font-mono text-muted-foreground/60 uppercase mb-0.5">
                    {label}
                  </div>
                  <div
                    className={cn(
                      "text-xs font-mono font-semibold truncate",
                      cls,
                    )}
                  >
                    {value}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Market Overview */}
          <div className="terminal-card rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-2 mb-1">
              <BarChart2 className="h-3.5 w-3.5 text-cyan" />
              <h3 className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground">
                Market Overview
              </h3>
            </div>
            <div className="flex flex-wrap gap-2">
              <TrendBadge trend={analysis.trend} />
              <span
                className={cn(
                  "inline-flex items-center gap-1 px-2.5 py-1 rounded font-mono text-xs tracking-wide border",
                  "bg-muted/30 border-border text-muted-foreground",
                )}
              >
                <Layers className="h-3 w-3" />
                {analysis.candlestickPattern}
              </span>
              <span
                className={cn(
                  "inline-flex items-center gap-1 px-2.5 py-1 rounded font-mono text-xs tracking-wide border",
                  "bg-muted/30 border-border text-muted-foreground",
                )}
              >
                <Zap className="h-3 w-3" />
                {analysis.momentum}
              </span>
            </div>
          </div>

          {/* Key Levels */}
          <div className="terminal-card rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-2 mb-1">
              <Target className="h-3.5 w-3.5 text-cyan" />
              <h3 className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground">
                Key Levels
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <LevelCard
                icon={<ArrowDown className="h-3 w-3 text-bull" />}
                label="Support"
                value={formatPrice(analysis.supportLevel)}
                valueClass="text-bull"
              />
              <LevelCard
                icon={<ArrowUp className="h-3 w-3 text-bear" />}
                label="Resistance"
                value={formatPrice(analysis.resistanceLevel)}
                valueClass="text-bear"
              />
              <LevelCard
                icon={<Activity className="h-3 w-3 text-cyan" />}
                label="Liquidity Zone"
                value={formatPrice(analysis.liquidityZone)}
                valueClass="text-cyan"
              />
              <LevelCard
                icon={<Shield className="h-3 w-3 text-neutral-signal" />}
                label="Risk/Reward"
                value={`1:${analysis.riskRewardRatio.toFixed(2)}`}
                valueClass="text-neutral-signal"
              />
            </div>
          </div>

          {/* Technical Indicators */}
          <div className="terminal-card rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-2 mb-1">
              <Activity className="h-3.5 w-3.5 text-cyan" />
              <h3 className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground">
                Technical Indicators
              </h3>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <IndicatorChip label="RSI" value={analysis.rsiSignal} />
              <IndicatorChip label="MACD" value={analysis.macdSignal} />
              <IndicatorChip label="MA" value={analysis.movingAverageSignal} />
            </div>
          </div>

          {/* Trade Setup */}
          <div
            className={cn(
              "rounded-lg p-4 space-y-3 border-2",
              getSignalClass(analysis.tradeSignal) === "bull" &&
                "border-signal-bull bg-signal-bull-dim",
              getSignalClass(analysis.tradeSignal) === "bear" &&
                "border-signal-bear bg-signal-bear-dim",
              getSignalClass(analysis.tradeSignal) === "neutral" &&
                "border-signal-neutral bg-signal-neutral-dim",
            )}
            style={{
              borderColor:
                getSignalClass(analysis.tradeSignal) === "bull"
                  ? "oklch(0.72 0.2 145 / 0.35)"
                  : getSignalClass(analysis.tradeSignal) === "bear"
                    ? "oklch(0.62 0.22 25 / 0.35)"
                    : "oklch(0.78 0.18 75 / 0.35)",
              background:
                getSignalClass(analysis.tradeSignal) === "bull"
                  ? "oklch(0.22 0.06 145 / 0.5)"
                  : getSignalClass(analysis.tradeSignal) === "bear"
                    ? "oklch(0.22 0.07 25 / 0.5)"
                    : "oklch(0.22 0.05 75 / 0.5)",
            }}
          >
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-3.5 w-3.5 text-cyan" />
                <h3 className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground">
                  Trade Setup
                </h3>
              </div>
              <ConfidenceBadge level={analysis.confidenceLevel} />
            </div>

            {/* Entry / SL */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                  Entry Price
                </p>
                <p className="font-mono font-bold text-lg text-foreground">
                  {formatPrice(analysis.entryPrice)}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                  Stop Loss
                </p>
                <p className="font-mono font-bold text-lg text-bear">
                  {formatPrice(analysis.stopLoss)}
                </p>
              </div>
            </div>

            <Separator className="bg-border/40" />

            {/* Take Profits */}
            <div className="grid grid-cols-3 gap-2">
              {[
                {
                  label: "TP1",
                  value: analysis.takeProfit1,
                  opacity: "opacity-100",
                },
                {
                  label: "TP2",
                  value: analysis.takeProfit2,
                  opacity: "opacity-90",
                },
                {
                  label: "TP3",
                  value: analysis.takeProfit3,
                  opacity: "opacity-80",
                },
              ].map(({ label, value, opacity }) => (
                <div key={label} className="space-y-1">
                  <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                    {label}
                  </p>
                  <p
                    className={cn(
                      "font-mono font-semibold text-sm text-bull",
                      opacity,
                    )}
                  >
                    {formatPrice(value)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Reasoning */}
          <div className="terminal-card rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Quote className="h-3.5 w-3.5 text-cyan" />
              <h3 className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground">
                Analysis Reasoning
              </h3>
            </div>
            <blockquote
              className="border-l-2 pl-4 text-sm text-muted-foreground leading-relaxed font-mono"
              style={{ borderColor: "oklch(0.75 0.2 195 / 0.4)" }}
            >
              {analysis.reasoning}
            </blockquote>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
