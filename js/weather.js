const apiKey = 'ca0d65b75932d7e7535f5e8575e73df8';

// suggestions
/*
function showSuggestions(query) {
    if (query.length < 3) {
        document.getElementById('suggestions').innerHTML = '';
        return;
    }

    const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${apiKey}`;

    fetch(geoUrl)
        .then(response => response.json())
        .then(data => {
            const suggestionsContainer = document.getElementById('suggestions');
            suggestionsContainer.innerHTML = '';

            data.forEach(city => {
                const suggestion = document.createElement('div');
                suggestion.classList.add('suggestion');
                suggestion.textContent = `${city.name}, ${city.country}`;
                suggestion.onclick = () => selectCity(city.name);

                suggestionsContainer.appendChild(suggestion);
            });
        })
        .catch(error => console.log("Error:", error));
}
*/
// choose a city
function selectCity(cityName) {
    document.getElementById('cityInput').value = cityName;
    document.getElementById('suggestions').innerHTML = '';
    fetchWeather(); 
}

//weather
function fetchWeather() {
    const city = document.getElementById('cityInput').value;
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            document.getElementById('cityName').textContent = data.name;
            document.getElementById('temp').textContent = `${Math.round(data.main.temp)}°C`;
            document.getElementById('weatherDescription').textContent = data.weather[0].description;
            document.getElementById('humidity').textContent = `Humidity: ${data.main.humidity}%`;
            document.getElementById('windSpeed').textContent = `Wind speed: ${data.wind.speed} m/s`;

            const today = new Date();
            const options = { weekday: 'long', month: 'long', day: 'numeric' };
            document.getElementById('date').textContent = today.toLocaleDateString('en-EN', options);

            fetchForecast(city);
        })
        .catch(error => console.log("Error:", error));
}

function fetchForecast(city) {
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;

    fetch(forecastUrl)
        .then(response => response.json())
        .then(data => {
            const forecastContainer = document.getElementById('forecast');
            forecastContainer.innerHTML = ''; 
            const dailyForecast = data.list.filter(forecast => forecast.dt_txt.includes("12:00:00"));
            dailyForecast.slice(0, 5).forEach(day => {
                const forecastElement = document.createElement('div');
                forecastElement.classList.add('forecast-day');
                
                const date = new Date(day.dt * 1000).toLocaleDateString('en-EN', { day: 'numeric', month: 'short' });
                const dayName = new Date(day.dt * 1000).toLocaleDateString('en-EN', { weekday: 'long' });
                const iconUrl = `https://openweathermap.org/img/wn/${day.weather[0].icon}.png`;
                
                forecastElement.innerHTML = `
                    <p class="day">${dayName}</p>
                    <p class="date">${date}</p>
                    <img src="${iconUrl}" alt="Weather icon">
                    <p class="forecast-temp">${Math.round(day.main.temp)}°C</p>
                    <p class="forecast-desc">${day.weather[0].description}</p>
                `;

                forecastContainer.appendChild(forecastElement);
            });
        })
        .catch(error => console.log("Error:", error));
}

//hide suggestions
document.getElementById('cityInput').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        document.getElementById('suggestions').innerHTML = '';
        fetchWeather();
    }
});
