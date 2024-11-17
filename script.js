const apiKey = 'e94cf2f4f3f5100a36901c786c9224c8';

// Function to hide the weather card initially
function hideWeatherCard() {
    const weatherCard = document.getElementById('current-weather');
    weatherCard.classList.add('hidden');
}

// Function to show the weather card
function showWeatherCard() {
    const weatherCard = document.getElementById('current-weather');
    weatherCard.classList.remove('hidden');
}

hideWeatherCard();

// Function to fetch weather data
function displayCurrentWeather(data) {
    const weatherDescription = data.weather[0].description;
    const temperature = data.main.temp;
    const humidity = data.main.humidity;
    const windSpeed = data.wind.speed;
    const weatherIcon = data.weather[0].icon;
    const cityName = data.name;

    document.getElementById('weather-description').innerText = weatherDescription.charAt(0).toUpperCase() + weatherDescription.slice(1);
    document.getElementById('temperature').innerText = `${temperature}°C`;
    document.getElementById('humidity').innerText = `${humidity}%`;
    document.getElementById('wind-speed').innerText = `${windSpeed} m/s`;
    document.getElementById('location').innerText = cityName;

    const iconUrl = `http://openweathermap.org/img/wn/${weatherIcon}@2x.png`;
    document.getElementById('weather-icon').innerHTML = `<img src="${iconUrl}" alt="Weather Icon">`;

    showWeatherCard();
}

// Function to display the 5-day weather forecast
function displayForecast(data) {
    const forecastContainer = document.getElementById('forecast');
    forecastContainer.innerHTML = '';

    for (let i = 0; i < data.list.length; i += 8) { // Increment by 8 to get daily forecast (every 24 hours)
        const forecast = data.list[i];
        const date = new Date(forecast.dt * 1000).toLocaleDateString();
        const temp = forecast.main.temp;
        const weatherIcon = forecast.weather[0].icon;
        const weatherDescription = forecast.weather[0].description;

        const forecastDay = `
            <div class="forecast-day">
                <h3>${date}</h3>
                <img src="http://openweathermap.org/img/wn/${weatherIcon}@2x.png" alt="Weather Icon">
                <p>${weatherDescription.charAt(0).toUpperCase() + weatherDescription.slice(1)}</p>
                <p>${temp}°C</p>
            </div>
        `;
        forecastContainer.innerHTML += forecastDay;
    }

    // Display the forecast section
    const forecastCard = document.getElementById('forecast-container');
    forecastCard.classList.remove('hidden');
    forecastCard.classList.add('visible');
}

// Function to handle the search button click
document.getElementById('search-btn').addEventListener('click', () => {
    const city = document.getElementById('city').value;
    if (city) {
        getWeatherData(city);
    } else {
        alert('Please enter a city name');
    }
});

// Fetch and display the weather data (current + 5-day forecast)
function getWeatherData(city) {
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    // Fetch current weather
    fetch(currentWeatherUrl)
        .then(response => {
            if (response.status === 404) {
                // Specific error for city not found
                throw new Error('City not found');
            } else if (!response.ok) {
                // General error for other issues
                throw new Error('Error fetching data');
            }
            return response.json();
        })
        .then(data => {
            displayCurrentWeather(data);
        })
        .catch(error => {
            if (error.message === 'City not found') {
                alert('City not found. Please try again with a valid city name.');
            } else {
                console.error('Error:', error);
                alert('Error fetching current weather data. Please try again.');
            }
        });

    // Fetch 5-day forecast
    fetch(forecastUrl)
        .then(response => {
            if (response.status === 404) {
                // Specific error for city not found in forecast
                throw new Error('City not found');
            } else if (!response.ok) {
                throw new Error('Error fetching forecast data');
            }
            return response.json();
        })
        .then(data => {
            displayForecast(data);
        })
        .catch(error => {
            if (error.message === 'City not found') {
                alert('City not found. Please try again with a valid city name.');
            } else {
                console.error('Error:', error);
                alert('Error fetching 5-day forecast data. Please try again.');
            }
        });
}