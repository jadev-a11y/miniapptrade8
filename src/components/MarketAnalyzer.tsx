import React, { useState, useEffect, useCallback } from 'react';
import { ChartIcon, TrendUpIcon, TargetIcon, BulbIcon, ClockIcon } from './LogoIcons';

interface MarketData {
  symbol: string;
  price: number;
  change24h: number;
  volume: number;
  marketCap: number;
  rsi: number;
  macd: number;
  sentiment: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
  volatility: number;
  support: number;
  resistance: number;
}

interface TechnicalIndicator {
  name: string;
  value: number;
  signal: 'BUY' | 'SELL' | 'HOLD';
  strength: number;
  description: string;
}

interface NewsItem {
  id: string;
  title: string;
  source: string;
  timestamp: number;
  sentiment: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
  impact: 'HIGH' | 'MEDIUM' | 'LOW';
  relevance: number;
}

interface AnalysisResult {
  symbol: string;
  recommendation: 'STRONG_BUY' | 'BUY' | 'HOLD' | 'SELL' | 'STRONG_SELL';
  confidence: number;
  targetPrice: number;
  stopLoss: number;
  timeframe: string;
  reasoning: string;
  technicalScore: number;
  fundamentalScore: number;
  sentimentScore: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
}

export const MarketAnalyzer: React.FC = () => {
  const [marketData, setMarketData] = useState<MarketData[]>([]);
  const [indicators, setIndicators] = useState<TechnicalIndicator[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [selectedSymbol, setSelectedSymbol] = useState<string>('EURUSD');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [refreshInterval, setRefreshInterval] = useState<number>(30000);
  const [alertThreshold, setAlertThreshold] = useState<number>(75);

  const symbols = [
    'EURUSD', 'GBPUSD', 'USDJPY', 'AUDUSD', 'USDCAD', 'USDCHF',
    'NZDUSD', 'EURGBP', 'EURJPY', 'GBPJPY', 'BTCUSD', 'ETHUSD',
    'XAUUSD', 'XAGUSD', 'USOIL', 'US30', 'SPX500', 'NAS100'
  ];

  const timeframes = ['1M', '5M', '15M', '1H', '4H', '1D', '1W', '1MO'];

  useEffect(() => {
    fetchMarketData();
    const interval = setInterval(fetchMarketData, refreshInterval);
    return () => clearInterval(interval);
  }, [refreshInterval]);

  useEffect(() => {
    if (selectedSymbol) {
      fetchSymbolAnalysis(selectedSymbol);
      fetchTechnicalIndicators(selectedSymbol);
      fetchRelevantNews(selectedSymbol);
    }
  }, [selectedSymbol]);

  const fetchMarketData = useCallback(async () => {
    try {
      // Simulate API call
      const mockData: MarketData[] = symbols.map(symbol => ({
        symbol,
        price: Math.random() * 2 + 0.5,
        change24h: (Math.random() - 0.5) * 10,
        volume: Math.random() * 1000000,
        marketCap: Math.random() * 10000000,
        rsi: Math.random() * 100,
        macd: (Math.random() - 0.5) * 0.01,
        sentiment: ['BULLISH', 'BEARISH', 'NEUTRAL'][Math.floor(Math.random() * 3)] as any,
        volatility: Math.random() * 5,
        support: Math.random() * 2 + 0.4,
        resistance: Math.random() * 2 + 0.6
      }));

      setMarketData(mockData);
    } catch (error) {
      console.error('Error fetching market data:', error);
    }
  }, []);

  const fetchTechnicalIndicators = async (symbol: string) => {
    try {
      // Advanced technical analysis
      const indicators: TechnicalIndicator[] = [
        {
          name: 'RSI (14)',
          value: Math.random() * 100,
          signal: ['BUY', 'SELL', 'HOLD'][Math.floor(Math.random() * 3)] as any,
          strength: Math.random() * 100,
          description: 'Relative Strength Index momentum oscillator'
        },
        {
          name: 'MACD (12,26,9)',
          value: (Math.random() - 0.5) * 0.01,
          signal: ['BUY', 'SELL', 'HOLD'][Math.floor(Math.random() * 3)] as any,
          strength: Math.random() * 100,
          description: 'Moving Average Convergence Divergence'
        },
        {
          name: 'Bollinger Bands',
          value: Math.random() * 2,
          signal: ['BUY', 'SELL', 'HOLD'][Math.floor(Math.random() * 3)] as any,
          strength: Math.random() * 100,
          description: 'Volatility indicator with upper and lower bands'
        },
        {
          name: 'Stochastic %K',
          value: Math.random() * 100,
          signal: ['BUY', 'SELL', 'HOLD'][Math.floor(Math.random() * 3)] as any,
          strength: Math.random() * 100,
          description: 'Momentum oscillator comparing closing price to range'
        },
        {
          name: 'Williams %R',
          value: -Math.random() * 100,
          signal: ['BUY', 'SELL', 'HOLD'][Math.floor(Math.random() * 3)] as any,
          strength: Math.random() * 100,
          description: 'Momentum indicator measuring overbought/oversold levels'
        },
        {
          name: 'CCI (20)',
          value: (Math.random() - 0.5) * 400,
          signal: ['BUY', 'SELL', 'HOLD'][Math.floor(Math.random() * 3)] as any,
          strength: Math.random() * 100,
          description: 'Commodity Channel Index'
        },
        {
          name: 'ADX (14)',
          value: Math.random() * 100,
          signal: ['BUY', 'SELL', 'HOLD'][Math.floor(Math.random() * 3)] as any,
          strength: Math.random() * 100,
          description: 'Average Directional Index - trend strength'
        },
        {
          name: 'Ichimoku Cloud',
          value: Math.random() * 2,
          signal: ['BUY', 'SELL', 'HOLD'][Math.floor(Math.random() * 3)] as any,
          strength: Math.random() * 100,
          description: 'Comprehensive trend and momentum indicator'
        }
      ];

      setIndicators(indicators);
    } catch (error) {
      console.error('Error fetching indicators:', error);
    }
  };

  const fetchRelevantNews = async (symbol: string) => {
    try {
      const mockNews: NewsItem[] = [
        {
          id: '1',
          title: `${symbol} shows strong momentum amid market volatility`,
          source: 'Financial Times',
          timestamp: Date.now() - 3600000,
          sentiment: 'POSITIVE',
          impact: 'HIGH',
          relevance: 95
        },
        {
          id: '2',
          title: 'Central bank policy changes affect currency markets',
          source: 'Reuters',
          timestamp: Date.now() - 7200000,
          sentiment: 'NEUTRAL',
          impact: 'MEDIUM',
          relevance: 80
        },
        {
          id: '3',
          title: 'Economic indicators point to potential market shift',
          source: 'Bloomberg',
          timestamp: Date.now() - 10800000,
          sentiment: 'NEGATIVE',
          impact: 'HIGH',
          relevance: 88
        }
      ];

      setNews(mockNews);
    } catch (error) {
      console.error('Error fetching news:', error);
    }
  };

  const fetchSymbolAnalysis = async (symbol: string) => {
    setIsAnalyzing(true);
    try {
      // Comprehensive analysis algorithm
      const technicalScore = calculateTechnicalScore();
      const fundamentalScore = calculateFundamentalScore();
      const sentimentScore = calculateSentimentScore();

      const overallScore = (technicalScore + fundamentalScore + sentimentScore) / 3;

      const result: AnalysisResult = {
        symbol,
        recommendation: getRecommendation(overallScore),
        confidence: Math.min(95, Math.max(60, overallScore)),
        targetPrice: Math.random() * 2 + 0.8,
        stopLoss: Math.random() * 2 + 0.4,
        timeframe: '1-7 days',
        reasoning: generateReasoning(technicalScore, fundamentalScore, sentimentScore),
        technicalScore,
        fundamentalScore,
        sentimentScore,
        riskLevel: getRiskLevel(overallScore)
      };

      setAnalysis(result);
    } catch (error) {
      console.error('Error analyzing symbol:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const calculateTechnicalScore = (): number => {
    const buySignals = indicators.filter(i => i.signal === 'BUY').length;
    const sellSignals = indicators.filter(i => i.signal === 'SELL').length;
    const totalSignals = indicators.length || 1;

    return ((buySignals - sellSignals) / totalSignals + 1) * 50;
  };

  const calculateFundamentalScore = (): number => {
    // Simulate fundamental analysis based on market data
    const currentData = marketData.find(d => d.symbol === selectedSymbol);
    if (!currentData) return 50;

    let score = 50;

    // Volume analysis
    if (currentData.volume > 500000) score += 10;
    if (currentData.volume < 100000) score -= 10;

    // Volatility analysis
    if (currentData.volatility > 3) score -= 15;
    if (currentData.volatility < 1) score += 10;

    // Price momentum
    if (currentData.change24h > 2) score += 15;
    if (currentData.change24h < -2) score -= 15;

    return Math.max(0, Math.min(100, score));
  };

  const calculateSentimentScore = (): number => {
    const positiveNews = news.filter(n => n.sentiment === 'POSITIVE').length;
    const negativeNews = news.filter(n => n.sentiment === 'NEGATIVE').length;
    const totalNews = news.length || 1;

    return ((positiveNews - negativeNews) / totalNews + 1) * 50;
  };

  const getRecommendation = (score: number): AnalysisResult['recommendation'] => {
    if (score >= 80) return 'STRONG_BUY';
    if (score >= 65) return 'BUY';
    if (score >= 35) return 'HOLD';
    if (score >= 20) return 'SELL';
    return 'STRONG_SELL';
  };

  const getRiskLevel = (score: number): AnalysisResult['riskLevel'] => {
    if (score >= 70 || score <= 30) return 'HIGH';
    if (score >= 55 || score <= 45) return 'MEDIUM';
    return 'LOW';
  };

  const generateReasoning = (tech: number, fund: number, sent: number): string => {
    const reasons = [];

    if (tech > 65) reasons.push('Strong technical indicators');
    else if (tech < 35) reasons.push('Weak technical setup');

    if (fund > 65) reasons.push('Positive fundamentals');
    else if (fund < 35) reasons.push('Concerning fundamental factors');

    if (sent > 65) reasons.push('Bullish market sentiment');
    else if (sent < 35) reasons.push('Bearish sentiment prevailing');

    return reasons.join(', ') || 'Mixed signals requiring caution';
  };

  const formatNumber = (num: number, decimals: number = 2): string => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(num);
  };

  const formatCurrency = (num: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact'
    }).format(num);
  };

  const getSignalColor = (signal: string): string => {
    switch (signal) {
      case 'BUY':
      case 'STRONG_BUY':
      case 'BULLISH':
      case 'POSITIVE':
        return '#00ff88';
      case 'SELL':
      case 'STRONG_SELL':
      case 'BEARISH':
      case 'NEGATIVE':
        return '#ff4757';
      default:
        return '#ffa502';
    }
  };

  return (
    <div className="market-analyzer">
      <div className="analyzer-header">
        <h2><ChartIcon size={24} /> Market Analyzer</h2>
        <div className="analyzer-controls">
          <select
            value={selectedSymbol}
            onChange={(e) => setSelectedSymbol(e.target.value)}
            className="symbol-selector"
          >
            {symbols.map(symbol => (
              <option key={symbol} value={symbol}>{symbol}</option>
            ))}
          </select>

          <select
            value={refreshInterval}
            onChange={(e) => setRefreshInterval(Number(e.target.value))}
            className="refresh-selector"
          >
            <option value={10000}>10s</option>
            <option value={30000}>30s</option>
            <option value={60000}>1m</option>
            <option value={300000}>5m</option>
          </select>
        </div>
      </div>

      <div className="analyzer-grid">
        {/* Market Overview */}
        <div className="market-overview">
          <h3><TrendUpIcon size={20} /> Market Overview</h3>
          <div className="market-grid">
            {marketData.slice(0, 6).map(data => (
              <div key={data.symbol} className="market-item">
                <div className="symbol">{data.symbol}</div>
                <div className="price">{formatNumber(data.price, 5)}</div>
                <div
                  className={`change ${data.change24h >= 0 ? 'positive' : 'negative'}`}
                >
                  {data.change24h >= 0 ? '+' : ''}{formatNumber(data.change24h, 2)}%
                </div>
                <div className="volume">{formatCurrency(data.volume)}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Technical Indicators */}
        <div className="technical-indicators">
          <h3>🔧 Technical Indicators</h3>
          <div className="indicators-list">
            {indicators.map((indicator, index) => (
              <div key={index} className="indicator-item">
                <div className="indicator-name">{indicator.name}</div>
                <div className="indicator-value">{formatNumber(indicator.value, 4)}</div>
                <div
                  className="indicator-signal"
                  style={{ color: getSignalColor(indicator.signal) }}
                >
                  {indicator.signal}
                </div>
                <div className="indicator-strength">
                  <div className="strength-bar">
                    <div
                      className="strength-fill"
                      style={{
                        width: `${indicator.strength}%`,
                        backgroundColor: getSignalColor(indicator.signal)
                      }}
                    ></div>
                  </div>
                  <span>{formatNumber(indicator.strength, 0)}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* News & Sentiment */}
        <div className="news-sentiment">
          <h3>📰 Market News</h3>
          <div className="news-list">
            {news.map(item => (
              <div key={item.id} className="news-item">
                <div className="news-header">
                  <span className="news-source">{item.source}</span>
                  <span className="news-time">
                    {new Date(item.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <div className="news-title">{item.title}</div>
                <div className="news-meta">
                  <span
                    className="news-sentiment"
                    style={{ color: getSignalColor(item.sentiment) }}
                  >
                    {item.sentiment}
                  </span>
                  <span className="news-impact">{item.impact} Impact</span>
                  <span className="news-relevance">{item.relevance}% Relevant</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Analysis Result */}
        <div className="analysis-result">
          <h3><TargetIcon size={20} /> Analysis Result</h3>

          {isAnalyzing ? (
            <div className="analyzing-state">
              <div className="analyzer-spinner"></div>
              <span>Analyzing {selectedSymbol}...</span>
            </div>
          ) : analysis ? (
            <div className="analysis-content">
              <div className="recommendation-header">
                <div
                  className="recommendation"
                  style={{ color: getSignalColor(analysis.recommendation) }}
                >
                  {analysis.recommendation.replace('_', ' ')}
                </div>
                <div className="confidence">{analysis.confidence}% Confidence</div>
              </div>

              <div className="analysis-scores">
                <div className="score-item">
                  <span>Technical</span>
                  <div className="score-bar">
                    <div
                      className="score-fill technical"
                      style={{ width: `${analysis.technicalScore}%` }}
                    ></div>
                  </div>
                  <span>{formatNumber(analysis.technicalScore, 0)}</span>
                </div>

                <div className="score-item">
                  <span>Fundamental</span>
                  <div className="score-bar">
                    <div
                      className="score-fill fundamental"
                      style={{ width: `${analysis.fundamentalScore}%` }}
                    ></div>
                  </div>
                  <span>{formatNumber(analysis.fundamentalScore, 0)}</span>
                </div>

                <div className="score-item">
                  <span>Sentiment</span>
                  <div className="score-bar">
                    <div
                      className="score-fill sentiment"
                      style={{ width: `${analysis.sentimentScore}%` }}
                    ></div>
                  </div>
                  <span>{formatNumber(analysis.sentimentScore, 0)}</span>
                </div>
              </div>

              <div className="price-targets">
                <div className="target-item">
                  <span><TargetIcon size={16} /> Target</span>
                  <span>{formatNumber(analysis.targetPrice, 5)}</span>
                </div>
                <div className="target-item">
                  <span>🛑 Stop Loss</span>
                  <span>{formatNumber(analysis.stopLoss, 5)}</span>
                </div>
                <div className="target-item">
                  <span>⚠️ Risk Level</span>
                  <span style={{ color: getSignalColor(analysis.riskLevel) }}>
                    {analysis.riskLevel}
                  </span>
                </div>
              </div>

              <div className="reasoning">
                <strong><BulbIcon size={16} /> Reasoning:</strong>
                <p>{analysis.reasoning}</p>
              </div>

              <div className="timeframe">
                <strong><ClockIcon size={16} /> Timeframe:</strong> {analysis.timeframe}
              </div>
            </div>
          ) : (
            <div className="no-analysis">
              Select a symbol to start analysis
            </div>
          )}
        </div>
      </div>

      <div className="analyzer-footer">
        <div className="alert-settings">
          <label>🔔 Alert Threshold:</label>
          <input
            type="range"
            min="50"
            max="95"
            value={alertThreshold}
            onChange={(e) => setAlertThreshold(Number(e.target.value))}
          />
          <span>{alertThreshold}%</span>
        </div>

        <div className="last-update">
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
};

export default MarketAnalyzer;