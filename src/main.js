const { invoke } = window.__TAURI__.core;

// Configuration
const BITCOIN_AMOUNT = 0.5; // Your Bitcoin holdings
const API_URL = "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true";
const REFRESH_INTERVAL = 60000; // Refresh every 60 seconds

// DOM Elements
let greetInputEl;
let greetMsgEl;
let btcPriceEl;
let btcChangeEl;
let portfolioValueEl;

// Fetch Bitcoin price data
async function fetchBitcoinPrice() {
  try {
    const response = await fetch(API_URL);
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const data = await response.json();
    return {
      price: data.bitcoin.usd,
      change: data.bitcoin.usd_24h_change
    };
  } catch (error) {
    console.error("Error fetching Bitcoin price:", error);
    return { price: 0, change: 0 };
  }
}

// Update UI with Bitcoin data
function updateUI(data) {
  // Format price with thousand separators
  btcPriceEl.textContent = `$${data.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  
  // Update change percentage
  const changeValue = data.change.toFixed(2);
  btcChangeEl.textContent = `${changeValue}%`;
  
  // Set color based on positive/negative change
  if (data.change >= 0) {
    btcChangeEl.style.color = "#4CAF50";
  } else {
    btcChangeEl.style.color = "#FF5252";
  }
  
  // Calculate portfolio value
  const portfolioValue = data.price * BITCOIN_AMOUNT;
  portfolioValueEl.textContent = `Portfolio: $${portfolioValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

// Initialize the app
async function initialize() {
  const bitcoinData = await fetchBitcoinPrice();
  updateUI(bitcoinData);
  
  // Set up regular price updates
  setInterval(async () => {
    const data = await fetchBitcoinPrice();
    updateUI(data);
  }, REFRESH_INTERVAL);
}

// Wait for DOM to load
window.addEventListener("DOMContentLoaded", () => {
  greetInputEl = document.querySelector("#greet-input");
  greetMsgEl = document.querySelector("#greet-msg");
  document.querySelector("#greet-form").addEventListener("submit", (e) => {
    e.preventDefault();
    greet();
  });

  btcPriceEl = document.getElementById("btc-price");
  btcChangeEl = document.getElementById("btc-change");
  portfolioValueEl = document.getElementById("portfolio-value");
  
  // Initialize the app
  initialize();
});
