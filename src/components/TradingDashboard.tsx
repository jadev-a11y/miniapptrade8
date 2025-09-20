import React, { useState, useEffect, useRef } from 'react';
import TradingChart from './TradingChart';
import MarketAnalyzer from './MarketAnalyzer';
import { ChartIcon, TrendUpIcon, MoneyIcon, RefreshIcon, ClipboardIcon, BoltIcon } from './LogoIcons';

interface Position {
  id: string;
  symbol: string;
  type: 'LONG' | 'SHORT';
  entryPrice: number;
  currentPrice: number;
  quantity: number;
  pnl: number;
  pnlPercent: number;
  timestamp: number;
  stopLoss?: number;
  takeProfit?: number;
  status: 'OPEN' | 'CLOSED' | 'PENDING';
}

interface WatchlistItem {
  symbol: string;
  price: number;
  change24h: number;
  alertPrice?: number;
  isMonitoring: boolean;
}

interface TradingSignal {
  id: string;
  symbol: string;
  signal: 'BUY' | 'SELL';
  confidence: number;
  entryPrice: number;
  targetPrice: number;
  stopLoss: number;
  timeframe: string;
  timestamp: number;
  isActive: boolean;
  reasoning: string;
}

interface PerformanceMetrics {
  totalPnL: number;
  winRate: number;
  totalTrades: number;
  averageWin: number;
  averageLoss: number;
  maxDrawdown: number;
  sharpeRatio: number;
  profitFactor: number;
}

export const TradingDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'positions' | 'signals' | 'analytics'>('overview');
  const [positions, setPositions] = useState<Position[]>([]);
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [signals, setSignals] = useState<TradingSignal[]>([]);
  const [performance, setPerformance] = useState<PerformanceMetrics | null>(null);
  const [isLiveMode, setIsLiveMode] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<string[]>([]);
  const [darkMode, setDarkMode] = useState<boolean>(true);

  const dashboardRef = useRef<HTMLDivElement>(null);

  const majorPairs = [
    'EURUSD', 'GBPUSD', 'USDJPY', 'AUDUSD', 'USDCAD', 'USDCHF'
  ];

  const cryptoPairs = [
    'BTCUSD', 'ETHUSD', 'ADAUSD', 'DOTUSDT', 'LINKUSD', 'BNBUSD'
  ];

  const commodities = [
    'XAUUSD', 'XAGUSD', 'USOIL', 'NGAS', 'COPPER', 'WHEAT'
  ];

  useEffect(() => {
    initializeDashboard();
    const interval = setInterval(updateRealTimeData, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isLiveMode) {
      const signalInterval = setInterval(generateTradingSignals, 30000);
      return () => clearInterval(signalInterval);
    }
  }, [isLiveMode]);

  const initializeDashboard = () => {
    // Initialize with demo data
    const demoPositions: Position[] = [
      {
        id: '1',
        symbol: 'EURUSD',
        type: 'LONG',
        entryPrice: 1.2050,
        currentPrice: 1.2075,
        quantity: 100000,
        pnl: 250,
        pnlPercent: 2.07,
        timestamp: Date.now() - 3600000,
        stopLoss: 1.2000,
        takeProfit: 1.2150,
        status: 'OPEN'
      },
      {
        id: '2',
        symbol: 'GBPUSD',
        type: 'SHORT',
        entryPrice: 1.3850,
        currentPrice: 1.3820,
        quantity: 50000,
        pnl: 150,
        pnlPercent: 1.08,
        timestamp: Date.now() - 7200000,
        stopLoss: 1.3900,
        takeProfit: 1.3750,
        status: 'OPEN'
      }
    ];

    const demoWatchlist: WatchlistItem[] = [
      ...majorPairs.map(symbol => ({
        symbol,
        price: Math.random() * 2 + 0.5,
        change24h: (Math.random() - 0.5) * 5,
        isMonitoring: Math.random() > 0.5
      })),
      ...cryptoPairs.map(symbol => ({
        symbol,
        price: Math.random() * 50000 + 1000,
        change24h: (Math.random() - 0.5) * 15,
        isMonitoring: Math.random() > 0.5
      }))
    ];

    const demoPerformance: PerformanceMetrics = {
      totalPnL: 2847.50,
      winRate: 68.4,
      totalTrades: 156,
      averageWin: 185.30,
      averageLoss: -89.20,
      maxDrawdown: -345.80,
      sharpeRatio: 1.84,
      profitFactor: 2.31
    };

    setPositions(demoPositions);
    setWatchlist(demoWatchlist);
    setPerformance(demoPerformance);
    generateTradingSignals();
  };

  const updateRealTimeData = () => {
    // Update positions with real-time price changes
    setPositions(prev => prev.map(position => {
      const priceChange = (Math.random() - 0.5) * 0.01;
      const newPrice = position.currentPrice + priceChange;
      const pnl = (newPrice - position.entryPrice) * position.quantity * (position.type === 'LONG' ? 1 : -1);
      const pnlPercent = (pnl / (position.entryPrice * position.quantity)) * 100;

      return {
        ...position,
        currentPrice: newPrice,
        pnl,
        pnlPercent
      };
    }));

    // Update watchlist prices
    setWatchlist(prev => prev.map(item => ({
      ...item,
      price: item.price + (Math.random() - 0.5) * 0.01,
      change24h: item.change24h + (Math.random() - 0.5) * 0.5
    })));
  };

  const generateTradingSignals = () => {
    const symbols = [...majorPairs, ...cryptoPairs.slice(0, 2)];
    const newSignals: TradingSignal[] = symbols.slice(0, 3).map((symbol, index) => {
      const signal = Math.random() > 0.5 ? 'BUY' : 'SELL';
      const entryPrice = Math.random() * 2 + 0.5;
      const confidence = Math.random() * 40 + 60;

      return {
        id: `signal_${Date.now()}_${index}`,
        symbol,
        signal,
        confidence,
        entryPrice,
        targetPrice: entryPrice + (signal === 'BUY' ? 0.01 : -0.01),
        stopLoss: entryPrice + (signal === 'BUY' ? -0.005 : 0.005),
        timeframe: ['1H', '4H', '1D'][Math.floor(Math.random() * 3)],
        timestamp: Date.now(),
        isActive: true,
        reasoning: 'Technical analysis indicates strong momentum with confluence of multiple indicators'
      };
    });

    setSignals(prev => [...newSignals, ...prev.slice(0, 7)]);
  };

  const closePosition = (positionId: string) => {
    setPositions(prev => prev.map(p =>
      p.id === positionId ? { ...p, status: 'CLOSED' as const } : p
    ));
    addNotification(`Position ${positionId} closed successfully`);
  };

  const addToWatchlist = (symbol: string) => {
    if (!watchlist.find(item => item.symbol === symbol)) {
      const newItem: WatchlistItem = {
        symbol,
        price: Math.random() * 2 + 0.5,
        change24h: (Math.random() - 0.5) * 5,
        isMonitoring: false
      };
      setWatchlist(prev => [...prev, newItem]);
    }
  };

  const removeFromWatchlist = (symbol: string) => {
    setWatchlist(prev => prev.filter(item => item.symbol !== symbol));
  };

  const addNotification = (message: string) => {
    setNotifications(prev => [message, ...prev.slice(0, 4)]);
    setTimeout(() => {
      setNotifications(prev => prev.slice(0, -1));
    }, 5000);
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
      currency: 'USD'
    }).format(num);
  };

  const formatPercent = (num: number): string => {
    return `${num >= 0 ? '+' : ''}${formatNumber(num, 2)}%`;
  };

  const getPnLColor = (pnl: number): string => {
    return pnl >= 0 ? '#00ff88' : '#ff4757';
  };

  return (
    <div ref={dashboardRef} className={`trading-dashboard ${darkMode ? 'dark' : 'light'}`}>
      {/* Dashboard Header */}
      <div className="dashboard-header">
        <div className="header-left">
          <h1><ChartIcon size={28} /> Trading Dashboard</h1>
          <div className="mode-toggle">
            <button
              className={`mode-btn ${!isLiveMode ? 'active' : ''}`}
              onClick={() => setIsLiveMode(false)}
            >
              Demo
            </button>
            <button
              className={`mode-btn ${isLiveMode ? 'active' : ''}`}
              onClick={() => setIsLiveMode(true)}
            >
              Live
            </button>
          </div>
        </div>

        <div className="header-right">
          <div className="account-balance">
            <span className="balance-label">Account Balance:</span>
            <span className="balance-amount">$25,847.50</span>
          </div>

          <button
            className="theme-toggle"
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
        </div>
      </div>

      {/* Notifications */}
      {notifications.length > 0 && (
        <div className="notifications">
          {notifications.map((notification, index) => (
            <div key={index} className="notification">
              🔔 {notification}
            </div>
          ))}
        </div>
      )}

      {/* Tab Navigation */}
      <div className="tab-navigation">
        {['overview', 'positions', 'signals', 'analytics'].map(tab => (
          <button
            key={tab}
            className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab as any)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Dashboard Content */}
      <div className="dashboard-content">
        {activeTab === 'overview' && (
          <div className="overview-tab">
            {/* Quick Stats */}
            <div className="quick-stats">
              <div className="stat-card">
                <div className="stat-icon"><MoneyIcon size={24} /></div>
                <div className="stat-info">
                  <div className="stat-label">Total P&L</div>
                  <div className="stat-value" style={{ color: getPnLColor(performance?.totalPnL || 0) }}>
                    {formatCurrency(performance?.totalPnL || 0)}
                  </div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon"><TrendUpIcon size={24} /></div>
                <div className="stat-info">
                  <div className="stat-label">Win Rate</div>
                  <div className="stat-value">{performance?.winRate || 0}%</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon"><RefreshIcon size={24} /></div>
                <div className="stat-info">
                  <div className="stat-label">Total Trades</div>
                  <div className="stat-value">{performance?.totalTrades || 0}</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">⚖️</div>
                <div className="stat-info">
                  <div className="stat-label">Sharpe Ratio</div>
                  <div className="stat-value">{formatNumber(performance?.sharpeRatio || 0, 2)}</div>
                </div>
              </div>
            </div>

            {/* Open Positions Summary */}
            <div className="positions-summary">
              <h3><ClipboardIcon size={20} /> Open Positions</h3>
              <div className="positions-grid">
                {positions.filter(p => p.status === 'OPEN').map(position => (
                  <div key={position.id} className="position-card">
                    <div className="position-header">
                      <span className="position-symbol">{position.symbol}</span>
                      <span className={`position-type ${position.type.toLowerCase()}`}>
                        {position.type}
                      </span>
                    </div>
                    <div className="position-details">
                      <div className="detail-row">
                        <span>Entry:</span>
                        <span>{formatNumber(position.entryPrice, 5)}</span>
                      </div>
                      <div className="detail-row">
                        <span>Current:</span>
                        <span>{formatNumber(position.currentPrice, 5)}</span>
                      </div>
                      <div className="detail-row">
                        <span>P&L:</span>
                        <span style={{ color: getPnLColor(position.pnl) }}>
                          {formatCurrency(position.pnl)} ({formatPercent(position.pnlPercent)})
                        </span>
                      </div>
                    </div>
                    <button
                      className="close-position-btn"
                      onClick={() => closePosition(position.id)}
                    >
                      Close Position
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Watchlist */}
            <div className="watchlist-section">
              <h3>👁️ Watchlist</h3>
              <div className="watchlist-grid">
                {watchlist.slice(0, 8).map(item => (
                  <div key={item.symbol} className="watchlist-item">
                    <div className="watchlist-symbol">{item.symbol}</div>
                    <div className="watchlist-price">{formatNumber(item.price, 5)}</div>
                    <div
                      className="watchlist-change"
                      style={{ color: getPnLColor(item.change24h) }}
                    >
                      {formatPercent(item.change24h)}
                    </div>
                    <button
                      className="remove-watchlist-btn"
                      onClick={() => removeFromWatchlist(item.symbol)}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'positions' && (
          <div className="positions-tab">
            <div className="positions-header">
              <h3><ChartIcon size={20} /> Position Management</h3>
              <div className="position-filters">
                <button className="filter-btn active">All</button>
                <button className="filter-btn">Open</button>
                <button className="filter-btn">Closed</button>
                <button className="filter-btn">Pending</button>
              </div>
            </div>

            <div className="positions-table">
              <div className="table-header">
                <div>Symbol</div>
                <div>Type</div>
                <div>Entry Price</div>
                <div>Current Price</div>
                <div>Quantity</div>
                <div>P&L</div>
                <div>P&L %</div>
                <div>Actions</div>
              </div>

              {positions.map(position => (
                <div key={position.id} className="table-row">
                  <div className="position-symbol">{position.symbol}</div>
                  <div className={`position-type ${position.type.toLowerCase()}`}>
                    {position.type}
                  </div>
                  <div>{formatNumber(position.entryPrice, 5)}</div>
                  <div>{formatNumber(position.currentPrice, 5)}</div>
                  <div>{formatNumber(position.quantity, 0)}</div>
                  <div style={{ color: getPnLColor(position.pnl) }}>
                    {formatCurrency(position.pnl)}
                  </div>
                  <div style={{ color: getPnLColor(position.pnlPercent) }}>
                    {formatPercent(position.pnlPercent)}
                  </div>
                  <div className="position-actions">
                    {position.status === 'OPEN' && (
                      <>
                        <button className="action-btn modify">Modify</button>
                        <button
                          className="action-btn close"
                          onClick={() => closePosition(position.id)}
                        >
                          Close
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'signals' && (
          <div className="signals-tab">
            <div className="signals-header">
              <h3><BoltIcon size={20} /> Trading Signals</h3>
              <button
                className="generate-signals-btn"
                onClick={generateTradingSignals}
              >
                Generate New Signals
              </button>
            </div>

            <div className="signals-grid">
              {signals.map(signal => (
                <div key={signal.id} className="signal-card">
                  <div className="signal-header">
                    <div className="signal-symbol">{signal.symbol}</div>
                    <div
                      className={`signal-type ${signal.signal.toLowerCase()}`}
                      style={{ color: getPnLColor(signal.signal === 'BUY' ? 1 : -1) }}
                    >
                      {signal.signal}
                    </div>
                  </div>

                  <div className="signal-confidence">
                    <span>Confidence: {formatNumber(signal.confidence, 1)}%</span>
                    <div className="confidence-bar">
                      <div
                        className="confidence-fill"
                        style={{
                          width: `${signal.confidence}%`,
                          backgroundColor: signal.confidence > 75 ? '#00ff88' : signal.confidence > 50 ? '#ffa502' : '#ff4757'
                        }}
                      ></div>
                    </div>
                  </div>

                  <div className="signal-details">
                    <div className="detail-item">
                      <span>Entry:</span>
                      <span>{formatNumber(signal.entryPrice, 5)}</span>
                    </div>
                    <div className="detail-item">
                      <span>Target:</span>
                      <span>{formatNumber(signal.targetPrice, 5)}</span>
                    </div>
                    <div className="detail-item">
                      <span>Stop Loss:</span>
                      <span>{formatNumber(signal.stopLoss, 5)}</span>
                    </div>
                    <div className="detail-item">
                      <span>Timeframe:</span>
                      <span>{signal.timeframe}</span>
                    </div>
                  </div>

                  <div className="signal-reasoning">
                    <strong>Reasoning:</strong>
                    <p>{signal.reasoning}</p>
                  </div>

                  <div className="signal-actions">
                    <button className="action-btn execute">Execute Trade</button>
                    <button className="action-btn dismiss">Dismiss</button>
                  </div>

                  <div className="signal-timestamp">
                    {new Date(signal.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="analytics-tab">
            <MarketAnalyzer />
          </div>
        )}
      </div>
    </div>
  );
};

export default TradingDashboard;