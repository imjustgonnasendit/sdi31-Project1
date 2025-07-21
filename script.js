fetch("https://api.coinlore.net/api/tickers/?limit=5")
  .then((response) => response.json())
  .then((json) => {
    const coins = json.data;
    const container = document.getElementById("top-5-coins");

    coins.forEach((coin) => {
      const coinElement = document.createElement("div");
      coinElement.className = "coin";
      coinElement.innerHTML = `
        <h2>${coin.name} (${coin.symbol})</h2>
        <p>Price: $${parseFloat(coin.price_usd).toFixed(2)}</p>
        <p>Market Cap: $${parseFloat(coin.market_cap_usd).toFixed(2)}</p>
        <p>Volume (24h): $${parseFloat(coin.volume24).toFixed(2)}</p>
      `;
      container.appendChild(coinElement);
    });
  })
  .catch((error) => {
    console.error("Fetch failed:", error);
  });
