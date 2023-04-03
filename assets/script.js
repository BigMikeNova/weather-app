const searchInput = document.getElementById('search');
const searchBtn = document.getElementById('searchBtn');
const weatherContainer = document.getElementById('weatherContainer');
const searchHistory = document.getElementById('searchHistory');

searchBtn.addEventListener('click', searchWeather);

function searchWeather() {
	const searchTerm = searchInput.value;
	if(searchTerm) {
		// Store the search term in local storage
		let searchHistoryArray = JSON.parse(localStorage.getItem('searchHistory')) || [];
		searchHistoryArray.push(searchTerm);
		localStorage.setItem('searchHistory', JSON.stringify(searchHistoryArray));

		// Fetch weather data for the searched city
		fetch(`https://api.openweathermap.org/data/2.5/weather?q=${searchTerm}&appid=<9b7d5c66f4907f2cb41f1aeb308f77a9>&units=metric`)
			.then(response => response.json())
			.then(data => {
				// Display weather data for the searched city
				const weatherHTML = `
					<h2>${data.name}, ${data.sys.country}</h2>
					<p>Temperature: ${data.main.temp}°C</p>
					<p>Humidity: ${data.main.humidity}%</p>
					<p>Weather: ${data.weather[0].description}</p>
				`;
				weatherContainer.innerHTML = weatherHTML;
			})
			.catch(error => console.log(error));
	}
}

function displaySearchHistory() {
	// Get the search history array from local storage
	let searchHistoryArray = JSON.parse(localStorage.getItem('searchHistory')) || [];

	// Get the search history container element
	const searchHistory = document.querySelector('#search-history');

	// Clear the search history container
	searchHistory.innerHTML = '';

	// Check if there is any search history
	if (searchHistoryArray.length > 0) {

		// Display search history
		let searchHistoryHTML = '<h2>Search History</h2>';
		searchHistoryArray.forEach(city => {
			searchHistoryHTML += `<p class="search-history-item">${city}</p>`;
		});
		searchHistory.innerHTML = searchHistoryHTML;

		// Add event listener to search history items
		const searchHistoryItems = document.querySelectorAll('.search-history-item');
		searchHistoryItems.forEach(item => {
			item.addEventListener('click', () => {
				searchInput.value = item.textContent;
				searchWeather();
			});
		});
	} else {
		// Display a message if there is no search history
		searchHistory.innerHTML = '<p>No search history found</p>';
	}
}

displaySearchHistory();

