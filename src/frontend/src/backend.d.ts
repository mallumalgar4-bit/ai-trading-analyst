import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface MarketData {
    low: number;
    timeframe: string;
    high: number;
    close: number;
    open: number;
    volume: number;
    notes?: string;
    symbol: string;
}
export interface TechnicalAnalysisResult {
    macdSignal: string;
    trend: string;
    movingAverageSignal: string;
    candlestickPattern: string;
    liquidityZone: number;
    momentum: string;
    reasoning: string;
    confidenceLevel: string;
    resistanceLevel: number;
    supportLevel: number;
    rsiSignal: string;
    stopLoss: number;
    tradeSignal: string;
    entryPrice: number;
    takeProfit1: number;
    takeProfit2: number;
    takeProfit3: number;
    riskRewardRatio: number;
}
export interface AnalysisRecord {
    id: bigint;
    marketData: MarketData;
    timestamp: bigint;
    analysis: TechnicalAnalysisResult;
}
export interface backendInterface {
    analyzeMarketData(marketData: MarketData): Promise<bigint>;
    getAllAnalyses(): Promise<Array<AnalysisRecord>>;
    getAnalysesBySymbol(symbol: string): Promise<Array<AnalysisRecord>>;
    getAnalysesCount(): Promise<bigint>;
    getAnalysesInRange(startTime: bigint, endTime: bigint): Promise<Array<AnalysisRecord>>;
    getAnalysisById(id: bigint): Promise<AnalysisRecord>;
}
