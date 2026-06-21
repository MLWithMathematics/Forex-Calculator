# FX CalcPro - Advanced Lot Size & Profit/Loss Calculator

![FX CalcPro Interface](https://img.shields.io/badge/Status-Completed-success?style=for-the-badge)

A beautifully designed, ultra-fast, standalone Forex Calculator built with pure HTML, CSS, and JavaScript. FX CalcPro helps traders accurately determine their risk exposure (Lot Size) and project their trade outcomes (Profit & Loss) using live or manual exchange rates.

## ✨ Features

- **Premium UI Design**: A stunning dark-mode interface featuring glassmorphism elements, floating ambient background blobs, and smooth micro-animations.
- **Lot Size Calculator**: Instantly calculates the precise Lot Size to use based on your Account Balance, Risk Percentage, and Stop Loss. 
- **Profit/Loss Calculator**: Accurately computes expected Profit or Loss for both Buy (Long) and Sell (Short) trades.
- **Quote Currency Conversion**: Automatically converts your raw Profit & Loss from the traded pair's Quote Currency back into your base Account Currency (USD) using the current exchange rate.
- **Hybrid Exchange Rate Engine**: Integrates with a free public API to fetch **daily baseline exchange rates** (updates once every 24 hours). Because true second-by-second forex data requires paid API keys, this daily fetch acts as a great automatic approximation. However, the tool is specifically designed to allow you to manually override the "Current Price" field with the exact live tick from your broker's terminal (like MetaTrader) to guarantee 100% perfect precision.
- **Standalone & Lightweight**: No heavy frameworks, no build steps. It runs instantly in any modern web browser.

## 🚀 How to Run

Since the application is built using vanilla web technologies, there is no installation or server required. 

1. Simply navigate to the project directory.
2. Double-click the `index.html` file to open it in your default web browser (Chrome, Safari, Firefox, Edge, etc.).
3. Start calculating!

## ⚙️ Usage Details

### Lot Size Tab
1. Enter your **Account Balance** and your **Risk Percentage** (e.g., 1%).
2. Enter your **Stop Loss** in pips.
3. Select your **Currency Pair**. If your pair isn't listed, choose "Custom".
4. The tool automatically fetches the exchange rate, but you can manually tweak the **Current Price / Pip Value Ref**.
5. Your **Recommended Lot Size** is generated instantly.

### Profit & Loss Tab
1. Select your **Currency Pair** (this ensures the P/L is correctly converted to USD).
2. Choose your **Trade Direction** (Buy or Sell).
3. Input the **Lot Size** you plan to trade and your target **Entry/Exit** prices.
4. The **Current Price (For Conversion)** field ensures your final payout is properly valued.
5. Your expected Return and Pip Difference will be shown in a color-coded output (Emerald for Profit, Crimson for Loss).

## 👨‍💻 Developer Information

- **Created by**: Shubhankar Sharma
- **Contact**: [shubhankar.s2000@gmail.com](mailto:shubhankar.s2000@gmail.com)

*Built for [Digital Heroes](https://digitalheroesco.com)*
