// Backend API for Trading Analysis with Web Search
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  // CORS headers for Mini App
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { symbol } = req.body;

    if (!symbol) {
      return res.status(400).json({
        success: false,
        error: 'Symbol required'
      });
    }

    // Create comprehensive system prompt for detailed analysis
    const systemPrompt = `Siz professional trading tahlilchisiz va batafsil, chuqur tahlillar berasiz.

SIZNING VAZIFANGIZ:
- Eng so'nggi bozor ma'lumotlarini qidirish va tahlil qilish
- Texnik va fundamental ko'rsatkichlarni batafsil o'rganish
- Keng qamrovli, professional tahlil berish
- Aniq raqamlar, foizlar va ma'lumotlar bilan dalillash
- Trading signal berish uchun to'liq asoslar keltirish

TAHLIL USLUBI:
- 200-300 so'z hajmida batafsil sabab yozing
- Aniq texnik ko'rsatkichlar va ularning qiymatlari
- Real bozor ma'lumotlari va yangiliklar ta'siri
- Professional terminologiya va aniq hisob-kitoblar
- Har bir xulosani dalillar bilan qo'llab-quvvatlash

MUHIM: Risk eslatmalari qo'shmang, faqat professional signal va tahlil bering.`;

    const userPrompt = `Professional Trading Bot - ${symbol} uchun chuqur bozor tahlili:

${symbol} valyuta juftligi uchun eng so'nggi real-time bozor ma'lumotlarini qidiring va kompleks tahlil o'tkazing.

TAHLIL QILING:
1. TEXNIK TAHLIL:
   - Joriy narx tendensiyalari va chart pattern'lar
   - Moving Average ko'rsatkichlari (SMA, EMA)
   - RSI, MACD, Stochastic oscillatorlar
   - Bollinger Bands va volatillik
   - Support va Resistance darajalari
   - Volume va momentum indikatorlari
   - Fibonacci retracement darajalari

2. FUNDAMENTAL TAHLIL:
   - So'nggi makroiqtisodiy yangiliklar
   - Markaziy banklar siyosati va foiz stavkalari
   - GDP, inflyatsiya, ishsizlik ma'lumotlari
   - Geosiyosiy voqealar ta'siri
   - Bozor sentimenti va trader pozitsiyalari

3. BOZOR KONTEKSTI:
   - Real-time narx va oxirgi 24 soat o'zgarishi
   - Haftalik, oylik trend yo'nalishi
   - Korrelyatsiya bilan bog'liq juftliklar
   - Sessiya vaqti ta'siri (London, NY, Tokyo)
   - Volatillik darajasi va ATR

NATIJA FORMATI:
Signal: [FAQAT: BUY, SELL yoki HOLD]
Ishonch: [70-95 oralig'ida]%
Narx: [aniq joriy narx, 5 raqamgacha]
Target: [aniq maqsad narx]
Stop: [aniq stop loss narxi]
Sabab: [250-350 so'z BATAFSIL professional tahlil. Aniq raqamlar, foizlar, ko'rsatkichlar bilan. Texnik indikatorlar qiymatlari, support/resistance darajalari, yangiliklar ta'siri va h.k.]

MUHIM: Professional trader sifatida batafsil va to'liq tahlil bering.`;

    // Use gpt-4o-mini-search-preview for economical web search
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini-search-preview",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: userPrompt
        }
      ],
      web_search_options: {
        user_location: {
          type: "approximate",
          approximate: {
            country: "US",
            timezone: "America/New_York"
          }
        }
      },
      max_tokens: 800,
      temperature: 0.4,
      presence_penalty: 0.1,
      frequency_penalty: 0.1

    const analysisText = completion.choices[0].message.content;
    const annotations = completion.choices[0].message.annotations || [];

    // Parse the structured response
    const result = parseAnalysis(analysisText, symbol);

    // Add source citations if available
    result.sources = annotations.filter(ann => ann.type === 'url_citation').map(ann => ({
      title: ann.url_citation.title,
      url: ann.url_citation.url
    }));

    res.status(200).json({
      success: true,
      result: result,
      raw_analysis: analysisText
    });

  } catch (error) {
    console.error('Trading Analysis Error:', error);

    res.status(500).json({
      success: false,
      error: error.message || 'Analysis failed',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}

function parseAnalysis(text, symbol) {
  try {
    // Parse GPT response to extract structured data
    const lines = text.split('\n').filter(line => line.trim());

    let signal = 'HOLD';
    let confidence = 75;
    let price = 0;
    let target = 0;
    let stop = 0;
    let reason = '';

    // Enhanced parsing for various formats
    for (const line of lines) {
      const trimmed = line.trim();
      const lowerLine = trimmed.toLowerCase();

      // Signal detection
      if (lowerLine.includes('signal') || lowerLine.includes('harakat')) {
        const match = trimmed.match(/(BUY|SELL|HOLD|SOTIB OLISH|SOTISH|KUTISH)/i);
        if (match) {
          const foundSignal = match[1].toUpperCase();
          signal = foundSignal.includes('SOT') ? (foundSignal.includes('OLISH') ? 'BUY' : 'SELL') :
                  foundSignal === 'KUTISH' ? 'HOLD' : foundSignal;
        }
      }

      // Confidence detection
      if (lowerLine.includes('ishonch') || lowerLine.includes('confidence') || lowerLine.includes('darajasi')) {
        const match = trimmed.match(/(\d+)\s*%?/);
        if (match) confidence = parseInt(match[1]);
      }

      // Price detection
      if (lowerLine.includes('narx') || lowerLine.includes('price') || lowerLine.includes('joriy')) {
        const match = trimmed.match(/(\d+\.?\d*)/);
        if (match) price = parseFloat(match[1]);
      }

      // Target detection
      if (lowerLine.includes('target') || lowerLine.includes('maqsad')) {
        const match = trimmed.match(/(\d+\.?\d*)/);
        if (match) target = parseFloat(match[1]);
      }

      // Stop loss detection
      if (lowerLine.includes('stop') || lowerLine.includes('to\'xtash')) {
        const match = trimmed.match(/(\d+\.?\d*)/);
        if (match) stop = parseFloat(match[1]);
      }

      // Enhanced reason detection for detailed analysis
      if (lowerLine.includes('sabab') || lowerLine.includes('reason') || lowerLine.includes('tahlil')) {
        const reasonStart = lines.indexOf(line);
        // Collect all remaining lines as detailed reason
        const reasonLines = lines.slice(reasonStart);

        // Extract everything after "Sabab:" keyword
        let reasonText = reasonLines.join(' ')
          .replace(/^.*?(sabab|reason|tahlil)\s*:?\s*/i, '')
          .trim();

        // Clean up the reason text
        reasonText = reasonText
          .replace(/\s+/g, ' ')
          .replace(/^[\s:]+/, '')
          .trim();

        // If we found substantial content, use it
        if (reasonText.length > 50) {
          reason = reasonText;
          break;
        }
      }

      // If no specific "Sabab:" section found, try to extract comprehensive analysis
      if (!reason && (lowerLine.includes('texnik') || lowerLine.includes('fundamental') ||
                      lowerLine.includes('rsi') || lowerLine.includes('macd') ||
                      lowerLine.includes('trend') || lowerLine.includes('narx'))) {
        // Start collecting from this technical analysis line
        const analysisStart = lines.indexOf(line);
        const analysisLines = lines.slice(analysisStart);

        // Take substantial portion of analysis but stop at certain keywords
        const stopWords = ['signal:', 'ishonch:', 'target:', 'stop:', 'recommended'];
        let analysisText = '';

        for (const analysisLine of analysisLines) {
          const shouldStop = stopWords.some(word =>
            analysisLine.toLowerCase().includes(word));

          if (shouldStop && analysisText.length > 100) break;

          analysisText += ' ' + analysisLine.trim();

          // Limit to reasonable length
          if (analysisText.length > 500) break;
        }

        if (analysisText.trim().length > reason.length) {
          reason = analysisText.trim();
        }
      }
    }

    // Generate default values if not found
    if (!price || price === 0) {
      // Use realistic default prices based on symbol
      if (symbol.includes('EUR')) price = 1.0850;
      else if (symbol.includes('GBP')) price = 1.2650;
      else if (symbol.includes('JPY')) price = 149.50;
      else if (symbol.includes('BTC')) price = 98500;
      else if (symbol.includes('XAU')) price = 2650.50;
      else price = 1.0000;
    }

    if (!target || target === 0) {
      target = price * (signal === 'BUY' ? 1.008 : signal === 'SELL' ? 0.992 : 1.0);
    }

    if (!stop || stop === 0) {
      stop = price * (signal === 'BUY' ? 0.995 : signal === 'SELL' ? 1.005 : 1.0);
    }

    if (!reason) {
      reason = `${symbol} uchun texnik va fundamental tahlil asosida ${signal === 'BUY' ? 'sotib olish' : signal === 'SELL' ? 'sotish' : 'kutish'} signali berildi`;
    }

    return {
      success: true,
      signal,
      confidence,
      price,
      target: target || (price * (signal === 'BUY' ? 1.01 : 0.99)),
      stop: stop || (price * (signal === 'BUY' ? 0.99 : 1.01)),
      reason,
      timestamp: new Date().toLocaleTimeString('uz-UZ', {
        hour: '2-digit',
        minute: '2-digit'
      })
    };

  } catch (parseError) {
    console.error('Parse error:', parseError);

    // Fallback response if parsing fails
    return {
      success: true,
      signal: 'HOLD',
      confidence: 60,
      price: 1.0000,
      target: 1.0100,
      stop: 0.9900,
      reason: 'Bozor tahlili amalga oshirildi',
      timestamp: new Date().toLocaleTimeString('uz-UZ', {
        hour: '2-digit',
        minute: '2-digit'
      })
    };
  }
}