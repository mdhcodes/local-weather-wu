/* Get the user's current date with MomentJS*/

var dateAndTime = moment().format('dddd') + ', ' + moment().format('MMMM Do, YYYY, h:mm a');
document.getElementById("date").innerHTML = dateAndTime;


/* Get the user's current location with the geolocation API */

var getLocation = function() {
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var lat = position.coords.latitude;
            var lon = position.coords.longitude;
            getWeather(lat, lon);
        });
    }
};


/* Get the weather for the user's current location with the Weather Underground API */

var getWeather = function(lat, lon) {
    var req = new XMLHttpRequest();
    var url = "https://api.wunderground.com/api/0126420f39b48bf0/conditions/q/" + lat + "," + lon + ".json";
    req.open("GET", url, true);
    req.onload = function(response) {
        if(req.status === 200 && req.statusText === "OK") {
            response = JSON.parse(req.responseText);
            var location = response['current_observation']['display_location']['full'];
            var tempC = response['current_observation']['temp_c'];
            var tempF = response['current_observation']['temp_f'];
            var description = response['current_observation']['weather'];
            var icon = response['current_observation']['icon_url'];
            var humidity = response['current_observation']['relative_humidity'];
            var feelsLikeC = response['current_observation']['feelslike_c'];
            var feelsLikeF = response['current_observation']['feelslike_f'];
            var windDirection = response['current_observation']['wind_dir'];
            var creditTitle = response['current_observation']['image']['title'];
            var creditImage = response['current_observation']['image']['url'];
            var creditLink = response['current_observation']['image']['link'];
            document.getElementById("location").innerHTML = location;
            document.getElementById("current-temp").innerHTML = 'Now: ' + Math.round(tempC) + '°';
            document.getElementById("description").innerHTML = description;
            document.getElementById("icon").innerHTML = '<img src=' + icon + '>';
            document.getElementById("feels-like").innerHTML = 'Feels Like: ' + Math.round(feelsLikeC) + '°';
            document.getElementById("humidity").innerHTML = 'Humidity: ' + humidity;
            document.getElementById("wind-direction").innerHTML = 'Wind Direction: ' + windDirection;
            document.getElementById("credit").innerHTML = '<img src=' + creditImage + '><p>Weather delivered by: <a href=' + creditLink + 'target="_blank">' + creditTitle + ' API</a></p>';
        } else {
            var error = document.getElementById("error");
            error.innerHTML = "An error occurred: Please refresh the page.";
            error.style.color = "#f00";
            error.style.border = "solid";
        }
        // Passing local variables to the convertTemp function
        convertTemp(tempC, tempF, feelsLikeC, feelsLikeF);
    };
    req.send();
};


/* Convert celcius to fahrenheit */

var convertTemp = function(tempC, tempF, feelsLikeC, feelsLikeF) {
    var convert = false;
    document.getElementById("convert-temp").onclick = function() {
        if(convert) {
            document.getElementById("current-temp").innerHTML = 'Now: ' + Math.round(tempC) + '°';
            document.getElementById("feels-like").innerHTML = 'Feels Like: ' + Math.round(feelsLikeC) + '°';
            document.getElementById("convert-temp").innerHTML = "C";
            document.getElementById("convert-temp").setAttribute("title", "Click to convert to Fahrenheit");
            convert = false;
        } else {
            document.getElementById("current-temp").innerHTML = 'Now: ' + Math.round(tempF) + '°';
            document.getElementById("feels-like").innerHTML = 'Feels Like: ' + Math.round(feelsLikeF) + '°';
            document.getElementById("convert-temp").innerHTML = "F";
            document.getElementById("convert-temp").setAttribute("title", "Click to convert to Celcius");
            convert = true;
        }
    }
};



window.onload = function() {
    getLocation();
    getWeather();
    convertTemp();
};
