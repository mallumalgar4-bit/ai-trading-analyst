import Map "mo:core/Map";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Float "mo:core/Float";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Int "mo:core/Int";
import Order "mo:core/Order";

actor {
  type MarketData = {
    symbol : Text;
    timeframe : Text;
    open : Float;
    high : Float;
    low : Float;
    close : Float;
    volume : Float;
    notes : ?Text;
  };

  type TechnicalAnalysisResult = {
    trend : Text;
    supportLevel : Float;
    resistanceLevel : Float;
    candlestickPattern : Text;
    rsiSignal : Text;
    macdSignal : Text;
    movingAverageSignal : Text;
    momentum : Text;
    liquidityZone : Float;
    tradeSignal : Text;
    entryPrice : Float;
    stopLoss : Float;
    takeProfit1 : Float;
    takeProfit2 : Float;
    takeProfit3 : Float;
    riskRewardRatio : Float;
    confidenceLevel : Text;
    reasoning : Text;
  };

  type AnalysisRecord = {
    id : Nat;
    timestamp : Int;
    marketData : MarketData;
    analysis : TechnicalAnalysisResult;
  };

  module AnalysisRecord {
    public func compareByTimestampDesc(a : AnalysisRecord, b : AnalysisRecord) : Order.Order {
      Int.compare(b.timestamp, a.timestamp);
    };
  };

  let analysisMap = Map.empty<Nat, AnalysisRecord>();
  var nextId = 0;

  func calculateTrend(close : Float, open : Float, high : Float, low : Float) : Text {
    let range = high - low;
    let movement = close - open;

    if (Float.abs(movement) < (0.05 * range)) {
      "sideways";
    } else if (movement > 0) {
      "bullish";
    } else {
      "bearish";
    };
  };

  func calculateSupportLevel(low : Float) : Float {
    low - (low * 0.005);
  };

  func calculateResistanceLevel(high : Float) : Float {
    high + (high * 0.005);
  };

  func detectCandlestickPattern(open : Float, close : Float, high : Float, low : Float) : Text {
    let bodySize = Float.abs(close - open);
    let range = high - low;

    if (bodySize < (0.15 * range)) {
      "doji";
    } else if ((close > open) and (close - open > 0.6 * range)) {
      "bullish";
    } else {
      "bearish";
    };
  };

  func calculateRSISignal(close : Float, high : Float, low : Float) : Text {
    let range = high - low;

    if ((high - close) < 0.2 * range) {
      "overbought";
    } else if ((close - low) < 0.2 * range) {
      "oversold";
    } else {
      "neutral";
    };
  };

  func calculateMACDSignal(close : Float, open : Float) : Text {
    let movement = close - open;

    if (Float.abs(movement) < (0.03 * open)) {
      "neutral";
    } else if (movement > 0) {
      "bullish crossover";
    } else {
      "bearish crossover";
    };
  };

  func calculateMovingAverageSignal(close : Float, high : Float, low : Float) : Text {
    let range = high - low;

    if ((high - close) < 0.33 * range) {
      "above MA";
    } else {
      "below MA";
    };
  };

  func calculateMomentum(
    close : Float,
    open : Float,
    high : Float,
    low : Float,
  ) : Text {
    let range = high - low;
    let movement = Float.abs(close - open);

    if (movement < (0.015 * range)) {
      "weak";
    } else if (movement < (0.07 * range)) {
      "moderate";
    } else {
      "strong";
    };
  };

  func calculateLiquidityZone(high : Float, low : Float) : Float {
    (high + low) / 2;
  };

  func generateTradeSignal(
    trend : Text,
    rsiSignal : Text,
    macdSignal : Text,
    movingAverageSignal : Text,
  ) : Text {
    let isBullish = trend == "bullish" or rsiSignal == "oversold" or macdSignal == "bullish crossover" or movingAverageSignal == "above MA";
    let isBearish = trend == "bearish" or rsiSignal == "overbought" or macdSignal == "bearish crossover" or movingAverageSignal == "below MA";

    if (isBullish and not isBearish) {
      "Buy";
    } else if (isBearish and not isBullish) {
      "Sell";
    } else {
      "Wait";
    };
  };

  func calculateTradeTargets(
    entryPrice : Float,
    tradeSignal : Text,
    high : Float,
    low : Float,
  ) : (Float, Float, Float, Float, Float, Float) {
    let atr = (high - low) * 0.5;

    var stopLoss = entryPrice - 2.0 * atr;
    var target1 = entryPrice + 1.5 * atr;
    var target2 = entryPrice + 2.5 * atr;
    var target3 = entryPrice + 4.0 * atr;

    if (tradeSignal == "Sell") {
      stopLoss := entryPrice + 2.0 * atr;
      target1 := entryPrice - 1.5 * atr;
      target2 := entryPrice - 2.5 * atr;
      target3 := entryPrice - 4.0 * atr;
    };

    (stopLoss, target1, target2, target3, high - low, atr);
  };

  func calculateRiskRewardRatio(
    entryPrice : Float,
    stopLoss : Float,
    targets : [Float],
    tradeSignal : Text,
  ) : Float {
    let risk = Float.abs(entryPrice - stopLoss);
    let potentialReward = switch (tradeSignal) {
      case ("Buy") { targets[0] - entryPrice };
      case ("Sell") { entryPrice - targets[0] };
      case (_) { 0.0 };
    };

    if (risk > 0) {
      potentialReward / risk;
    } else { 0 };
  };

  func determineConfidenceLevel(
    rsiSignal : Text,
    tradeSignal : Text,
    macdSignal : Text,
  ) : Text {
    let signals = [rsiSignal, tradeSignal, macdSignal];

    let bullishSignals = signals.filter(
      func(s) {
        (s == "overbought") or (s == "Buy") or (s == "bullish crossover");
      }
    ).size();

    let bearishSignals = signals.filter(
      func(s) {
        (s == "oversold") or (s == "Sell") or (s == "bearish crossover");
      }
    ).size();

    if ((bullishSignals > 2) or (bearishSignals > 2)) {
      "High";
    } else if ((bullishSignals == 2) or (bearishSignals == 2)) {
      "Medium";
    } else {
      "Low";
    };
  };

  func generateReasoningText(
    asset : Text,
    trend : Text,
    rsiSignal : Text,
    macdSignal : Text,
    movingAverageSignal : Text,
    candlestickPattern : Text,
    tradeSignal : Text,
    stopLoss : Float,
    target1 : Float,
    target2 : Float,
    target3 : Float,
    riskRewardRatio : Float,
  ) : Text {
    let baseReasoning = "Analyzing " # asset # " on the " # trend # " trend.";

    let indicatorReasoning = rsiSignal # " RSI, " # macdSignal # " MACD, " # movingAverageSignal;

    let patternReasoning = candlestickPattern;

    let tradeAction = if (tradeSignal == "Buy") {
      "A potential buy signal is identified, with the following trade setup: ";
    } else if (tradeSignal == "Sell") {
      "A potential sell signal is identified, with the following trade setup: ";
    } else {
      "No clear trade signal found.";
    };

    let targetsText = "Stop loss at " # stopLoss.toText() # ", targets at " # target1.toText() # " / " # target2.toText() # " / " # target3.toText();

    let riskRewardText = "Risk-reward ratio: " # riskRewardRatio.toText();

    baseReasoning
    # "\n"
    # indicatorReasoning
    # "\n"
    # patternReasoning
    # "\n"
    # tradeAction
    # "\n"
    # targetsText
    # "\n"
    # riskRewardText;
  };

  func performTechnicalAnalysis(data : MarketData) : TechnicalAnalysisResult {
    let trend = calculateTrend(data.close, data.open, data.high, data.low);
    let supportLevel = calculateSupportLevel(data.low);
    let resistanceLevel = calculateResistanceLevel(data.high);
    let candlestickPattern = detectCandlestickPattern(data.open, data.close, data.high, data.low);
    let rsiSignal = calculateRSISignal(data.close, data.high, data.low);
    let macdSignal = calculateMACDSignal(data.close, data.open);
    let movingAverageSignal = calculateMovingAverageSignal(data.close, data.high, data.low);
    let momentum = calculateMomentum(data.close, data.open, data.high, data.low);
    let liquidityZone = calculateLiquidityZone(data.high, data.low);

    let tradeSignal = generateTradeSignal(trend, rsiSignal, macdSignal, movingAverageSignal);

    let entryPrice = data.close;

    let (stopLoss, target1, target2, target3, _, _) = calculateTradeTargets(entryPrice, tradeSignal, data.high, data.low);

    let riskRewardRatio = calculateRiskRewardRatio(entryPrice, stopLoss, [target1], tradeSignal);

    let confidenceLevel = determineConfidenceLevel(tradeSignal, rsiSignal, macdSignal);

    let reasoning = generateReasoningText(
      data.symbol,
      trend,
      rsiSignal,
      macdSignal,
      movingAverageSignal,
      candlestickPattern,
      tradeSignal,
      stopLoss,
      target1,
      target2,
      target3,
      riskRewardRatio,
    );

    {
      trend;
      supportLevel;
      resistanceLevel;
      candlestickPattern;
      rsiSignal;
      macdSignal;
      movingAverageSignal;
      momentum;
      liquidityZone;
      tradeSignal;
      entryPrice;
      stopLoss;
      takeProfit1 = target1;
      takeProfit2 = target2;
      takeProfit3 = target3;
      riskRewardRatio;
      confidenceLevel;
      reasoning;
    };
  };

  public shared ({ caller }) func analyzeMarketData(marketData : MarketData) : async Nat {
    let analysis = performTechnicalAnalysis(marketData);

    let id = nextId;
    nextId += 1;

    let record : AnalysisRecord = {
      id;
      timestamp = Time.now();
      marketData;
      analysis;
    };

    analysisMap.add(id, record);

    id;
  };

  public query ({ caller }) func getAnalysisById(id : Nat) : async AnalysisRecord {
    switch (analysisMap.get(id)) {
      case (?record) { record };
      case (null) { Runtime.trap("Id does not exist") };
    };
  };

  public query ({ caller }) func getAllAnalyses() : async [AnalysisRecord] {
    analysisMap.values().toArray().sort(AnalysisRecord.compareByTimestampDesc);
  };

  public query ({ caller }) func getAnalysesBySymbol(symbol : Text) : async [AnalysisRecord] {
    let filtered = analysisMap.values().toArray().filter(
      func(record) {
        record.marketData.symbol == symbol;
      }
    );
    filtered.sort(AnalysisRecord.compareByTimestampDesc);
  };

  public query ({ caller }) func getAnalysesInRange(startTime : Int, endTime : Int) : async [AnalysisRecord] {
    let filtered = analysisMap.values().toArray().filter(
      func(record) {
        record.timestamp >= startTime and record.timestamp <= endTime
      }
    );
    filtered.sort(AnalysisRecord.compareByTimestampDesc);
  };

  public query ({ caller }) func getAnalysesCount() : async Nat {
    nextId;
  };
};
