'use client';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { HelpCircle } from 'lucide-react';

export const DEFINITIONS: Record<string, { short: string; detail: string; example?: string }> = {
  // Price & OHLCV
  'Price': {
    short: 'Most recent closing price of the stock.',
    detail: 'The last price at which a stock was traded during the previous trading session. This is the "official" price used for most calculations and reporting.',
    example: 'If AAPL closed at $260.81, that is its price until the next trading day.',
  },
  'Change': {
    short: 'Percentage move from open to close.',
    detail: 'Shows how much the stock moved during the trading day, expressed as a percentage. Calculated as: ((Close - Open) / Open) × 100. Green means it went up, red means it went down.',
    example: '-0.11% means the stock dropped slightly from its opening price.',
  },
  'Open': {
    short: 'First trade price when market opened.',
    detail: 'The price at which a stock first traded when the market opened at 9:30 AM Eastern. The open price can differ significantly from the previous day\'s close due to after-hours news or earnings.',
    example: 'If AAPL opened at $261.09, buyers and sellers agreed on that price at market open.',
  },
  'High': {
    short: 'Highest price reached during the day.',
    detail: 'The maximum price a stock reached at any point during the trading session. A stock trading near its daily high shows strong buying interest. Comparing today\'s high to past highs reveals resistance levels.',
    example: 'A high of $262.13 means at some point buyers were willing to pay that much.',
  },
  'Low': {
    short: 'Lowest price reached during the day.',
    detail: 'The minimum price a stock fell to during the trading session. A stock trading near its daily low may indicate selling pressure. Traders watch lows to identify support levels where buying tends to emerge.',
    example: 'A low of $259.55 means sellers pushed the price down to that point during the day.',
  },
  'Volume': {
    short: 'Total shares traded during the day.',
    detail: 'The number of shares that changed hands during the trading session. Volume confirms price moves — a big price move on high volume is more significant than the same move on low volume. Average daily volume for major stocks is millions of shares.',
    example: '26.2M means 26.2 million shares of AAPL were traded that day.',
  },
  'VWAP': {
    short: 'Volume Weighted Average Price.',
    detail: 'The average price a stock traded at throughout the day, weighted by volume. Institutional traders use VWAP as a benchmark — buying below VWAP is considered a good deal, selling above it is favorable.',
    example: 'If VWAP is $260.50 and the stock is at $259.00, it is trading below its average price.',
  },

  // Market Structure
  'Market Cap': {
    short: 'Total dollar value of all shares.',
    detail: 'Calculated by multiplying the stock price by the total number of shares outstanding. Market cap determines a company\'s size classification. Mega Cap = $200B+, Large Cap = $10–200B, Mid Cap = $2–10B, Small Cap = $300M–2B.',
    example: 'Apple at $260 per share × 15.3 billion shares = ~$3.9 trillion market cap.',
  },
  'Mega Cap': {
    short: 'Companies worth $200 billion or more.',
    detail: 'The largest publicly traded companies in the world. Mega cap stocks are generally the most liquid, most stable, and most widely held by institutional investors. They often have global operations and dominant market positions.',
    example: 'Apple, Microsoft, NVIDIA, Amazon, and Alphabet are all mega cap companies.',
  },
  'Large Cap': {
    short: 'Companies worth $10–200 billion.',
    detail: 'Well-established companies with proven business models. Large caps are typically less volatile than smaller companies and often pay dividends. They make up the majority of most index funds and retirement portfolios.',
    example: 'Netflix, Nike, and Disney are large cap companies.',
  },
  'Mid Cap': {
    short: 'Companies worth $2–10 billion.',
    detail: 'Mid cap companies offer a balance between growth potential and stability. They are often growing faster than large caps but have more established business models than small caps. They can be more volatile but offer higher growth potential.',
    example: 'Snap, Spotify, and Roblox are mid cap companies.',
  },
  'Sector': {
    short: 'Industry category the company belongs to.',
    detail: 'Stocks are grouped by the type of business they operate. Sectors help investors diversify across different parts of the economy. Different sectors perform differently depending on economic conditions — technology often leads bull markets while utilities are defensive in downturns.',
    example: 'Apple is in Technology, JPMorgan is in Finance, Pfizer is in Healthcare.',
  },
  'Symbol': {
    short: 'Unique ticker code for a stock.',
    detail: 'A short abbreviation assigned to a publicly traded company for use on stock exchanges. NYSE symbols are typically 1–3 letters, NASDAQ symbols are usually 4 letters. The symbol is used when placing trades and looking up data.',
    example: 'AAPL = Apple, MSFT = Microsoft, GOOGL = Alphabet (Google).',
  },

  // Technical Indicators
  'MA20': {
    short: '20-day Moving Average — short-term trend.',
    detail: 'The average closing price over the past 20 trading days (about 1 month). When price is above MA20, the short-term trend is up. When price crosses below MA20, it can signal a trend reversal. Traders use it to time entries and exits.',
    example: 'If AAPL is at $260 and MA20 is at $255, the stock is trending above its short-term average — bullish.',
  },
  'MA50': {
    short: '50-day Moving Average — medium-term trend.',
    detail: 'The average closing price over the past 50 trading days (about 2.5 months). The MA50 is one of the most watched technical levels by traders. A "golden cross" occurs when MA50 crosses above MA200, signaling a major uptrend.',
    example: 'Stocks often bounce off their MA50 during healthy bull markets.',
  },
  'MA200': {
    short: '200-day Moving Average — long-term trend.',
    detail: 'The average closing price over the past 200 trading days (about 10 months). The MA200 is the most important moving average for long-term investors. Price above MA200 = long-term uptrend. Price below = long-term downtrend.',
    example: 'Warren Buffett-style investors look for stocks trading well above their MA200.',
  },
  'Candlestick': {
    short: 'Chart showing open, high, low, close per period.',
    detail: 'Each candle shows four data points: the open, high, low, and close for that time period. The body of the candle spans from open to close. The wicks (thin lines) show the high and low. Green candles mean price rose, red means price fell.',
    example: 'A long green candle with small wicks shows strong buying throughout the period.',
  },
  'Line Chart': {
    short: 'Connects closing prices with a line.',
    detail: 'The simplest chart type — plots only the closing price for each period and connects the dots. Good for seeing the overall trend without the noise of intraday price swings. Used by long-term investors who care less about entry/exit precision.',
    example: 'Looking at a 1-year line chart quickly shows whether a stock has trended up or down.',
  },
  'Area Chart': {
    short: 'Line chart with shaded area beneath.',
    detail: 'Same as a line chart but with the area below the line filled in with color. The shading makes it easier to visualize the magnitude of price changes over time. Commonly used in financial dashboards for a clean, modern look.',
    example: 'Area charts make it easy to see how far a stock has moved from its starting price.',
  },
  'Volume Bars': {
    short: 'Bar chart of shares traded each period.',
    detail: 'Displayed below the price chart, volume bars show how many shares were traded in each period. Green bars = price went up that period, red bars = price went down. Spikes in volume often signal major news events or institutional buying/selling.',
    example: 'A huge volume spike on earnings day shows heavy institutional participation.',
  },

  // Forex
  'Pair': {
    short: 'Two currencies compared against each other.',
    detail: 'In forex trading, currencies are always traded in pairs. The first currency (base) is being bought or sold, and the second (quote) is used to price it. Exchange rates fluctuate based on economic data, interest rates, geopolitics, and market sentiment.',
    example: 'EUR/USD = 1.0850 means 1 Euro buys 1.0850 US Dollars.',
  },
  'Base': {
    short: 'First currency in a forex pair.',
    detail: 'The base currency is the one you are buying or selling. When you buy EUR/USD, you are buying Euros and selling Dollars. The exchange rate tells you how much of the quote currency you need to buy one unit of the base.',
    example: 'In EUR/USD, the Euro is the base currency.',
  },
  'Quote': {
    short: 'Second currency used to price the base.',
    detail: 'The quote currency (also called counter currency) is the one used to express the value of the base currency. The exchange rate is always expressed in terms of the quote currency per one unit of base currency.',
    example: 'In EUR/USD, the US Dollar is the quote currency.',
  },
  'Rate': {
    short: 'How much quote currency buys one unit of base.',
    detail: 'The exchange rate tells you exactly how much of the quote currency is needed to purchase one unit of the base currency. Rates change constantly during market hours based on supply and demand between buyers and sellers worldwide.',
    example: 'EUR/USD rate of 1.0850 means 1 Euro costs 1.085 US Dollars.',
  },
  'Bid': {
    short: 'Price dealers will buy the base currency.',
    detail: 'The bid price is what market makers will pay to buy the base currency from you. It is always slightly lower than the ask price. The difference between bid and ask is the "spread" — the transaction cost in forex trading.',
    example: 'EUR/USD bid of 1.0848 means dealers buy Euros at that rate.',
  },
  'Ask': {
    short: 'Price dealers will sell the base currency.',
    detail: 'The ask price is what market makers will charge you to buy the base currency. It is always slightly higher than the bid price. Major pairs like EUR/USD have very tight spreads (small differences), while exotic pairs have wider spreads.',
    example: 'EUR/USD ask of 1.0852 means you can buy Euros at that rate.',
  },
  'Major Pairs': {
    short: 'Most traded pairs — all include USD.',
    detail: 'The major forex pairs are the seven most traded currency pairs in the world, all involving the US Dollar. They have the highest liquidity, tightest spreads, and most predictable behavior. They account for about 80% of all forex trading volume globally.',
    example: 'EUR/USD, GBP/USD, USD/JPY, USD/CHF, AUD/USD, USD/CAD, NZD/USD.',
  },
  'Cross Pairs': {
    short: 'Pairs without USD — like EUR/GBP.',
    detail: 'Cross currency pairs (or crosses) do not include the US Dollar. They are formed by combining two major currencies. Crosses can be more volatile than majors and have slightly wider spreads. Popular for traders who have a view on two non-USD economies.',
    example: 'EUR/GBP, EUR/JPY, GBP/JPY, EUR/CHF.',
  },
  'Exotic Pairs': {
    short: 'One major + one emerging market currency.',
    detail: 'Exotic pairs combine a major currency (like USD) with the currency of an emerging or smaller economy. They have much wider spreads, lower liquidity, and higher volatility than majors or crosses. Suitable for experienced traders only.',
    example: 'USD/MXN (Mexican Peso), USD/SGD (Singapore Dollar).',
  },

  // Futures
  'Contract': {
    short: 'Agreement to buy/sell an asset at a future date.',
    detail: 'A futures contract is a legally binding agreement to buy or sell a specific asset at a predetermined price on a specified future date. Used by institutions to hedge risk and by traders to speculate on price movements. SIFT uses ETF proxies since actual futures require margin accounts.',
    example: 'An oil futures contract might specify buying 1,000 barrels at $75 at a future date.',
  },
  'Equity Futures': {
    short: 'Futures contracts based on stock indices.',
    detail: 'Equity futures are contracts based on stock market indices like the S&P 500. They are traded nearly 24 hours a day and are watched closely before market open to gauge investor sentiment. "Futures are up" typically means the market will open higher.',
    example: 'S&P 500 futures rising 0.5% overnight suggests a positive market open.',
  },
  'Commodities': {
    short: 'Raw materials traded on futures markets.',
    detail: 'Commodity futures cover physical goods like precious metals (gold, silver), energy (oil, gas), and agriculture (wheat, corn). Commodity prices are driven by supply/demand, geopolitics, and weather. Gold is traditionally a safe haven during market turmoil.',
    example: 'Gold futures rise during economic uncertainty as investors seek safe assets.',
  },
  'Bonds': {
    short: 'Debt instruments — prices move inverse to rates.',
    detail: 'Bond futures are based on government debt securities. Bond prices move inversely to interest rates — when rates rise, bond prices fall, and vice versa. The 10-year Treasury yield is one of the most important indicators in all of finance.',
    example: 'TLT (20-year Treasury ETF) falls when the Fed raises interest rates.',
  },

  // Dashboard & Indices
  'S&P 500': {
    short: 'Tracks 500 largest US companies.',
    detail: 'The Standard & Poor\'s 500 is the most widely followed stock market index in the world. It tracks 500 of the largest US publicly traded companies, representing about 80% of total US market capitalization. Most index funds and 401(k)s aim to match S&P 500 returns.',
    example: 'A 10% annual S&P 500 return is considered the historical average over the long term.',
  },
  'NASDAQ': {
    short: 'Tech-heavy index of 3,000+ companies.',
    detail: 'The NASDAQ Composite tracks all stocks listed on the NASDAQ exchange, which is home to most major technology companies. The NASDAQ 100 (tracked by QQQ) focuses on the 100 largest non-financial NASDAQ companies. More volatile than the S&P 500.',
    example: 'NVIDIA, Apple, Microsoft, and Tesla are all NASDAQ-listed companies.',
  },
  'Dow Jones': {
    short: 'Tracks 30 blue-chip US companies.',
    detail: 'The Dow Jones Industrial Average (DJIA) is one of the oldest and most recognized stock indices, tracking 30 large blue-chip American companies. Unlike the S&P 500 (market-cap weighted), the Dow is price-weighted, meaning higher-priced stocks have more influence.',
    example: 'Companies like Boeing, Goldman Sachs, and Apple are Dow components.',
  },
  'Russell 2000': {
    short: 'Tracks 2,000 small-cap US companies.',
    detail: 'The Russell 2000 index tracks 2,000 smaller US public companies and is the most widely used benchmark for small-cap stocks. It is considered a leading indicator for the broader economy since small companies are more sensitive to domestic economic conditions.',
    example: 'When the Russell 2000 outperforms the S&P 500, small-cap stocks are leading the market.',
  },
  'Top Gainers': {
    short: 'Stocks with the biggest % gains today.',
    detail: 'Shows which stocks have increased the most in percentage terms during the current or most recent trading session. Stocks appear here due to positive earnings, analyst upgrades, product launches, or overall market momentum.',
    example: 'A stock up 5% in one day is significantly outperforming the market.',
  },
  'Top Losers': {
    short: 'Stocks with the biggest % losses today.',
    detail: 'Shows which stocks have dropped the most in percentage terms during the current or most recent trading session. Stocks appear here due to disappointing earnings, analyst downgrades, bad news, or broad market selling pressure.',
    example: 'A stock down 5% in one day is significantly underperforming the market.',
  },

  // Screener filters
  'Min Change': {
    short: 'Minimum % change filter.',
    detail: 'Filters to show only stocks that have moved up by at least this percentage today. Use a positive number to find gainers, or a negative number to find stocks that haven\'t fallen too much. Combine with Max Change for a specific range.',
    example: 'Setting Min Change to 0.5 shows only stocks up more than 0.5% today.',
  },
  'Max Change': {
    short: 'Maximum % change filter.',
    detail: 'Filters to show only stocks that have not moved more than this percentage today. Use to cap your results and find stocks within a specific performance range. Negative values filter for stocks that have fallen less than a certain amount.',
    example: 'Setting Max Change to 2 shows only stocks up less than 2% today.',
  },

  // Heat Map
  'Heat Map': {
    short: 'Color grid showing market performance.',
    detail: 'A heat map visualizes the performance of many stocks simultaneously using color. Dark green = strong gains (3%+), light green = small gains, light red = small losses, dark red = significant losses (3%+). Larger tiles can represent larger market cap companies.',
    example: 'A mostly green heat map means the broad market is having a good day.',
  },
};

interface EduTooltipProps {
  term: string;
  children?: React.ReactNode;
  showIcon?: boolean;
  side?: 'top' | 'bottom' | 'left' | 'right';
}

export default function EduTooltip({ term, children, showIcon = true, side = 'top' }: EduTooltipProps) {
  const definition = DEFINITIONS[term];
  if (!definition) return <>{children ?? term}</>;

  return (
    <TooltipProvider delayDuration={400}>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="inline-flex items-center gap-1 cursor-help group">
            {children ?? term}
            {showIcon && (
              <HelpCircle
                size={11}
                className="text-foreground/20 group-hover:text-emerald-500/70 transition-colors flex-shrink-0"
              />
            )}
          </span>
        </TooltipTrigger>
        <TooltipContent
          side={side}
          className="max-w-sm bg-zinc-900 border border-white/10 text-foreground/90 text-xs px-4 py-3 rounded-xl shadow-2xl z-50"
        >
          <div className="font-semibold text-emerald-400 mb-1 text-sm">{term}</div>
          <div className="text-foreground/60 text-xs mb-1">{definition.short}</div>
          <div className="text-foreground/80 leading-relaxed">{definition.detail}</div>
          {definition.example && (
            <div className="mt-2 pt-2 border-t border-white/10 text-foreground/50 italic">
              💡 {definition.example}
            </div>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
