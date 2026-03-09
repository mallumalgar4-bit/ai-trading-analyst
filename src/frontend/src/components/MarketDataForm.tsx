import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, TrendingUp } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import type { MarketData } from "../backend.d";

interface MarketDataFormProps {
  onSubmit: (data: MarketData) => void;
  isLoading: boolean;
}

const TIMEFRAMES = ["1m", "5m", "15m", "1h", "4h", "1D", "1W"];

export function MarketDataForm({ onSubmit, isLoading }: MarketDataFormProps) {
  const [symbol, setSymbol] = useState("");
  const [timeframe, setTimeframe] = useState("");
  const [open, setOpen] = useState("");
  const [high, setHigh] = useState("");
  const [low, setLow] = useState("");
  const [close, setClose] = useState("");
  const [volume, setVolume] = useState("");
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!symbol.trim()) newErrors.symbol = "Asset symbol is required";
    if (!timeframe) newErrors.timeframe = "Timeframe is required";
    if (!open || Number.isNaN(Number.parseFloat(open)))
      newErrors.open = "Valid open price required";
    if (!high || Number.isNaN(Number.parseFloat(high)))
      newErrors.high = "Valid high price required";
    if (!low || Number.isNaN(Number.parseFloat(low)))
      newErrors.low = "Valid low price required";
    if (!close || Number.isNaN(Number.parseFloat(close)))
      newErrors.close = "Valid close price required";
    if (!volume || Number.isNaN(Number.parseFloat(volume)))
      newErrors.volume = "Valid volume required";

    const openN = Number.parseFloat(open);
    const highN = Number.parseFloat(high);
    const lowN = Number.parseFloat(low);
    if (!newErrors.high && !newErrors.low && highN < lowN) {
      newErrors.high = "High must be >= Low";
    }
    if (!newErrors.open && !newErrors.high && openN > highN) {
      newErrors.open = "Open must be <= High";
    }
    if (!newErrors.open && !newErrors.low && openN < lowN) {
      newErrors.open = "Open must be >= Low";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const marketData: MarketData = {
      symbol: symbol.trim().toUpperCase(),
      timeframe,
      open: Number.parseFloat(open),
      high: Number.parseFloat(high),
      low: Number.parseFloat(low),
      close: Number.parseFloat(close),
      volume: Number.parseFloat(volume),
      notes: notes.trim() || undefined,
    };

    onSubmit(marketData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Symbol + Timeframe row */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label
            htmlFor="symbol"
            className="text-xs font-mono uppercase tracking-widest text-muted-foreground"
          >
            Asset Symbol
          </Label>
          <Input
            id="symbol"
            data-ocid="trading.symbol_input"
            placeholder="BTC/USD"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            className="font-mono bg-input/50 border-border/60 focus:border-ring focus-visible:ring-ring/30 uppercase placeholder:normal-case placeholder:opacity-40 text-sm"
            aria-invalid={!!errors.symbol}
          />
          {errors.symbol && (
            <p className="text-xs text-bear">{errors.symbol}</p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label
            htmlFor="timeframe"
            className="text-xs font-mono uppercase tracking-widest text-muted-foreground"
          >
            Timeframe
          </Label>
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger
              id="timeframe"
              data-ocid="trading.timeframe_select"
              className="bg-input/50 border-border/60 focus:border-ring font-mono text-sm"
              aria-invalid={!!errors.timeframe}
            >
              <SelectValue placeholder="Select..." />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border font-mono">
              {TIMEFRAMES.map((tf) => (
                <SelectItem key={tf} value={tf} className="font-mono">
                  {tf}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.timeframe && (
            <p className="text-xs text-bear">{errors.timeframe}</p>
          )}
        </div>
      </div>

      {/* OHLC prices */}
      <div className="space-y-1.5">
        <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
          OHLC Prices
        </p>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="open" className="text-xs text-muted-foreground/70">
              Open
            </Label>
            <Input
              id="open"
              type="number"
              step="any"
              data-ocid="trading.open_input"
              placeholder="0.00"
              value={open}
              onChange={(e) => setOpen(e.target.value)}
              className="font-mono bg-input/50 border-border/60 focus:border-ring focus-visible:ring-ring/30 text-sm"
              aria-invalid={!!errors.open}
            />
            {errors.open && <p className="text-xs text-bear">{errors.open}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="high" className="text-xs text-muted-foreground/70">
              High
            </Label>
            <Input
              id="high"
              type="number"
              step="any"
              data-ocid="trading.high_input"
              placeholder="0.00"
              value={high}
              onChange={(e) => setHigh(e.target.value)}
              className="font-mono bg-input/50 border-border/60 focus:border-ring focus-visible:ring-ring/30 text-sm text-bull"
              aria-invalid={!!errors.high}
            />
            {errors.high && <p className="text-xs text-bear">{errors.high}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="low" className="text-xs text-muted-foreground/70">
              Low
            </Label>
            <Input
              id="low"
              type="number"
              step="any"
              data-ocid="trading.low_input"
              placeholder="0.00"
              value={low}
              onChange={(e) => setLow(e.target.value)}
              className="font-mono bg-input/50 border-border/60 focus:border-ring focus-visible:ring-ring/30 text-sm text-bear"
              aria-invalid={!!errors.low}
            />
            {errors.low && <p className="text-xs text-bear">{errors.low}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="close" className="text-xs text-muted-foreground/70">
              Close
            </Label>
            <Input
              id="close"
              type="number"
              step="any"
              data-ocid="trading.close_input"
              placeholder="0.00"
              value={close}
              onChange={(e) => setClose(e.target.value)}
              className="font-mono bg-input/50 border-border/60 focus:border-ring focus-visible:ring-ring/30 text-sm"
              aria-invalid={!!errors.close}
            />
            {errors.close && (
              <p className="text-xs text-bear">{errors.close}</p>
            )}
          </div>
        </div>
      </div>

      {/* Volume */}
      <div className="space-y-1.5">
        <Label
          htmlFor="volume"
          className="text-xs font-mono uppercase tracking-widest text-muted-foreground"
        >
          Volume
        </Label>
        <Input
          id="volume"
          type="number"
          step="any"
          data-ocid="trading.volume_input"
          placeholder="1000000"
          value={volume}
          onChange={(e) => setVolume(e.target.value)}
          className="font-mono bg-input/50 border-border/60 focus:border-ring focus-visible:ring-ring/30 text-sm"
          aria-invalid={!!errors.volume}
        />
        {errors.volume && <p className="text-xs text-bear">{errors.volume}</p>}
      </div>

      {/* Notes */}
      <div className="space-y-1.5">
        <Label
          htmlFor="notes"
          className="text-xs font-mono uppercase tracking-widest text-muted-foreground"
        >
          Notes{" "}
          <span className="text-muted-foreground/50 normal-case tracking-normal">
            (optional)
          </span>
        </Label>
        <Textarea
          id="notes"
          data-ocid="trading.notes_input"
          placeholder="e.g. Recent breakout above resistance, increased volume..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="font-mono bg-input/50 border-border/60 focus:border-ring focus-visible:ring-ring/30 text-sm min-h-[72px] resize-none placeholder:opacity-40"
          rows={3}
        />
      </div>

      {/* Submit */}
      <motion.div whileTap={{ scale: 0.98 }}>
        <Button
          type="submit"
          data-ocid="trading.submit_button"
          disabled={isLoading}
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-mono tracking-wider text-sm font-semibold h-11 transition-all duration-200"
        >
          {isLoading ? (
            <>
              <Loader2
                data-ocid="trading.loading_state"
                className="mr-2 h-4 w-4 animate-spin"
              />
              <span>Analyzing Market...</span>
            </>
          ) : (
            <>
              <TrendingUp className="mr-2 h-4 w-4" />
              <span>Analyze Market</span>
            </>
          )}
        </Button>
      </motion.div>
    </form>
  );
}
