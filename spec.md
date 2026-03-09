# AI Trading Analyst

## Current State
New project. No existing code.

## Requested Changes (Diff)

### Add
- A trading analysis tool that accepts user-provided market data (asset name, current price, OHLCV data or description) and performs structured technical analysis
- Analysis output includes: Market Trend, Support Levels, Resistance Levels, Trade Setup (Signal, Entry, Stop Loss, Take Profit targets), Confidence Level, and reasoning
- Manual data input form: asset symbol, timeframe, price inputs (open, high, low, close, volume), optional notes/description
- Analysis history stored per session — list of past analyses with ability to review them
- Ability to re-run analysis on previously entered data

### Modify
N/A

### Remove
N/A

## Implementation Plan

### Backend (Motoko)
- Store analysis records: id, timestamp, asset symbol, timeframe, price data (OHLCV), user notes, and the resulting analysis output
- `submitAnalysis(input: AnalysisInput) : async AnalysisResult` — accepts market data, computes simulated technical analysis (trend, support/resistance, candlestick patterns, RSI/MACD/MA signals, momentum, RR ratio, trade setup), returns structured result and saves to history
- `getAnalysisHistory() : async [AnalysisRecord]` — returns all past analyses
- `getAnalysis(id: Nat) : async ?AnalysisRecord` — fetch a single record

### Frontend (React)
- Landing/main page with two panels: input form (left) and analysis result (right)
- Input form fields: Asset Symbol, Timeframe selector, OHLC prices, Volume, optional Description/notes
- Submit button triggers analysis
- Results panel shows structured output: Market Trend badge, Support/Resistance levels list, Trade Setup card (Signal badge, Entry, SL, TP1/TP2/TP3), Confidence badge, reasoning text
- Sidebar or bottom section: Analysis History list, clickable to load past results
- Loading state during analysis computation
- Responsive layout
