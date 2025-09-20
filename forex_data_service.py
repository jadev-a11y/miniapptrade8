#!/usr/bin/env python3
"""
Real-time Forex Data Service using yfinance
Provides HTTP API for accessing current forex prices
"""

import yfinance as yf
import json
import sys
import requests
from datetime import datetime
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs
import threading
import time
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class ForexDataHandler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        """Handle CORS preflight requests"""
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_GET(self):
        """Handle GET requests for forex data"""
        try:
            parsed_path = urlparse(self.path)
            query_params = parse_qs(parsed_path.query)

            if parsed_path.path == '/forex':
                symbol = query_params.get('symbol', ['EURUSD'])[0]
                data = self.get_forex_data(symbol)

                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()

                self.wfile.write(json.dumps(data).encode())

            elif parsed_path.path == '/health':
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()

                self.wfile.write(json.dumps({'status': 'healthy'}).encode())

            else:
                self.send_response(404)
                self.end_headers()

        except Exception as e:
            logger.error(f"Error handling request: {e}")
            self.send_response(500)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()

            error_data = {
                'success': False,
                'error': str(e),
                'symbol': query_params.get('symbol', ['UNKNOWN'])[0] if 'query_params' in locals() else 'UNKNOWN'
            }
            self.wfile.write(json.dumps(error_data).encode())

    def get_forex_data(self, symbol):
        """Get real-time forex data using yfinance"""
        try:
            # Convert common forex pairs to Yahoo Finance format
            symbol_map = {
                'EURUSD': 'EURUSD=X',
                'GBPUSD': 'GBPUSD=X',
                'USDJPY': 'USDJPY=X',
                'USDCHF': 'USDCHF=X',
                'AUDUSD': 'AUDUSD=X',
                'NZDUSD': 'NZDUSD=X',
                'USDCAD': 'USDCAD=X',
                'EURGBP': 'EURGBP=X',
                'EURJPY': 'EURJPY=X',
                'XAUUSD': 'GC=F',  # Gold
                'BTCUSD': 'BTC-USD',
                'ETHUSD': 'ETH-USD'
            }

            yf_symbol = symbol_map.get(symbol.upper(), f"{symbol.upper()}=X")

            # Get current data
            ticker = yf.Ticker(yf_symbol)

            # Try to get real-time data
            try:
                info = ticker.info
                current_price = info.get('regularMarketPrice') or info.get('ask') or info.get('bid')

                if not current_price:
                    # Fallback to historical data
                    hist = ticker.history(period="1d", interval="1m")
                    if not hist.empty:
                        current_price = float(hist['Close'].iloc[-1])
                    else:
                        # Last resort - get 5-day data
                        hist = ticker.history(period="5d")
                        if not hist.empty:
                            current_price = float(hist['Close'].iloc[-1])
                        else:
                            raise Exception("No data available")

            except Exception as e:
                logger.warning(f"Failed to get real-time data for {symbol}: {e}")
                # Fallback method
                hist = ticker.history(period="1d")
                if not hist.empty:
                    current_price = float(hist['Close'].iloc[-1])
                else:
                    raise Exception(f"Unable to fetch data for {symbol}")

            # Get additional data if available
            try:
                hist_5d = ticker.history(period="5d")
                change_5d = 0
                if len(hist_5d) > 1:
                    change_5d = ((current_price - float(hist_5d['Close'].iloc[0])) / float(hist_5d['Close'].iloc[0])) * 100

                hist_1d = ticker.history(period="1d", interval="1h")
                change_1d = 0
                if len(hist_1d) > 1:
                    change_1d = ((current_price - float(hist_1d['Close'].iloc[0])) / float(hist_1d['Close'].iloc[0])) * 100

            except:
                change_5d = 0
                change_1d = 0

            # Format the response
            response_data = {
                'success': True,
                'symbol': symbol.upper(),
                'price': round(current_price, 5),
                'timestamp': datetime.now().isoformat(),
                'change_1d': round(change_1d, 2),
                'change_5d': round(change_5d, 2),
                'currency_pair': symbol.upper(),
                'source': 'Yahoo Finance'
            }

            logger.info(f"✅ Forex data retrieved for {symbol}: {current_price}")
            return response_data

        except Exception as e:
            logger.error(f"❌ Error getting forex data for {symbol}: {e}")

            # Return mock data as fallback
            mock_price = self.get_mock_price(symbol)
            return {
                'success': True,
                'symbol': symbol.upper(),
                'price': mock_price,
                'timestamp': datetime.now().isoformat(),
                'change_1d': round((hash(symbol) % 200 - 100) / 100, 2),
                'change_5d': round((hash(symbol + 'week') % 500 - 250) / 100, 2),
                'currency_pair': symbol.upper(),
                'source': 'Mock Data (Yahoo Finance unavailable)',
                'error': str(e)
            }

    def get_mock_price(self, symbol):
        """Generate realistic mock prices as fallback"""
        base_prices = {
            'EURUSD': 1.0950,
            'GBPUSD': 1.2650,
            'USDJPY': 149.50,
            'USDCHF': 0.8750,
            'AUDUSD': 0.6550,
            'NZDUSD': 0.6150,
            'USDCAD': 1.3550,
            'EURGBP': 0.8650,
            'EURJPY': 163.50,
            'XAUUSD': 2045.50,
            'BTCUSD': 43500.00,
            'ETHUSD': 2650.00
        }

        base_price = base_prices.get(symbol.upper(), 1.0000)
        # Add some randomness based on current time
        variation = (hash(symbol + str(int(time.time() / 60))) % 200 - 100) / 10000
        return round(base_price + (base_price * variation), 5)

def run_server(port=8001):
    """Run the forex data server"""
    server_address = ('localhost', port)
    httpd = HTTPServer(server_address, ForexDataHandler)

    logger.info(f"🚀 Forex Data Service запущен на порту {port}")
    logger.info(f"📊 API доступен по адресу: http://localhost:{port}/forex?symbol=EURUSD")

    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        logger.info("🛑 Остановка сервера...")
        httpd.server_close()

if __name__ == '__main__':
    # Check if yfinance is available
    try:
        import yfinance as yf
        logger.info("✅ yfinance модуль найден")
    except ImportError:
        logger.error("❌ yfinance не установлен. Установите: pip install yfinance")
        sys.exit(1)

    port = 8001
    if len(sys.argv) > 1:
        try:
            port = int(sys.argv[1])
        except ValueError:
            logger.error("Неверный порт. Используйте: python forex_data_service.py [порт]")
            sys.exit(1)

    run_server(port)