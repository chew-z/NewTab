/* 
Weather condition API information: https://openweathermap.org/weather-conditions 
*/

let background = chrome.extension.getBackgroundPage();
let lon = 11.99;
let lat = 43.28;

function setDate($) {
    var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        months = ['Jan', 'Feb', 'March', 'April', 'May', 'June', 'July', 'August', 'Sep', 'Oct', 'Nov', 'Dec'],
        d = new Date(),
        currentDate = days[d.getDay()] + ' | ' + d.getDate() + '&nbsp;' + months[d.getMonth()],
        mins = (d.getMinutes() > 9) ? d.getMinutes() : '0' + d.getMinutes(),
        currentTime = d.getHours() + ':' + mins,
        previousTime = $('.timeArea .time .timeInner').html();
    if (currentTime != previousTime) {
        $('.timeArea .time .timeInner').html(currentTime);
        $('.timeArea .time .date').html(currentDate);
    }
    lat = background.lat;
    lon = background.lon;
    console.log("SunCalc coord: " + lat + "/" + lon);
    let times = SunCalc.getTimes(new Date(), lat, lon);
    // format sunrise time from the Date object
    // let sunriseStr = times.sunrise.getHours() + ':' + times.sunrise.getMinutes();
    let sunriseStr = times.sunrise.toLocaleTimeString('en-US', { hour12: false, hour: 'numeric', minute: '2-digit' });

    // let sunsetStr = times.sunset.getHours() + ':' + times.sunset.getMinutes();
    let sunsetStr = times.sunset.toLocaleTimeString('en-US', { hour12: false, hour: 'numeric', minute: '2-digit' });

    // console.log('Sunrise: ' + sunriseStr + ' Sunset: ' + sunsetStr );
    $('#sunrise').text(sunriseStr);
    $('#sunset').text(sunsetStr);
    let moonphase = SunCalc.getMoonIllumination(new Date()).phase;
    $('#moonphase').text(phases[step(moonphase)].emoji);

    var toggle = true;
    setInterval(function() {
        var d = new Date().toLocaleTimeString('en-US', { hour12: false, hour: 'numeric', minute: '2-digit' });
        var parts = d.split(":");
        $('#hours').text(parts[0]);
        $('#minutes').text(parts[1]);
        $("#colon").css({ visibility: toggle?"visible":"hidden"});
        toggle=!toggle;
    },1000)
}


$(function() {
    // Warsaw
    // let lat = 52.23;
    // let lon = 21.01;
    let weather_city = "Cortona";
    weather_city = background.weather_city;
    // chrome.storage.sync.get("weather_city", (obj) => {
    // //     if(obj.hasOwnProperty("weather_city")) weather_city = obj.weather_city;
    // });
    let $city = $('#city');

    let unit = 'metric';
    let lastData = {};
    let weatherApiKey = '0c2b325ac31651d9520da07547dfc3aa';
    let weatherApi = 'https://api.openweathermap.org/data/2.5/weather?callback=?';
    let startPos;
    let geoOptions = {
        maximumAge: 5 * 60 * 1000,
        timeout: 10 * 1000
    };

    let printResults = function(data) {
        if (data) {
            lastData = data;
        }
        $("#city").text(lastData.name);
        $("#icon").text(lastData.weather.icon);
        $("#temp").text(lastData.main.temp.toFixed(0));
        lat = lastData.coord.lat
        lon = lastData.coord.lon
        console.log("Coord: " + lat + "/" + lon);
        if ( background.lat != lat && background.lon != lon ) {
            // store in storage for future sessions
            chrome.storage.sync.set({ "lat": lat } );
            chrome.storage.sync.set({ "lon": lon } );
            chrome.storage.sync.set({ "weather_city": lastData.name } );
            // store in background for session
            background.weather_city = lastData.name;
            background.lat = lat;
            background.lon = lon;
        }
        // console.log(lastData.name);
        // console.log(lastData.id);
        let currentTime = new Date();
        // get today's sunlight times for location
        let times = SunCalc.getTimes(new Date(), lat, lon);
        if (times.sunrise <= currentTime && currentTime < times.sunset) {
            if (document.body) {
                document.body.background = "/img/background_day.jpg";
                document.body.className = " day";
            }

        } else {
            if (document.body) {
                document.body.background = "/img/background_night.jpg";
                document.body.className = " night";
            }
        }
        setDate($);
        let cityid = lastData.id;
        $("#weatherlink").attr('href', function(index, attr) {
            return ("https://openweathermap.org/city/") + cityid;
        });

        $(".icon").addClass('hidden');
        let weatherCode = parseInt(lastData.weather[0].id, 10);
        let icon = lastData.weather[0].icon;
        let description = lastData.weather[0].description;

        // console.log(weatherCode);
        // console.log(description);
        // console.log(icon);

        if (icon == "01d") {
            $(".sunny").removeClass('hidden');

        } else if (icon == "01n") {
            $(".clear-night").removeClass('hidden');

        } else if (icon == "02d") {
            $(".sunny").removeClass('hidden');

        } else if (icon == "02n") {
            $(".clear-night").removeClass('hidden');

        } else if (icon == "03d") {
            $(".sunny-cloudy").removeClass('hidden');

        } else if (icon == "03n") {
            $(".moon-cloudy").removeClass('hidden');

        } else if (icon == "04d") {
            $(".overcast").removeClass('hidden');

        } else if (icon == "04n") {
            $(".moon-overcast").removeClass('hidden');

        } else if (icon == "09d") {
            $(".drizzle").removeClass('hidden');

        } else if (icon == "09n") {
            $(".moon-drizzle").removeClass('hidden');

        } else if (icon == "10d") {
            $(".rainy").removeClass('hidden');

        } else if (icon == "10n") {
            $(".moon-rainy").removeClass('hidden');

        } else if (icon == "11d") {
            $(".thunderstorm").removeClass('hidden');

        } else if (icon == "11n") {
            $(".moon-thunderstorm").removeClass('hidden');

        } else if (icon == "13d") {
            $(".sun-snow").removeClass('hidden');

        } else if (icon == "13n") {
            $(".moon-snow").removeClass('hidden');

        } else if (icon == "50d") {
            $(".foggy").removeClass('hidden');

        } else if (icon == "50n") {
            $(".foggy-night").removeClass('hidden');

        } else if (weatherCode == 905 || 954 || 956) {
            $(".windy").removeClass('hidden');

        } else {
            $(".unknown").removeClass('hidden');
        }
    };

    let getWeather = function(lat, lon, q) {
        let city = $city.text();
        $city.text(city + ' (Loading...)');
        let weatherData = {
            appid: weatherApiKey,
            units: unit
        };
        if (q) {
            weatherData.q = q;
        } else {
            weatherData.lat = lat;
            weatherData.lon = lon;
        }
        $.getJSON(weatherApi, weatherData, printResults);
    };

    let resetCity = function() {
        $city.text(lastData.name).blur();
    };

    let changeUnit = function() {
        let $temp = $("#temp");
        let $unit = $('#unit');
        let currentTemp = parseFloat($temp.text());
        let newTemp = 0;
        //°C  x  9/5 + 32 = °F
        // (°F  -  32)  x  5/9 = °C
        if (unit === 'imperial') {
            newTemp = (currentTemp - 32) * 5 / 9;
            unit = 'metric';
            $unit.text('°C');
        } else {
            newTemp = currentTemp * 9 / 5 + 32;
            unit = 'imperial';
            $unit.text('°F');
        }
        $temp.text(newTemp.toFixed(0));
    };

    $("#unit").click(changeUnit);
    $("#temp").click(changeUnit);
    getWeather(lat, lon, weather_city);

    // How frequent API call is made for weather update//
    // Max is 60 calls per 1 minute. Default is 300 seconds (1 call per 5 minutes), or 30000(ms) //

    let t = window.setInterval(getWeather, 300000);

    function refreshDiv() {
        $.ajaxSetup({
            cache: false
        });
    };

});
