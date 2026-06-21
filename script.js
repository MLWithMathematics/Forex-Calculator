document.addEventListener('DOMContentLoaded', () => {
    // Tab Switching Logic
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active classes
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            // Add active to clicked tab
            btn.classList.add('active');
            const targetId = btn.getAttribute('data-tab');
            document.getElementById(targetId).classList.add('active');
        });
    });

    // --- DOM Elements for Lot Size ---
    const accBalanceEl = document.getElementById('account-balance');
    const riskPercentageEl = document.getElementById('risk-percentage');
    const stopLossEl = document.getElementById('stop-loss');
    const pairLotSelect = document.getElementById('currency-pair-lot');
    const currentPriceLotEl = document.getElementById('current-price-lot');
    
    const resultLotSizeEl = document.getElementById('result-lot-size');
    const resultRiskAmountEl = document.getElementById('result-risk-amount');

    // --- DOM Elements for PnL ---
    const pairPnlSelect = document.getElementById('currency-pair-pnl');
    const currentPricePnlEl = document.getElementById('current-price-pnl');
    const pnlDirectionRadios = document.getElementsByName('direction');
    const lotSizePnlEl = document.getElementById('lot-size-pnl');
    const entryPriceEl = document.getElementById('entry-price');
    const exitPriceEl = document.getElementById('exit-price');
    const contractSizeEl = document.getElementById('contract-size');
    
    const pnlResultBox = document.getElementById('pnl-result-box');
    const resultPnlEl = document.getElementById('result-pnl');
    const pnlPipsDiffEl = document.getElementById('pnl-pips-diff');

    // --- State ---
    let exchangeRates = {};

    // Fetch Rates from Free API
    async function fetchExchangeRates() {
        try {
            const response = await fetch('https://open.er-api.com/v6/latest/USD');
            const data = await response.json();
            if (data && data.rates) {
                exchangeRates = data.rates;
                updateCurrentPriceForPair();
            }
        } catch (error) {
            console.error("Could not fetch exchange rates:", error);
        }
    }

    // Determine current price based on pair
    function updateCurrentPriceForPair() {
        const pairLot = pairLotSelect.value;
        const pairPnl = pairPnlSelect.value;
        
        if (Object.keys(exchangeRates).length > 0) {
            // Update Lot Size Input
            if (pairLot !== 'CUSTOM') {
                let rateLot = getRateForPair(pairLot);
                if (rateLot) {
                    const decimals = pairLot.includes('JPY') ? 3 : 5;
                    currentPriceLotEl.value = rateLot.toFixed(decimals);
                }
            }
            
            // Update PnL Input
            if (pairPnl !== 'CUSTOM') {
                let ratePnl = getRateForPair(pairPnl);
                if (ratePnl) {
                    const decimals = pairPnl.includes('JPY') ? 3 : 5;
                    currentPricePnlEl.value = ratePnl.toFixed(decimals);
                }
            }
        }
        
        calculateLotSize();
        calculatePnL();
    }

    function getRateForPair(pair) {
        if (pair === 'EURUSD') return 1 / exchangeRates['EUR'];
        if (pair === 'GBPUSD') return 1 / exchangeRates['GBP'];
        if (pair === 'AUDUSD') return 1 / exchangeRates['AUD'];
        if (pair === 'NZDUSD') return 1 / exchangeRates['NZD'];
        if (pair === 'USDJPY') return exchangeRates['JPY'];
        if (pair === 'USDCAD') return exchangeRates['CAD'];
        if (pair === 'USDCHF') return exchangeRates['CHF'];
        return 1;
    }

    // Calculate Lot Size Logic
    function calculateLotSize() {
        const balance = parseFloat(accBalanceEl.value);
        const riskPct = parseFloat(riskPercentageEl.value);
        const stopLoss = parseFloat(stopLossEl.value);
        const pair = pairLotSelect.value;
        const currentPrice = parseFloat(currentPriceLotEl.value);

        if (isNaN(balance) || isNaN(riskPct) || isNaN(stopLoss) || stopLoss <= 0) {
            resultLotSizeEl.innerText = "0.00";
            resultRiskAmountEl.innerText = "$0.00";
            return;
        }

        const riskAmount = balance * (riskPct / 100);
        resultRiskAmountEl.innerText = '$' + riskAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

        let pipValuePerStandardLot = 10; 
        
        if (pair === 'USDJPY' || pair === 'USDCAD' || pair === 'USDCHF') {
            const pipSize = pair.includes('JPY') ? 0.01 : 0.0001;
            if (currentPrice > 0) {
                pipValuePerStandardLot = (pipSize / currentPrice) * 100000;
            }
        } else if (pair === 'CUSTOM') {
            pipValuePerStandardLot = 10;
        }

        const riskPerPip = riskAmount / stopLoss;
        const lotSize = riskPerPip / pipValuePerStandardLot;

        if (isFinite(lotSize)) {
            resultLotSizeEl.innerText = lotSize.toFixed(2);
        } else {
            resultLotSizeEl.innerText = "0.00";
        }
    }

    // Calculate PnL Logic
    function calculatePnL() {
        let direction = 'buy';
        pnlDirectionRadios.forEach(radio => {
            if (radio.checked) direction = radio.value;
        });

        const lotSize = parseFloat(lotSizePnlEl.value);
        const entry = parseFloat(entryPriceEl.value);
        const exit = parseFloat(exitPriceEl.value);
        const contractSize = parseFloat(contractSizeEl.value);
        const currentPricePnl = parseFloat(currentPricePnlEl.value);
        const pair = pairPnlSelect.value;

        if (isNaN(lotSize) || isNaN(entry) || isNaN(exit) || isNaN(contractSize) || isNaN(currentPricePnl)) {
            resultPnlEl.innerText = "$0.00";
            return;
        }

        const totalUnits = lotSize * contractSize;
        
        // PnL in Quote Currency = (Exit - Entry) * Units
        let pnlQuote = (exit - entry) * totalUnits;
        if (direction === 'sell') {
            pnlQuote = -pnlQuote;
        }

        // Convert PnL to Account Base Currency (USD)
        let pnlAccount = pnlQuote;
        if (pair === 'USDJPY' || pair === 'USDCAD' || pair === 'USDCHF') {
            // Quote is not USD, divide by current exchange rate
            if (currentPricePnl > 0) {
                pnlAccount = pnlQuote / currentPricePnl;
            }
        } else if (pair === 'CUSTOM') {
            // Assume we need conversion if user types custom rate, or leave as is. 
            // We can just leave it as pnlAccount for standard pairs (EURUSD etc)
            // since quote is USD.
        }

        const isJpyLike = entry > 50 && entry < 500; 
        const pipMultiplier = isJpyLike ? 100 : 10000;
        
        let pipsDiff = (exit - entry) * pipMultiplier;
        if (direction === 'sell') {
            pipsDiff = -pipsDiff;
        }

        resultPnlEl.innerText = (pnlAccount >= 0 ? '+$' : '-$') + Math.abs(pnlAccount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        pnlPipsDiffEl.innerText = `${pipsDiff >= 0 ? '+' : ''}${pipsDiff.toFixed(1)} Pips`;

        pnlResultBox.classList.remove('profit', 'loss');
        if (pnlAccount > 0) {
            pnlResultBox.classList.add('profit');
        } else if (pnlAccount < 0) {
            pnlResultBox.classList.add('loss');
        }
    }

    // --- Event Listeners ---
    [accBalanceEl, riskPercentageEl, stopLossEl, currentPriceLotEl].forEach(el => {
        el.addEventListener('input', calculateLotSize);
    });

    pairLotSelect.addEventListener('change', () => {
        updateCurrentPriceForPair();
    });

    pairPnlSelect.addEventListener('change', () => {
        updateCurrentPriceForPair();
    });

    [lotSizePnlEl, entryPriceEl, exitPriceEl, contractSizeEl, currentPricePnlEl].forEach(el => {
        el.addEventListener('input', calculatePnL);
    });

    pnlDirectionRadios.forEach(radio => {
        radio.addEventListener('change', calculatePnL);
    });

    // Init
    fetchExchangeRates();
    calculateLotSize();
    calculatePnL();
});
