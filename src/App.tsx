import React, { useState, useEffect } from 'react';
import { analyzeSymbol } from './api/trading';
import './styles/ios26-liquid.css';
import FullscreenAnalysis from './components/FullscreenAnalysis';
import {
  TrendUpIcon,
  TrendDownIcon,
  PauseIcon,
  AlertIcon
} from './components/Icons';

interface AnalysisResult {
  success: boolean;
  signal: string;
  confidence: number;
  price: number;
  target?: number;
  stop?: number;
  reason: string;
  timestamp: string;
  sources?: Array<{title: string, url: string}>;
}

const TradingAnalyzer: React.FC = () => {
  const [symbol, setSymbol] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string>('');
  const [currentVideo, setCurrentVideo] = useState<number>(1);
  const [videoMessage, setVideoMessage] = useState<string>('Tahlil boshlanmoqda');
  const [analysisComplete, setAnalysisComplete] = useState<boolean>(false);
  const [showFullscreenAnalysis, setShowFullscreenAnalysis] = useState<boolean>(false);
  const [lastAnalysisTime, setLastAnalysisTime] = useState<number>(0);
  const [notification, setNotification] = useState<{show: boolean, message: string, type: 'success' | 'warning' | 'error'}>({
    show: false,
    message: '',
    type: 'success'
  });

  useEffect(() => {
    document.body.style.backgroundColor = '#000000';
  }, []);

  const videoMessages = [
    'Bozorni tahlil qilmoqda...',
    'Malumotlar yigʻilmoqda...',
    'Signal tayorlanmoqda...'
  ];

  const showNotification = (message: string, type: 'success' | 'warning' | 'error' = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: 'success' });
    }, 4000);
  };

  const canPerformAnalysis = () => {
    const now = Date.now();
    const timeDiff = now - lastAnalysisTime;
    const fiveMinutes = 5 * 60 * 1000; // 5 минут в миллисекундах

    return timeDiff >= fiveMinutes;
  };

  const performAnalysis = async (selectedSymbol?: string) => {
    const symbolToAnalyze = selectedSymbol || symbol;

    if (!symbolToAnalyze.trim()) {
      setError('Iltimos, valyuta juftligini kiriting');
      return;
    }

    if (!canPerformAnalysis()) {
      const timeLeft = Math.ceil((5 * 60 * 1000 - (Date.now() - lastAnalysisTime)) / 60000);
      showNotification(`Iltimos, ${timeLeft} daqiqadan so'ng qaytadan urinib ko'ring`, 'warning');
      return;
    }

    setIsAnalyzing(true);
    setError('');
    setResult(null);
    setAnalysisComplete(false);
    setCurrentVideo(1);
    setVideoMessage(videoMessages[0]);

    const videoInterval = setInterval(() => {
      setCurrentVideo(prev => {
        const next = prev >= 3 ? 1 : prev + 1;
        setVideoMessage(videoMessages[next - 1]);
        return next;
      });
    }, 6000);

    try {
      setLastAnalysisTime(Date.now()); // Обновляем время последнего анализа
      const result = await analyzeSymbol(symbolToAnalyze.toUpperCase().trim());
      setResult(result);

      setTimeout(() => {
        clearInterval(videoInterval);
        setIsAnalyzing(false);
        setAnalysisComplete(true);
        setSymbol(''); // Очищаем поле после успешного анализа
        showNotification('Tahlil muvaffaqiyatli yakunlandi!', 'success');
      }, 18000);

    } catch (err) {
      clearInterval(videoInterval);
      setIsAnalyzing(false);
      setError('Tahlil amalga oshirilmadi. Qaytadan urinib koring.');
      console.error('Analysis error:', err);
    }
  };

  const getSignalIcon = (signal: string) => {
    switch (signal) {
      case 'BUY': return <TrendUpIcon />;
      case 'SELL': return <TrendDownIcon />;
      default: return <PauseIcon />;
    }
  };


  const popularPairs = [
    'EURUSD', 'GBPUSD', 'USDJPY', 'XAUUSD', 'BTCUSD', 'ETHUSD',
    'USDCHF', 'AUDUSD', 'NZDUSD', 'USDCAD', 'EURGBP', 'EURJPY'
  ];

  return (
    <div className="trading-analyzer">
      <div className="main-content">

        <div className="liquid-glass-container">
          <div className="input-group">
            <div className="pair-selector">
              <div className="popular-pairs">
                {popularPairs.map(pair => (
                  <button
                    key={pair}
                    className={`liquid-glass-btn ${symbol === pair ? 'active' : ''}`}
                    onClick={() => {
                      setSymbol(pair);
                      performAnalysis(pair);
                    }}
                    disabled={isAnalyzing}
                  >
                    {pair}
                  </button>
                ))}
              </div>
            </div>

            <div className="custom-input">
              <input
                type="text"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                placeholder="Boshqa juftlik kiriting..."
                className="liquid-glass-input"
                disabled={isAnalyzing}
              />
            </div>

            <button
              onClick={() => performAnalysis(symbol)}
              disabled={isAnalyzing || !symbol.trim()}
              className="analyze-btn"
            >
              {isAnalyzing ? 'Tahlil qilinmoqda...' : 'Tahlil qilish'}
            </button>
          </div>
        </div>

        {isAnalyzing && (
          <div className="liquid-glass-container loading-glass">
            <div className="analysis-placeholder">
              <div className="analysis-animation">
                <div className="spinner"></div>
                <div className="charts">
                  <div className="chart-bar" style={{height: '40%'}}></div>
                  <div className="chart-bar" style={{height: '70%'}}></div>
                  <div className="chart-bar" style={{height: '30%'}}></div>
                  <div className="chart-bar" style={{height: '60%'}}></div>
                  <div className="chart-bar" style={{height: '80%'}}></div>
                </div>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${(currentVideo / 3) * 100}%` }}></div>
              </div>
              <h3 className="video-message">{videoMessage}</h3>
              <div className="step-indicator">
                {[1, 2, 3].map(step => (
                  <div
                    key={step}
                    className={`step-dot ${currentVideo >= step ? 'active' : ''}`}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Fullscreen Video Overlay */}
        {isAnalyzing && (
          <div className="fullscreen-video-overlay">
            <video
              key={`video-${currentVideo}`}
              autoPlay
              loop
              muted
              playsInline
              className="fullscreen-video"
              onError={(e) => {
                console.error('Video error:', e);
              }}
            >
              <source src={`/videos/${currentVideo === 1 ? 'money_animation' : currentVideo === 2 ? 'list_animation' : 'computer_animation'}.mp4`} type="video/mp4" />
              <source src={`/videos/analysis${currentVideo}.mp4`} type="video/mp4" />
            </video>
            <div className="fullscreen-overlay-content">
              <div className="overlay-progress-bar">
                <div className="overlay-progress-fill" style={{ width: `${(currentVideo / 3) * 100}%` }}></div>
              </div>
              <h2 className="overlay-message">{videoMessage}</h2>
              <div className="overlay-step-indicator">
                {[1, 2, 3].map(step => (
                  <div
                    key={step}
                    className={`overlay-step-dot ${currentVideo >= step ? 'active' : ''}`}
                  />
                ))}
              </div>
            </div>

            {/* Cancel Button */}
            <button
              className="cancel-analysis-btn"
              onClick={() => {
                setIsAnalyzing(false);
                setAnalysisComplete(false);
                setResult(null);
                setError('Tahlil bekor qilindi');
              }}
              aria-label="Tahlilni bekor qilish"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        )}

        {analysisComplete && result && (
          <div className="liquid-glass-container">
            <div className="analysis-complete-new">
              <div className="result-preview">
                <div className="preview-header">
                  <div className="signal-indicator-new">
                    <span className="chart-logo">📊</span>
                    <span className="analysis-ready-text">Tahlil tayyor</span>
                  </div>
                </div>
              </div>

              <button
                className="expand-arrow-btn"
                onClick={() => setShowFullscreenAnalysis(true)}
                aria-label="Batafsil tahlilni ochish"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
        )}

        {error && (
          <div className="error-message">
            <AlertIcon />
            <span>{error}</span>
          </div>
        )}

      </div>

      {/* Notification */}
      {notification.show && (
        <div className={`notification ${notification.type}`}>
          <div className="notification-content">
            <span className="notification-icon">
              {notification.type === 'success' && '✓'}
              {notification.type === 'warning' && '⚠'}
              {notification.type === 'error' && '✗'}
            </span>
            <span className="notification-message">{notification.message}</span>
            <button
              className="notification-close"
              onClick={() => setNotification({ show: false, message: '', type: 'success' })}
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Fullscreen Analysis Modal */}
      <FullscreenAnalysis
        isOpen={showFullscreenAnalysis}
        onClose={() => setShowFullscreenAnalysis(false)}
        result={result}
        symbol={symbol}
      />
    </div>
  );
};

const App: React.FC = () => {
  return <TradingAnalyzer />;
};

export default App;