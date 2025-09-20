import React, { useState, useEffect } from 'react';
import './FullscreenAnalysis.css';

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

interface FullscreenAnalysisProps {
  isOpen: boolean;
  onClose: () => void;
  result: AnalysisResult | null;
  symbol: string;
}

const FullscreenAnalysis: React.FC<FullscreenAnalysisProps> = ({
  isOpen,
  onClose,
  result,
  symbol
}) => {
  const [displayedText, setDisplayedText] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [typingStep, setTypingStep] = useState<number>(0);

  // Clean GPT response from unwanted symbols and links
  const cleanGPTText = (text: string): string => {
    let cleaned = text;

    // Remove URLs (http, https, www)
    cleaned = cleaned.replace(/https?:\/\/[^\s\])\}]+/g, '');
    cleaned = cleaned.replace(/www\.[^\s\])\}]+/g, '');

    // Remove #* symbols and markdown
    cleaned = cleaned.replace(/[#*]+/g, '');
    cleaned = cleaned.replace(/\*\*/g, '');
    cleaned = cleaned.replace(/\*/g, '');
    cleaned = cleaned.replace(/#{1,6}\s*/g, '');

    // Remove brackets with links
    cleaned = cleaned.replace(/\[.*?\]/g, '');
    cleaned = cleaned.replace(/\(.*?\.com.*?\)/g, '');
    cleaned = cleaned.replace(/\(.*?\.net.*?\)/g, '');
    cleaned = cleaned.replace(/\(.*?\.org.*?\)/g, '');

    // Remove source references
    cleaned = cleaned.replace(/source:\s*[^\n]+/gi, '');
    cleaned = cleaned.replace(/manbaa?:\s*[^\n]+/gi, '');
    cleaned = cleaned.replace(/according to\s+[^\n]+/gi, '');

    // Clean extra whitespace
    cleaned = cleaned.replace(/\s+/g, ' ');
    cleaned = cleaned.replace(/\n\s*\n/g, '\n\n');
    cleaned = cleaned.trim();

    return cleaned;
  };

  const sections = [
    {
      title: 'BATAFSIL TAHLIL',
      content: cleanGPTText(result?.reason || '')
    }
  ];

  useEffect(() => {
    if (isOpen && result) {
      setDisplayedText('');
      setIsTyping(true);
      setTypingStep(0);
      startTypingAnimation();
    }
  }, [isOpen, result]);

  const startTypingAnimation = () => {
    let currentStep = 0;
    let allText = '';

    // Prepare all text at once
    sections.forEach((section, index) => {
      if (index === 0) {
        allText += `${section.title}\n${section.content}`;
      } else {
        allText += `\n\n${section.title}\n${section.content}`;
      }
    });

    let charIndex = 0;
    const typeChar = () => {
      if (charIndex < allText.length) {
        setDisplayedText(allText.substring(0, charIndex + 1));
        charIndex++;

        // Update step indicator based on progress
        const progress = charIndex / allText.length;
        const newStep = Math.min(Math.floor(progress * sections.length), sections.length - 1);
        if (newStep !== typingStep) {
          setTypingStep(newStep + 1);
        }

        setTimeout(typeChar, 12); // Even faster typing
      } else {
        setIsTyping(false);
        setTypingStep(sections.length);
      }
    };

    setTimeout(typeChar, 500); // Initial delay
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fullscreen-analysis-overlay"
      onClick={handleBackdropClick}
    >
      <div className={`fullscreen-analysis-container ${result?.signal ? `signal-${result.signal.toLowerCase()}` : ''}`}>
        {/* Header */}
        <div className="analysis-header">
          <div className="header-content">
            <div className="title-section">
              <div className="title-with-logo">
                <svg width="32" height="32" viewBox="0 0 32 32" className="chart-logo-svg">
                  <path d="M4 22L12 14L16 18L28 6" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="28" cy="6" r="2.5" fill="currentColor"/>
                  <circle cx="16" cy="18" r="2.5" fill="currentColor"/>
                  <circle cx="12" cy="14" r="2.5" fill="currentColor"/>
                  <circle cx="4" cy="22" r="2.5" fill="currentColor"/>
                </svg>
                <h1 className="analysis-title">
                  {symbol} Tahlili
                </h1>
              </div>
            </div>
            <button
              className="close-button"
              onClick={onClose}
              aria-label="Yopish"
            >
              ✕
            </button>
          </div>

          {result && (
            <div className="signal-summary">
              <div className={`signal-badge ${result.signal.toLowerCase()}`}>
                <span className="signal-text">{result.signal}</span>
                <span className="confidence-text">{result.confidence}</span>
              </div>
              <div className="timestamp">{result.timestamp}</div>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="analysis-content">
          <div className="typing-container">
            <pre className="analysis-text">
              {displayedText}
            </pre>

            {isTyping && (
              <span className="typing-cursor">|</span>
            )}
          </div>

          {/* Progress Indicator */}
          {isTyping && (
            <div className="typing-progress">
              <div className="progress-steps">
                {sections.map((section, index) => (
                  <div
                    key={index}
                    className={`progress-step ${index <= typingStep ? 'completed' : ''}`}
                  >
                    <div className="step-number">{index + 1}</div>
                    <span className="step-title">{section.title}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        {!isTyping && result && (
          <div className="analysis-actions">
            <button
              className="action-btn copy-btn"
              onClick={() => {
                const textToCopy = sections.map(s => `${s.title}\n${s.content}`).join('\n\n');
                navigator.clipboard.writeText(textToCopy);
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" fill="currentColor"/>
              </svg>
              Nusxa olish
            </button>

            <button
              className="action-btn share-btn"
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: `${symbol} Trading Tahlili`,
                    text: sections.map(s => `${s.title}\n${s.content}`).join('\n\n')
                  });
                }
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z" fill="currentColor"/>
              </svg>
              Ulashish
            </button>

            <button
              className="action-btn new-analysis-btn"
              onClick={onClose}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" fill="currentColor"/>
              </svg>
              Yangi tahlil
            </button>
          </div>
        )}

        {/* Decorative Elements */}
        <div className="floating-particles">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="particle"
              style={{
                '--delay': `${i * 0.5}s`,
                '--duration': `${3 + i * 0.2}s`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`
              } as React.CSSProperties}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FullscreenAnalysis;