import React, { useEffect, useRef, useState } from 'react';
import { CandlestickIcon, LineChartIcon, VolumeIcon } from './LogoIcons';

interface TradingChartProps {
  symbol: string;
  data: ChartData[];
  signal?: string;
  isLoading?: boolean;
}

interface ChartData {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface Indicator {
  type: 'RSI' | 'MACD' | 'MA' | 'BOLLINGER';
  value: number;
  signal: 'BUY' | 'SELL' | 'NEUTRAL';
  color: string;
}

export const TradingChart: React.FC<TradingChartProps> = ({
  symbol,
  data,
  signal,
  isLoading = false
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [indicators, setIndicators] = useState<Indicator[]>([]);
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>('1H');
  const [chartType, setChartType] = useState<'candlestick' | 'line'>('candlestick');
  const [showVolume, setShowVolume] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });

  const timeframes = ['1M', '5M', '15M', '1H', '4H', '1D', '1W'];

  useEffect(() => {
    if (!canvasRef.current || !data.length) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    drawChart(ctx, canvas);
  }, [data, chartType, showVolume, zoomLevel, panOffset]);

  const drawChart = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    const { width, height } = canvas;

    // Clear canvas
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, width, height);

    if (!data.length) return;

    // Calculate price range
    const prices = data.flatMap(d => [d.high, d.low]);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const priceRange = maxPrice - minPrice;

    // Chart area dimensions
    const chartHeight = showVolume ? height * 0.7 : height * 0.9;
    const volumeHeight = showVolume ? height * 0.2 : 0;
    const padding = { top: 20, right: 80, bottom: 20, left: 20 };

    // Draw grid
    drawGrid(ctx, width, chartHeight, padding);

    // Draw price chart
    if (chartType === 'candlestick') {
      drawCandlesticks(ctx, data, width, chartHeight, padding, minPrice, priceRange);
    } else {
      drawLineChart(ctx, data, width, chartHeight, padding, minPrice, priceRange);
    }

    // Draw volume
    if (showVolume) {
      drawVolume(ctx, data, width, volumeHeight, chartHeight + padding.top);
    }

    // Draw indicators
    drawIndicators(ctx, width, chartHeight, padding);

    // Draw signal markers
    if (signal) {
      drawSignalMarkers(ctx, signal, width, chartHeight);
    }

    // Draw price scale
    drawPriceScale(ctx, width, chartHeight, padding, minPrice, maxPrice);

    // Draw time scale
    drawTimeScale(ctx, data, width, height, padding);
  };

  const drawGrid = (ctx: CanvasRenderingContext2D, width: number, height: number, padding: any) => {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;

    // Horizontal lines
    for (let i = 0; i <= 10; i++) {
      const y = padding.top + (height - padding.top - padding.bottom) * (i / 10);
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();
    }

    // Vertical lines
    for (let i = 0; i <= 20; i++) {
      const x = padding.left + (width - padding.left - padding.right) * (i / 20);
      ctx.beginPath();
      ctx.moveTo(x, padding.top);
      ctx.lineTo(x, height - padding.bottom);
      ctx.stroke();
    }
  };

  const drawCandlesticks = (
    ctx: CanvasRenderingContext2D,
    data: ChartData[],
    width: number,
    height: number,
    padding: any,
    minPrice: number,
    priceRange: number
  ) => {
    const candleWidth = (width - padding.left - padding.right) / data.length * 0.8;
    const chartAreaHeight = height - padding.top - padding.bottom;

    data.forEach((candle, index) => {
      const x = padding.left + (width - padding.left - padding.right) * (index / data.length);

      // Calculate y positions
      const highY = padding.top + chartAreaHeight * (1 - (candle.high - minPrice) / priceRange);
      const lowY = padding.top + chartAreaHeight * (1 - (candle.low - minPrice) / priceRange);
      const openY = padding.top + chartAreaHeight * (1 - (candle.open - minPrice) / priceRange);
      const closeY = padding.top + chartAreaHeight * (1 - (candle.close - minPrice) / priceRange);

      const isBullish = candle.close > candle.open;

      // Draw wick
      ctx.strokeStyle = isBullish ? '#00ff88' : '#ff4757';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x + candleWidth / 2, highY);
      ctx.lineTo(x + candleWidth / 2, lowY);
      ctx.stroke();

      // Draw body
      ctx.fillStyle = isBullish ? '#00ff88' : '#ff4757';
      const bodyHeight = Math.abs(closeY - openY);
      const bodyY = Math.min(openY, closeY);

      if (bodyHeight < 1) {
        // Doji - draw line
        ctx.fillRect(x, bodyY, candleWidth, 1);
      } else {
        ctx.fillRect(x, bodyY, candleWidth, bodyHeight);
      }

      // Add glow effect for current candle
      if (index === data.length - 1) {
        ctx.shadowColor = isBullish ? '#00ff88' : '#ff4757';
        ctx.shadowBlur = 10;
        ctx.fillRect(x, bodyY, candleWidth, bodyHeight);
        ctx.shadowBlur = 0;
      }
    });
  };

  const drawLineChart = (
    ctx: CanvasRenderingContext2D,
    data: ChartData[],
    width: number,
    height: number,
    padding: any,
    minPrice: number,
    priceRange: number
  ) => {
    if (data.length < 2) return;

    const chartAreaHeight = height - padding.top - padding.bottom;

    // Create gradient
    const gradient = ctx.createLinearGradient(0, padding.top, 0, height - padding.bottom);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0.05)');

    // Draw area
    ctx.beginPath();
    data.forEach((point, index) => {
      const x = padding.left + (width - padding.left - padding.right) * (index / (data.length - 1));
      const y = padding.top + chartAreaHeight * (1 - (point.close - minPrice) / priceRange);

      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    // Close area path
    const lastX = padding.left + (width - padding.left - padding.right);
    ctx.lineTo(lastX, height - padding.bottom);
    ctx.lineTo(padding.left, height - padding.bottom);
    ctx.closePath();

    ctx.fillStyle = gradient;
    ctx.fill();

    // Draw line
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    data.forEach((point, index) => {
      const x = padding.left + (width - padding.left - padding.right) * (index / (data.length - 1));
      const y = padding.top + chartAreaHeight * (1 - (point.close - minPrice) / priceRange);

      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.stroke();
  };

  const drawVolume = (
    ctx: CanvasRenderingContext2D,
    data: ChartData[],
    width: number,
    height: number,
    startY: number
  ) => {
    const maxVolume = Math.max(...data.map(d => d.volume));
    const barWidth = (width - 40) / data.length * 0.8;

    data.forEach((candle, index) => {
      const x = 20 + (width - 40) * (index / data.length);
      const barHeight = (candle.volume / maxVolume) * height;
      const isBullish = candle.close > candle.open;

      ctx.fillStyle = isBullish ? 'rgba(0, 255, 136, 0.5)' : 'rgba(255, 71, 87, 0.5)';
      ctx.fillRect(x, startY + height - barHeight, barWidth, barHeight);
    });
  };

  const drawIndicators = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    padding: any
  ) => {
    // RSI indicator
    const rsiValue = calculateRSI();
    drawRSI(ctx, rsiValue, width, height);

    // MACD indicator
    const macdData = calculateMACD();
    drawMACD(ctx, macdData, width, height);
  };

  const calculateRSI = (): number => {
    // Simplified RSI calculation
    if (data.length < 14) return 50;

    const period = 14;
    const changes = data.slice(-period - 1).map((candle, i, arr) =>
      i === 0 ? 0 : candle.close - arr[i - 1].close
    ).slice(1);

    const gains = changes.filter(change => change > 0);
    const losses = changes.filter(change => change < 0).map(loss => Math.abs(loss));

    const avgGain = gains.reduce((sum, gain) => sum + gain, 0) / period;
    const avgLoss = losses.reduce((sum, loss) => sum + loss, 0) / period;

    if (avgLoss === 0) return 100;

    const rs = avgGain / avgLoss;
    return 100 - (100 / (1 + rs));
  };

  const calculateMACD = () => {
    // Simplified MACD calculation
    const ema12 = calculateEMA(12);
    const ema26 = calculateEMA(26);
    const macdLine = ema12 - ema26;
    const signalLine = calculateEMA(9, [macdLine]);
    const histogram = macdLine - signalLine;

    return { macdLine, signalLine, histogram };
  };

  const calculateEMA = (period: number, values?: number[]): number => {
    const prices = values || data.map(d => d.close);
    if (prices.length < period) return prices[prices.length - 1] || 0;

    const multiplier = 2 / (period + 1);
    let ema = prices.slice(0, period).reduce((sum, price) => sum + price, 0) / period;

    for (let i = period; i < prices.length; i++) {
      ema = (prices[i] - ema) * multiplier + ema;
    }

    return ema;
  };

  const drawRSI = (ctx: CanvasRenderingContext2D, rsi: number, width: number, height: number) => {
    const rsiY = height - 60;
    const rsiWidth = 100;

    // RSI background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(width - rsiWidth - 10, rsiY - 20, rsiWidth, 40);

    // RSI value
    ctx.fillStyle = rsi > 70 ? '#ff4757' : rsi < 30 ? '#00ff88' : '#ffffff';
    ctx.font = '12px monospace';
    ctx.fillText(`RSI: ${rsi.toFixed(1)}`, width - rsiWidth, rsiY);
  };

  const drawMACD = (ctx: CanvasRenderingContext2D, macd: any, width: number, height: number) => {
    const macdY = height - 100;
    const macdWidth = 120;

    // MACD background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(width - macdWidth - 10, macdY - 20, macdWidth, 40);

    // MACD values
    ctx.fillStyle = '#ffffff';
    ctx.font = '10px monospace';
    ctx.fillText(`MACD: ${macd.macdLine.toFixed(4)}`, width - macdWidth, macdY - 10);
    ctx.fillText(`Signal: ${macd.signalLine.toFixed(4)}`, width - macdWidth, macdY + 5);
    ctx.fillText(`Hist: ${macd.histogram.toFixed(4)}`, width - macdWidth, macdY + 20);
  };

  const drawSignalMarkers = (
    ctx: CanvasRenderingContext2D,
    signal: string,
    width: number,
    height: number
  ) => {
    const markerSize = 20;
    const x = width - 100;
    const y = 50;

    // Signal background
    ctx.fillStyle = signal === 'BUY' ? '#00ff88' : signal === 'SELL' ? '#ff4757' : '#ffa502';
    ctx.beginPath();
    ctx.arc(x, y, markerSize, 0, 2 * Math.PI);
    ctx.fill();

    // Signal text
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(signal, x, y + 4);

    // Glow effect
    ctx.shadowColor = ctx.fillStyle;
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.arc(x, y, markerSize, 0, 2 * Math.PI);
    ctx.fill();
    ctx.shadowBlur = 0;
  };

  const drawPriceScale = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    padding: any,
    minPrice: number,
    maxPrice: number
  ) => {
    ctx.fillStyle = '#cccccc';
    ctx.font = '10px monospace';
    ctx.textAlign = 'left';

    for (let i = 0; i <= 10; i++) {
      const price = minPrice + (maxPrice - minPrice) * (1 - i / 10);
      const y = padding.top + (height - padding.top - padding.bottom) * (i / 10);
      ctx.fillText(price.toFixed(5), width - 75, y + 3);
    }
  };

  const drawTimeScale = (
    ctx: CanvasRenderingContext2D,
    data: ChartData[],
    width: number,
    height: number,
    padding: any
  ) => {
    ctx.fillStyle = '#cccccc';
    ctx.font = '10px monospace';
    ctx.textAlign = 'center';

    const step = Math.max(1, Math.floor(data.length / 10));
    for (let i = 0; i < data.length; i += step) {
      const x = padding.left + (width - padding.left - padding.right) * (i / data.length);
      const time = new Date(data[i].timestamp).toLocaleTimeString();
      ctx.fillText(time, x, height - 5);
    }
  };

  return (
    <div className="trading-chart">
      <div className="chart-controls">
        <div className="timeframe-selector">
          {timeframes.map(tf => (
            <button
              key={tf}
              className={`timeframe-btn ${selectedTimeframe === tf ? 'active' : ''}`}
              onClick={() => setSelectedTimeframe(tf)}
            >
              {tf}
            </button>
          ))}
        </div>

        <div className="chart-options">
          <button
            className={`option-btn ${chartType === 'candlestick' ? 'active' : ''}`}
            onClick={() => setChartType('candlestick')}
          >
            <CandlestickIcon size={16} /> Candlestick
          </button>
          <button
            className={`option-btn ${chartType === 'line' ? 'active' : ''}`}
            onClick={() => setChartType('line')}
          >
            <LineChartIcon size={16} /> Line
          </button>
          <button
            className={`option-btn ${showVolume ? 'active' : ''}`}
            onClick={() => setShowVolume(!showVolume)}
          >
            <VolumeIcon size={16} /> Volume
          </button>
        </div>
      </div>

      <div className="chart-container">
        <canvas
          ref={canvasRef}
          width={800}
          height={400}
          className="chart-canvas"
        />

        {isLoading && (
          <div className="chart-loading">
            <div className="loading-spinner"></div>
            <span>Loading chart data...</span>
          </div>
        )}
      </div>

      <div className="chart-info">
        <div className="symbol-info">
          <h3>{symbol}</h3>
          {data.length > 0 && (
            <div className="price-info">
              <span className="current-price">
                {data[data.length - 1].close.toFixed(5)}
              </span>
              <span className={`price-change ${
                data[data.length - 1].close > data[data.length - 1].open
                  ? 'positive' : 'negative'
              }`}>
                {((data[data.length - 1].close - data[data.length - 1].open) /
                  data[data.length - 1].open * 100).toFixed(2)}%
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TradingChart;