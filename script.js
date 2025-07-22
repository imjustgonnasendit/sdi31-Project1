// Reference watchlist container and top 5 container once
const watchlist = document.getElementById("watchlist-items");
const top5Container = document.getElementById("top-5-coins");
const searchResultsDiv = document.getElementById("search-results");
const searchInput = document.getElementById("search-input");

// Fetch and display top 5 coins by market cap from CoinGecko
fetch(
  "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=5&page=1"
)
  .then((res) => res.json())
  .then((coins) => {
    top5Container.innerHTML = "";

    coins.forEach((coin) => {
      const coinElement = document.createElement("div");
      coinElement.className = "coin";
      coinElement.innerHTML = `
        <h2>${coin.name} (${coin.symbol.toUpperCase()})</h2>
        <p>Price: $${coin.current_price.toFixed(2)}</p>
        <p>Market Cap: $${coin.market_cap.toLocaleString()}</p>
        <p>Volume (24h): $${coin.total_volume.toLocaleString()}</p>
      `;

      // Click coin card to add to watchlist with chart
      coinElement.addEventListener("click", () => addChartForCoin(coin));

      top5Container.appendChild(coinElement);
    });
  })
  .catch((err) => console.error("Failed to load top 5 coins:", err));

// Search functionality using CoinGecko search API
document.getElementById("search-button").addEventListener("click", () => {
  const query = searchInput.value.trim().toLowerCase();
  if (!query) return;

  fetch(`https://api.coingecko.com/api/v3/search?query=${query}`)
    .then((res) => res.json())
    .then((json) => {
      // json.coins is array of coins
      renderSearchResults(json.coins);
    })
    .catch((err) => console.error("Search failed:", err));
});

// Render search results with add button
function renderSearchResults(coins) {
  searchResultsDiv.innerHTML = "";

  if (coins.length === 0) {
    searchResultsDiv.textContent = "No coins found.";
    return;
  }

  coins.forEach((coin) => {
    const div = document.createElement("div");
    div.className = "coin";
    div.innerHTML = `
      <h3>${coin.name} (${coin.symbol.toUpperCase()})</h3>
      <button class="add-to-watchlist" data-id="${
        coin.id
      }">Add to Watchlist</button>
    `;
    searchResultsDiv.appendChild(div);
  });
}

// Listen for add-to-watchlist clicks in search results
searchResultsDiv.addEventListener("click", (e) => {
  if (!e.target.classList.contains("add-to-watchlist")) return;

  const coinId = e.target.dataset.id;
  if (!coinId) return;

  // Fetch coin market data for selected coin (to get price, market cap, volume)
  fetch(
    `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${coinId}`
  )
    .then((res) => res.json())
    .then((coins) => {
      if (coins.length === 0) {
        alert("Coin data not found");
        return;
      }
      addChartForCoin(coins[0]);

      // Clear search results and input
      searchResultsDiv.innerHTML = "";
      searchInput.value = "";
    })
    .catch((err) => console.error("Failed to add coin to watchlist:", err));
});

// Add coin info + CoinGecko chart widget to watchlist
function addChartForCoin(coin) {
  console.log("Adding widget for coin:", coin.id);

  const watchlist = document.getElementById("watchlist-items");

  // Prevent duplicates
  if ([...watchlist.children].some((div) => div.dataset.coinId === coin.id)) {
    alert(`${coin.name} is already in your watchlist.`);
    return;
  }

  const div = document.createElement("div");
  div.className = "coin";
  div.dataset.coinId = coin.id;

  // Build coin info and chart using innerHTML
  div.innerHTML = `
    <h4>${coin.name} (${coin.symbol.toUpperCase()})</h4>
    <p>Price: $${coin.current_price.toFixed(2)}</p>
    <p>Market Cap: $${coin.market_cap.toLocaleString()}</p>
    <p>Volume (24h): $${coin.total_volume.toLocaleString()}</p>
    <button class="remove-coin">Remove</button>

    <gecko-coin-price-chart-widget
      coin-id="${coin.id}"
      currency="usd"
      locale="en"
      outlined="true"
      style="width: 100%; height: 300px;">
    </gecko-coin-price-chart-widget>
  `;

  watchlist.appendChild(div);
}

// Remove coin from watchlist
watchlist.addEventListener("click", (e) => {
  if (!e.target.classList.contains("remove-coin")) return;

  const coinDiv = e.target.closest(".coin");
  if (coinDiv) coinDiv.remove();
});
