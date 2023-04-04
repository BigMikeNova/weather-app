var searchForm = document.querySelector('#search');
var searchInput = document.querySelector('#search-input');
var apiKey = '9b7d5c66f4907f2cb41f1aeb308f77a9';

searchForm.addEventListener('submit', (event) => {
	event.preventDefault();
	searchWeather();
});


async function searchWeather() {
	const city = searchInput.val();
	
	if (city) {
		try {
			const weatherData = await getWeatherData(city);
			displayWeather(weatherData);
			addToSearchHistory(city);
			displaySearchHistory();
			displayForecast(city); 
		} catch (error) {
			console.log(error);
		}
	}
}

async function getWeatherData(city) {
	const url = `https://api.openweathermap.org/data/2.5/weather?q=`
	+city
	+`&appid=`
	+apiKey;
	const response = await fetch(url);
	const data = await response.json();
	return data;
}

function displayWeather(data) {
	const weatherContainer = document.querySelector('#weather-container');
	
	const cityElement = document.createElement('h2');
	cityElement.textContent = data.name;
	weatherContainer.appendChild(cityElement);

	const temperatureElement = document.createElement('p');
	temperatureElement.innerHTML = `Temperature: ${data.main.temp}&deg;C`;
	weatherContainer.appendChild(temperatureElement);

	const descriptionElement = document.createElement('p');
	descriptionElement.innerHTML = `Weather: ${data.weather[0].description}`;
	weatherContainer.appendChild(descriptionElement);
}

function addToSearchHistory(city) {
	// Get the search history array from local storage
	let searchHistoryArray = JSON.parse(localStorage.getItem('searchHistory')) || [];

	// Add the city to the search history array
	searchHistoryArray.unshift(city);

	// Store the updated search history array in local storage
	localStorage.setItem('searchHistory', JSON.stringify(searchHistoryArray));
}


async function displayForecast(city) {
	// Build the URL for the 5-day forecast API call
	const url = `https://api.openweathermap.org/data/2.5/forecast?q=`
	+ city
	+ `&appid=`
	+ apiKey;

	try {
		// Fetch the forecast data for the specified city
		const response = await fetch(url);
		const data = await response.json();

		// Get the forecast container element
		const forecastContainer = document.querySelector('#forecast');

		// Clear the forecast container
		forecastContainer.innerHTML = '';

		// Loop through the forecast data and display each
		data.list.forEach(forecast => {
			// Get the date and time of the forecast
			const forecastDate = new Date(forecast.dt * 1000);

			// Check if the forecast is for noon (12:00 PM) local time
			if (forecastDate.getHours() === 12) {
				// Create a container for the forecast data
				const forecastElement = document.createElement('div');
				forecastElement.classList.add('forecast-item');

				// Create an element for the forecast date
				const dateElement = document.createElement('p');
				dateElement.textContent = forecastDate.toLocaleDateString();
				forecastElement.appendChild(dateElement);

				// Create an element for the forecast icon
				const iconElement = document.createElement('img');
				iconElement.src = `https://openweathermap.org/img/w/${forecast.weather[0].icon}.png`;
				forecastElement.appendChild(iconElement);

				// Create an element for the forecast temperature
				const temperatureElement = document.createElement('p');
				temperatureElement.innerHTML = `Temperature: ${forecast.main.temp}&deg;C`;
				forecastElement.appendChild(temperatureElement);

				// Create an element for the forecast description
				const descriptionElement = document.createElement('p');
				descriptionElement.innerHTML = `Weather: ${forecast.weather[0].description}`;
				forecastElement.appendChild(descriptionElement);

				// Add the forecast data to the forecast container
				forecastContainer.appendChild(forecastElement);
			}
		});
	} catch (error) {
		console.log(error);
	}
}
