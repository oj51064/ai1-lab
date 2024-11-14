document.getElementById('getWeatherButton').addEventListener('click', function() {
    const city = document.getElementById('cityInput').value;
    const apiKey = 'ebe627301f2ca7a7b5f3c18da1b3e5b9';

    if (!city) {
        alert('Wprowadź nazwę miasta!');
        return;
    }

    // Zapytanie do API Current Weather za pomocą XMLHttpRequest
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=pl`);
    xhr.onload = function() {
        if (xhr.status === 200) {
            const currentWeatherData = JSON.parse(xhr.responseText);
            displayCurrentWeather(currentWeatherData);
        } else {
            document.getElementById('currentWeather').textContent = 'Błąd: Nie udało się pobrać danych bieżącej pogody.';
        }
    };
    xhr.send();

    // Zapytanie do API 5-day Forecast za pomocą Fetch API
    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric&lang=pl`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Nie udało się pobrać danych prognozy.');
            }
            return response.json();
        })
        .then(forecastData => {
            displayForecast(forecastData);
        })
        .catch(error => {
            document.getElementById('forecastWeather').textContent = 'Błąd: ' + error.message;
        });
});

function displayCurrentWeather(data) {
    const weatherDiv = document.getElementById('currentWeather');
    const iconUrl = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

    weatherDiv.innerHTML = `
        <h2>Pogoda obecnie w ${data.name}:</h2>
        <img src="${iconUrl}" alt="${data.weather[0].description}">
        <p>Temperatura: ${data.main.temp}°C</p>
        <p>Warunki: ${data.weather[0].description}</p>
        <p>Wilgotność: ${data.main.humidity}%</p>
        <p>Wiatr: ${data.wind.speed} m/s</p>
    `;
}

function displayForecast(data) {
    const forecastDiv = document.getElementById('forecastWeather');
    forecastDiv.innerHTML = '<h2>Prognoza 5-dniowa (co 3 godziny):</h2>';
    
    // Grupa prognoz według dni
    const forecastByDay = {};

    data.list.forEach(item => {
        const date = new Date(item.dt * 1000).toLocaleDateString('pl-PL');
        if (!forecastByDay[date]) {
            forecastByDay[date] = [];
        }
        forecastByDay[date].push(item);
    });

    // Tworzenie wierszy dla każdego dnia
    for (const [date, forecasts] of Object.entries(forecastByDay)) {
        forecastDiv.innerHTML += `<div class="forecast-day"><h3>${date}</h3><div class="forecast-row"></div></div>`;
        const dayContainer = forecastDiv.querySelector('.forecast-day:last-child .forecast-row');

        // Wyświetlanie prognoz godzinowych w linii
        dayContainer.style.display = 'flex';
        dayContainer.style.flexWrap = 'nowrap';
        dayContainer.style.overflowX = 'auto'; // Pozwala na przewijanie, jeśli jest za dużo elementów

        forecasts.forEach(item => {
            const dateTime = new Date(item.dt * 1000).toLocaleString('pl-PL', { hour: '2-digit', minute: '2-digit' });
            const iconUrl = `http://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`;

            dayContainer.innerHTML += `
                <div class="forecast-item">
                    <p><strong>${dateTime}</strong></p>
                    <img src="${iconUrl}" alt="${item.weather[0].description}">
                    <p>Temp: ${item.main.temp}°C</p>
                </div>
            `;
        });
    }
}




