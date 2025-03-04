const { invoke } = window.__TAURI__.core;

// Configuration
const BINANCE_WS_URL = 'wss://stream.binance.com:9443/ws/btcusdt@ticker';

// DOM Elements
let btcPriceEl;
let btcChangeEl;

// WebSocket connection
let ws;

// Connect to Binance WebSocket
function connectWebSocket() {
  // Close existing connection if any
  if (ws) {
    ws.close();
  }
  
  // Create new WebSocket connection
  ws = new WebSocket(BINANCE_WS_URL);
  
  // Handle WebSocket open event
  ws.onopen = () => {
    console.log('Connected to Binance WebSocket');
  };
  
  // Handle WebSocket message event
  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      updateUI({
        price: parseFloat(data.c), // Current price
        change: parseFloat(data.p) // Price change
      });
    } catch (error) {
      console.error('Error processing WebSocket data:', error);
    }
  };
  
  // Handle WebSocket error
  ws.onerror = (error) => {
    console.error('WebSocket error:', error);
  };
  
  // Handle WebSocket close event and attempt to reconnect
  ws.onclose = (event) => {
    console.log('WebSocket connection closed:', event.code, event.reason);
    
    // Attempt to reconnect after a delay
    setTimeout(() => {
      console.log('Attempting to reconnect...');
      connectWebSocket();
    }, 5000); // Reconnect after 5 seconds
  };
}

// Update UI with Bitcoin data
function updateUI(data) {
  // Format price with thousand separators
  btcPriceEl.textContent = `$${parseFloat(data.price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  
  // Update change percentage
  const changeValue = data.change.toFixed(2);
  btcChangeEl.textContent = `${changeValue}%`;
  
  // Set color based on positive/negative change
  if (data.change >= 0) {
    btcChangeEl.style.color = "#4CAF50";
  } else {
    btcChangeEl.style.color = "#FF5252";
  }
}

// Wait for DOM to load
window.addEventListener("DOMContentLoaded", () => {
  btcPriceEl = document.getElementById("btc-price");
  btcChangeEl = document.getElementById("btc-change");
  
  // Set initial values
  btcPriceEl.textContent = "$0.00";
  btcChangeEl.textContent = "0.00%";
  
  // Connect to Binance WebSocket
  connectWebSocket();
});

// Clean up WebSocket connection when the window is closed
window.addEventListener("beforeunload", () => {
  if (ws) {
    ws.close();
  }
});
