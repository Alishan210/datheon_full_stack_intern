# WeatherPulse — Real-Time Weather & 5-Day Forecast Portal
..............
A responsive, zero-API-key web application built with **HTML5, CSS3, and Vanilla JavaScript (ES6+)** that fetches live meteorological data and a 5-day forecast using the **Open-Meteo Geocoding & Forecast REST APIs**.
............
------

## ✨ Key Features
.........
* **City Search & Geocoding:** Converts city names into latitude and longitude coordinates using the Open-Meteo Geocoding API.
* **Real-Time Weather Telemetry:** Displays current temperature (°C), weather condition with emoji icons, relative humidity, wind speed, elevation, and timezone.
* **5-Day Daily Forecast:** Dynamically renders upcoming 5-day forecast cards using `Array.prototype.slice()` and `Array.prototype.map()`.
* **UI State Management:** Cleanly switches between **Loading Spinner**, **Error Card** (for invalid cities or network issues), and **Weather Result Card** states.
* **Responsive Layout:** Styled with CSS custom properties (`:root`), flexbox/grid layouts, and horizontal scrolling for forecast cards.

.........

## 🛠️ Tech Stack

* **Frontend:** HTML5, CSS3 (Flexbox, CSS Grid, CSS Variables)
* **Scripting:** JavaScript (`async/await`, `fetch`, `try...catch`, `Array.map()`)
* **APIs:**
  * [Open-Meteo Geocoding API](https://open-meteo.com/en/docs/geocoding-api)
  * [Open-Meteo Weather Forecast API](https://open-meteo.com/en/docs)


## 📁 Project Structure

```text
weather-portal/
├── index.html      # Main markup and UI state containers
├── style.css       # Styling, theme variables, and responsive cards
├── script.js       # API calls, weather code mapping, DOM & forecast rendering
└── README.md       # Project documentation