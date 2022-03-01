
/* Get the user's current date with MomentJS*/
const date = document.getElementById('date');
const dateAndTime = moment().format('dddd') + ', ' + moment().format('MMMM Do, YYYY, h:mm a');
date.textContent = dateAndTime;


/* Get the user's current location with the geolocation API */
const getLocation = function() {
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            const lat = position.coords.latitude.toFixed(4); // Allow only 4 decimal places
            const lon = position.coords.longitude.toFixed(4);
            // console.log('lat', lat);
            // console.log('lon', lon);
            getUrl(lat, lon);
        });        
    }
};


const getUrl = (lat, lon) => {
    fetch(`https://api.weather.gov/points/${lat},${lon}`)
        .then(response => {
            return response.json();            
        })
        .then(response => {            
            const url = response.properties.forecast;
            const city = response.properties.relativeLocation.properties.city;
            const state = response.properties.relativeLocation.properties.state;
            const location = document.getElementById('location');
            location.textContent = `${city}, ${state}`;
            // console.log('url: ', url)

            getWeather(url);
        })
        .catch(error => console.log('error: ', error));
}


/* Convert celcius to fahrenheit */
const convertTemp = function(tempF) {
    const tempC = Math.round((tempF - 32) * 5 / 9);
    let convert = false;
    document.getElementById("convert-temp").onclick = function() {
        if(convert) {
            document.getElementById("current-temp").textContent = `${Math.round(tempF)}\u00B0`;
            document.getElementById("convert-temp").textContent = "F";
            document.getElementById("convert-temp").setAttribute("title", "Click to convert to Celcius");
            convert = false;
        } else {
            document.getElementById("current-temp").textContent = `${Math.round(tempC)}\u00B0`;
            document.getElementById("convert-temp").textContent = "C";
            document.getElementById("convert-temp").setAttribute("title", "Click to convert to Fahrenheit");
            convert = true;
        }
    }
};


const getWeather = (url) => {
    fetch(url)
        .then(response => {
            // if (response.status === 200 && response.statusText === "OK") {
                return response.json();
            // } else {
                // const errorMessage = document.getElementById('error');
                // errorMessage.textContent = 'An error occurred: Please refresh the page.'
            // }
        })
        .then(response => {
            const currentTemp = document.getElementById('current-temp');
            const description = document.getElementById('description');
            const icon = document.getElementById('icon');
            const credit = document.getElementById('credit');
            const creditImg = document.getElementById('credit-img'); 
            const tempF = response.properties.periods[0].temperature;
            const tempUnit = response.properties.periods[0].temperatureUnit; 
            const timeOfDay = response.properties.periods[0].name;
            const shortForecast = response.properties.periods[0].shortForecast;
            const detailedForecast = response.properties.periods[0].detailedForecast;
            const weatherImg = response.properties.periods[0].icon;
            const creditTitle = 'National Weather Service';
            const creditImage = './nws.png';
            const creditLink = 'https://www.weather.gov/documentation/services-web-api';

            currentTemp.textContent = `${tempF}\u00B0`;
            description.innerHTML = '<p><span class="conditions">Current Conditions</span>' + detailedForecast + '</p>';
            icon.innerHTML = '<img src=' + weatherImg + '>';
                       
            credit.innerHTML = '<p>Weather delivered by: <a href=' + creditLink + 'target="_blank">' + creditTitle + ' API</a></p>';
            creditImg.innerHTML = '<img src=' + creditImage + '>';

            const design = document.getElementById('design');
            design.innerHTML = '<p class="design">Design inspired by: <a href="https://weather.com/weather/today/l/e98a878cd02dd90c43e4567f4cb5b1824f77886502447b0fc7136cfe697d7d6f" target="_blank">The Weather Channel</a></p>';
                
            const convertTemperature = document.getElementById('convert-temp');
            convertTemperature.addEventListener('click', convertTemp(tempF)); 
        })
        .catch(error => console.log('error: ', error));
}


window.onload = function() {
    getLocation();
    getUrl();
    getWeather();
};