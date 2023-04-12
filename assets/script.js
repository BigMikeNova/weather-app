var searchForm = document.querySelector('#search');
var searchInput = document.querySelector('#search-input');
var APIKey = '9b7d5c66f4907f2cb41f1aeb308f77a9';

searchForm.addEventListener('submit', (event) => {
	event.preventDefault();
	searchWeather();
});


var searchBtnEl = document.querySelector("#searchBtn");
searchBtnEl.addEventListener("click", addResult);

searchInput.addEventListener("keypress", function(event) {
  // If the user presses the "Enter" key on the keyboard
  if (event.key === "Enter") {
    // Cancel the default action, if needed
    event.preventDefault();
    // Trigger the search button element with a click
    searchBtnEl.click();
  }
});


function addResult(event) {
  event.preventDefault();
  let searchInput = document.querySelector("#search");
  var cityInput = searchInput.value;
  console.log(cityInput);
  searchCity(cityInput);
}

// function to get lat, lon of city
function searchCity(userInput) {
  document.querySelector("#weatherContainer").innerHTML = "";
  // api search function goes here
  var geoUrl =
    "https://api.openweathermap.org/geo/1.0/direct?q=" +
    userInput +
    "&limit=5&appid=" +
    APIKey;
  fetch(geoUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      var cityData = data[0];
      console.log(cityData);
      var geoLat = cityData.lat;
      var geoLon = cityData.lon;
      getWeatherData(geoLat, geoLon, cityData);
    });
  console.log("Your city is: " + userInput);
}

// function to get current weather for searched city
function currentWeather(weatherObj) {
  // var dateTime = weatherObj.dt_txt;
  var tempData = weatherObj.list[0].main.temp;
  var windSpeedData = weatherObj.list[0].wind.speed;
  var currentConditionsData = weatherObj.list[0].weather[0].description;
  var weatherIcon = weatherObj.list[0].weather[0].icon;
  imgSrc = "https://openweathermap.org/img/wn/" + weatherIcon + ".png";
  var cityNameData = weatherObj.city.name;
  var dateTxt = weatherObj.list[0].dt_txt.split(" ");
  var cityEl = $("#weatherContainer");
  cityEl.append($("<h2>").text(" Today in " + cityNameData + "(" + dateTxt[0] + ")"));
  cityEl.append($("<img>").attr("src", imgSrc));
  cityEl.append($("<p>").text(" Temp: " + tempData + "F"));
  cityEl.append($("<p>").text(" Wind Speed: " + windSpeedData + "mph"));
  cityEl.append($("<p>").text(" Conditions: " + currentConditionsData));

}

// function to get forecasted weather for searched city from earlier called API
function getForecast(arrayOfWeatherObjs) {
  var list = $("#weatherContainer");
  list.attr("style", "width: 375px;");
  console.log(arrayOfWeatherObjs);
  for (let i = 0; i < arrayOfWeatherObjs.length; i++) {
    var obj = arrayOfWeatherObjs[i];
    var dayTimeDisplay = obj.dt_txt.split(" ");
    if (obj.dt_txt.includes("12:00:00")) {
      var forecastListItems = $("<li>");
      forecastListItems.attr("style", "list-style-type: none;");
      var forecastTempData = Math.floor(obj.main.temp);
      var forecastWindSpeedData = Math.floor(obj.wind.speed);
      var forecastCoonditions = obj.weather[0].description;
      var forecastWeatherIcon = obj.weather[0].icon;
      imgSrc = "https://openweathermap.org/img/wn/" + forecastWeatherIcon + ".png";
      forecastListItems.append($("<hr>"));
      forecastListItems.append($("<h3>").text(dayTimeDisplay[0]));
      forecastListItems.append($("<img>").attr("src", imgSrc));
      forecastListItems.append($("<p>").text(" Temp: " + forecastTempData + "F"));
      forecastListItems.append($("<p>").text(" Wind Speed: " + forecastWindSpeedData + "mph"));
      forecastListItems.append($("<p>").text(" Condtions: " + forecastCoonditions));
      list.append(forecastListItems);
    }
  }
}

// calls Open weather API to get weather
function getWeatherData(lat, lon) {
  $("#weatherContainer").addClass("list-group");
  $("#weatherContainer").append($("<ol>"));
  $("#weatherContainer").attr("style", "display:inline-block");

  var weatherUrl =
    "https://api.openweathermap.org/data/2.5/forecast?lat=" +
    lat +
    "&lon=" +
    lon +
    "&units=imperial&appid=" +
    APIKey;

  fetch(weatherUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      currentWeather(data);
      getForecast(data.list);
    });
}
var searchEL = document.querySelector("#searchBtn");
