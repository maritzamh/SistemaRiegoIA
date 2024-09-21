const weatherInfo = document.getElementById('weather-info');
const cityElement = document.getElementById('city');
const temperatureElement = document.getElementById('temperature');
const weatherIcon = document.getElementById('weather-icon');
const descriptionElement = document.getElementById('description');
const loader = document.getElementById('loader');

// Función para obtener la ubicación del usuario usando la API de geolocalización
function getLocation() {
    loader.style.display = 'block'; // Mostrar el loader
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(success, error);
    } else {
        alert('Geolocalización no es soportada por este navegador.');
        loader.style.display = 'none'; // Ocultar el loader
    }
}

// Función que se ejecuta al obtener la ubicación
function success(position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    getWeather(lat, lon);
}

// Función que se ejecuta si hay un error al obtener la ubicación
function error() {
    alert('No se pudo obtener la ubicación.');
    loader.style.display = 'none'; // Ocultar el loader
}

// Función para obtener el clima usando OpenWeatherMap
function getWeather(lat, lon) {
    const apiKey = '06ca8f1cab182c8132ce9ba675537aaf';  // Reemplaza con tu clave de OpenWeatherMap
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`)
        .then(response => {
            if (!response.ok) throw new Error('Error en la API del clima');
            return response.json();
        })
        .then(data => {
            const temperature = data.main.temp;
            const description = data.weather[0].description;
            const icon = data.weather[0].icon;

            cityElement.textContent = `Clima en ${data.name}`;
            temperatureElement.textContent = `Temperatura: ${Math.round(temperature)}°C`;
            weatherIcon.src = `http://openweathermap.org/img/wn/${icon}@2x.png`;
            descriptionElement.textContent = description.charAt(0).toUpperCase() + description.slice(1);

            weatherInfo.style.display = 'block'; // Mostrar la información del clima
            loader.style.display = 'none'; // Ocultar el loader
        })
        .catch(error => {
            console.error('Error al obtener el clima:', error);
            alert('No se pudo obtener el clima.');
            loader.style.display = 'none'; // Ocultar el loader en caso de error
        });
}

// Llamar a la función para obtener la ubicación y clima al cargar la página
window.onload = getLocation;
