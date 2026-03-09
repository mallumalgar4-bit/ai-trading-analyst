/**
 * Format a price value to appropriate decimal places based on magnitude
 */
export function formatPrice(value: number): string {
  if (value === 0) return "0.00";
  const abs = Math.abs(value);
  if (abs >= 10000) return value.toFixed(2);
  if (abs >= 1000) return value.toFixed(2);
  if (abs >= 100) return value.toFixed(3);
  if (abs >= 1) return value.toFixed(4);
  if (abs >= 0.01) return value.toFixed(5);
  return value.toFixed(6);
}

/**
 * Format a timestamp from nanoseconds (bigint) to a human-readable date
 */
export function formatTimestamp(nanoseconds: bigint): string {
  const milliseconds = Number(nanoseconds / 1_000_000n);
  const date = new Date(milliseconds);
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

/**
 * Format a timestamp to a short relative or absolute format for history items
 */
export function formatTimestampShort(nanoseconds: bigint): string {
  const milliseconds = Number(nanoseconds / 1_000_000n);
  const date = new Date(milliseconds);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

/**
 * Format volume with K/M/B suffixes
 */
export function formatVolume(value: number): string {
  if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(2)}B`;
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(2)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(2)}K`;
  return value.toFixed(2);
}

/**
 * Get signal class name for a trade signal
 */
export function getSignalClass(signal: string): string {
  const upper = signal.toUpperCase();
  if (upper.includes("BUY") || upper.includes("BULL") || upper.includes("LONG"))
    return "bull";
  if (
    upper.includes("SELL") ||
    upper.includes("BEAR") ||
    upper.includes("SHORT")
  )
    return "bear";
  return "neutral";
}

/**
 * Get trend class name for a trend label
 */
export function getTrendClass(trend: string): string {
  const lower = trend.toLowerCase();
  if (lower.includes("bull") || lower.includes("up")) return "bull";
  if (lower.includes("bear") || lower.includes("down")) return "bear";
  return "neutral";
}

/**
 * Get confidence color class
 */
export function getConfidenceClass(confidence: string): string {
  const lower = confidence.toLowerCase();
  if (lower.includes("high")) return "bull";
  if (lower.includes("medium") || lower.includes("moderate")) return "neutral";
  return "muted";
}
