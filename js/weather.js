/* 
Weather condition API information: https://openweathermap.org/weather-conditions 
*/


$(function() {
    var $city = $('#city');

    var unit = 'metric';
    var lastData = {};
    var weatherApiKey = '0c2b325ac31651d9520da07547dfc3aa';
    var weatherApi = 'https://api.openweathermap.org/data/2.5/weather?callback=?';
    var startPos;
    // Warsaw
    var lat = 52.23;
    var lon = 21.01;
    var geoOptions = {
        maximumAge: 5 * 60 * 1000,
        timeout: 10 * 1000
    };

    var printResults = function(data) {
        if (data) {
            lastData = data;
        }
        $("#city").text(lastData.name);
        $("#icon").text(lastData.weather.icon);
        $("#temp").text(lastData.main.temp.toFixed(0));

        console.log(lastData.name);
        console.log(lastData.id);

        var cityid = lastData.id;
        $("#weatherlink").attr('href', function(index, attr) {
            return ("https://openweathermap.org/city/") + cityid;
        });

        $(".icon").addClass('hidden');
        var weatherCode = parseInt(lastData.weather[0].id, 10);
        var icon = lastData.weather[0].icon;
        var description = lastData.weather[0].description;

        console.log(weatherCode);
        console.log(description);
        console.log(icon);

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

    var getWeather = function(lat, lon, q) {
        var city = $city.text();
        $city.text(city + ' (Loading...)');
        var weatherData = {
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

    var resetCity = function() {
        $city.text(lastData.name).blur();
    };

    var changeUnit = function() {
        var $temp = $("#temp");
        var $unit = $('#unit');
        var currentTemp = parseFloat($temp.text());
        var newTemp = 0;
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
    getWeather(lat, lon);

    // How frequent API call is made for weather update//
    // Max is 60 calls per 1 minute. Default is 300 seconds (1 call per 5 minutes), or 30000(ms) //

    var t = window.setInterval(getWeather, 300000);

    function refreshDiv() {
        $.ajaxSetup({
            cache: false
        });
    };

});
