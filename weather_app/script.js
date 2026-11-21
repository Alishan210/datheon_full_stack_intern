// DOM Element References
const searchForm = document.getElementById("search-form");
const cityInput = document.getElementById("city-input");
const loadingSpinner = document.getElementById("loading-spinner");
const errorMessage = document.getElementById("error-message");
const errorText = document.getElementById("error-text");
const weatherCard = document.getElementById("weather-card");

// Weather Card Elements
const cityNameEl = document.getElementById("city-name");
const weatherDateEl = document.getElementById("weather-date");
const weatherIconText = document.getElementById("weather-icon-text");
const temperatureEl = document.getElementById("temperature");
const weatherConditionEl = document.getElementById("weather-condition");
const humidityEl = document.getElementById("humidity");
const windSpeedEl = document.getElementById("wind-speed");
const elevationEl = document.getElementById("elevation");
const timezoneEl = document.getElementById("timezone");
const forecastContainer = document.getElementById("forecast-container");

// Event Listener for Search Form
searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const city = cityInput.value.trim();
    if (city) {
        fetchWeatherData(city);
    }
});

// Weather Code Interpretation Helper
function decodeWeatherCode(code) {
    const weatherMap = {
        0: { text: "Clear Sky", icon: "☀️" },
        1: { text: "Mainly Clear", icon: "🌤️" },
        2: { text: "Partly Cloudy", icon: "⛅" },
        3: { text: "Overcast", icon: "☁️" },
        45: { text: "Foggy", icon: "🌫️" },
        48: { text: "Depositing Rime Fog", icon: "🌫️" },
        51: { text: "Light Drizzle", icon: "🌧️" },
        61: { text: "Slight Rain", icon: "🌧️" },
        63: { text: "Moderate Rain", icon: "🌧️" },
        65: { text: "Heavy Rain", icon: "🌧️" },
        71: { text: "Slight Snow", icon: "❄️" },
        80: { text: "Rain Showers", icon: "🌦️" },
        95: { text: "Thunderstorm", icon: "🌩️" }
    };
    return weatherMap[code] || { text: "Current Weather", icon: "🌡️" };
}

// Asynchronous REST API Request Handler (Open-Meteo & Geocoding API)
async function fetchWeatherData(city) {
    showState("loading");

    try {
        // Step 1: Fetch Coordinates (Latitude/Longitude) for City Name
        const geoResponse = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
        );

        if (!geoResponse.ok) throw new Error("Geocoding service unavailable.");
        
        const geoData = await geoResponse.json();

        if (!geoData.results || geoData.results.length === 0) {
            throw new Error(`City "${city}" not found. Please check spelling.`);
        }

        const location = geoData.results[0];
        const { latitude, longitude, name, country } = location;

        // Step 2: Fetch Live Weather Data & 5-Day Forecast using Coordinates
        const weatherResponse = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max&timezone=auto`
        );

        if (!weatherResponse.ok) throw new Error("Failed to retrieve weather data.");

        const weatherData = await weatherResponse.json();

        // Render Data into UI
        renderWeatherUI(name, country, weatherData);
        renderForecastUI(weatherData.daily);
        showState("weather");

    } catch (error) {
        errorText.textContent = error.message || "An unexpected error occurred.";
        showState("error");
    }
}

// Render Weather Data into DOM
function renderWeatherUI(cityName, country, data) {
    cityNameEl.textContent = `${cityName}, ${country || ''}`;
    weatherDateEl.textContent = new Date().toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric"
    });

    const current = data.current;
    const weatherInfo = decodeWeatherCode(current.weather_code);

    weatherIconText.textContent = weatherInfo.icon;
    temperatureEl.textContent = Math.round(current.temperature_2m);
    weatherConditionEl.textContent = weatherInfo.text;
    humidityEl.textContent = `${current.relative_humidity_2m}%`;
    windSpeedEl.textContent = `${current.wind_speed_10m} km/h`;
    elevationEl.textContent = `${data.elevation || 0} m`;
    timezoneEl.textContent = data.timezone || "UTC";
}

// Render 5-Day Forecast using Array.map()
function renderForecastUI(dailyData) {
    const days = dailyData.time.slice(1, 6);
    
    forecastContainer.innerHTML = days.map((timeString, index) => {
        const dayIndex = index + 1;
        const dateObj = new Date(timeString);
        const dayName = dateObj.toLocaleDateString("en-US", { weekday: "short" });
        
        const maxTemp = Math.round(dailyData.temperature_2m_max[dayIndex]);
        const code = dailyData.weather_code[dayIndex];
        const weatherInfo = decodeWeatherCode(code);

        return `
            <div class="forecast-card">
                <span class="day">${dayName}</span>
                <div class="icon">${weatherInfo.icon}</div>
                <div class="temp">${maxTemp}°C</div>
            </div>
        `;
    }).join("");
}

// UI State Management Controller
function showState(state) {
    loadingSpinner.classList.add("hidden");
    errorMessage.classList.add("hidden");
    weatherCard.classList.add("hidden");

    if (state === "loading") loadingSpinner.classList.remove("hidden");
    if (state === "error") errorMessage.classList.remove("hidden");
    if (state === "weather") weatherCard.classList.remove("hidden");
}