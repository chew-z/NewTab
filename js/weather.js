/* 
Weather condition API information: https://openweathermap.org/weather-conditions 
*/
/* global SunCalc */
let lon = 11.99;
let lat = 43.28;
const background = chrome.extension.getBackgroundPage();
const phases = [
    { emoji: "🌚", code: ":new_moon_with_face:", name: "New Moon", weight: 1 },
    {
        emoji: "🌒",
        code: ":waxing_crescent_moon:",
        name: "Waxing Crescent",
        weight: 6.3825,
    },
    {
        emoji: "🌓",
        code: ":first_quarter_moon:",
        name: "First Quarter",
        weight: 1,
    },
    {
        emoji: "🌔",
        code: ":waxing_gibbous_moon:",
        name: "Waxing Gibbous",
        weight: 6.3825,
    },
    { emoji: "🌝", code: ":full_moon_with_face:", name: "Full Moon", weight: 1 },
    {
        emoji: "🌖",
        code: ":waning_gibbous_moon:",
        name: "Waning Gibbous",
        weight: 6.3825,
    },
    { emoji: "🌗", code: ":last_quarter_moon:", name: "Last Quarter", weight: 1 },
    {
        emoji: "🌘",
        code: ":waning_crescent_moon:",
        name: "Waning Crescent",
        weight: 6.3825,
    },
];

const step = function(phase) {
    const weight = phases.reduce((a, b) => a + b.weight, 0);
    let rv;
    let ph = phase;
    ph *= weight;
    for (rv = 0; rv < phases.length; rv++) {
        ph -= phases[rv].weight;
        if (ph <= 0) {
            break;
        }
    }

    return rv;
};

function setDate($) {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

    const months = ["Jan", "Feb", "March", "April", "May", "June", "July", "August", "Sep", "Oct", "Nov", "Dec"];

    let d = new Date();

    const currentDate = `${days[d.getDay()]} | ${d.getDate()}&nbsp;${months[d.getMonth()]}`;

    const mins = d.getMinutes() > 9 ? d.getMinutes() : `0${d.getMinutes()}`;

    const currentTime = `${d.getHours()}:${mins}`;

    const previousTime = $(".timeArea .time .timeInner").html();
    if (currentTime !== previousTime) {
        $(".timeArea .time .timeInner").html(currentTime);
        $(".timeArea .time .date").html(currentDate);
    }
    lat = background.lat;
    lon = background.lon;
    console.log(`SunCalc coord: ${lat}/${lon}`);
    const times = SunCalc.getTimes(new Date(), lat, lon);
    // format sunrise time from the Date object
    // let sunriseStr = times.sunrise.getHours() + ':' + times.sunrise.getMinutes();
    const sunriseStr = times.sunrise.toLocaleTimeString("en-US", {
        hour12: false,
        hour: "numeric",
        minute: "2-digit",
    });

    // let sunsetStr = times.sunset.getHours() + ':' + times.sunset.getMinutes();
    const sunsetStr = times.sunset.toLocaleTimeString("en-US", {
        hour12: false,
        hour: "numeric",
        minute: "2-digit",
    });

    // console.log('Sunrise: ' + sunriseStr + ' Sunset: ' + sunsetStr );
    $("#sunrise").text(sunriseStr);
    $("#sunset").text(sunsetStr);
    const moonphase = SunCalc.getMoonIllumination(new Date()).phase;
    $("#moonphase").text(phases[step(moonphase)].emoji);

    let toggle = true;
    setInterval(() => {
        d = new Date().toLocaleTimeString("en-US", {
            hour12: false,
            hour: "numeric",
            minute: "2-digit",
        });
        const parts = d.split(":");
        $("#hours").text(parts[0]);
        $("#minutes").text(parts[1]);
        $("#colon").css({ visibility: toggle ? "visible" : "hidden" });
        toggle = !toggle;
    }, 1000);
}

$(() => {
    // Warsaw
    // let lat = 52.23;
    // let lon = 21.01;
    let weather_city = "Cortona";
    weather_city = background.weather_city;
    const $city = $("#city");

    let unit = "metric";
    let lastData = {};
    const weatherApiKey = "0c2b325ac31651d9520da07547dfc3aa";
    const weatherApi = "https://api.openweathermap.org/data/2.5/weather?callback=?";
    const printResults = function(data) {
        if (data) {
            lastData = data;
        }
        $("#city").text(lastData.name);
        $("#icon").text(lastData.weather.icon);
        $("#temp").text(lastData.main.temp.toFixed(0));
        lat = lastData.coord.lat;
        lon = lastData.coord.lon;
        console.log(`Coord: ${lat}/${lon}`);
        if (background.lat !== lat && background.lon !== lon) {
            // store in storage for future sessions
            chrome.storage.sync.set({ lat: lat, lon: lon, weather_city: lastData.name });
            // store in background for session
            background.weather_city = lastData.name;
            background.lat = lat;
            background.lon = lon;
        }
        const currentTime = new Date();
        // get today's sunlight times for location
        const times = SunCalc.getTimes(new Date(), lat, lon);
        if (times.sunrise <= currentTime && currentTime < times.sunset) {
            if (document.body) {
                document.body.background = "/img/background_day.jpg";
                document.body.className = " day";
            }
        } else if (document.body) {
            document.body.background = "/img/background_night.jpg";
            document.body.className = " night";
        }
        setDate($);
        const cityid = lastData.id;
        $("#weatherlink").attr("href", (index, attr) => `https://openweathermap.org/city/${cityid}`);

        $(".icon").addClass("hidden");
        const weatherCode = parseInt(lastData.weather[0].id, 10);
        const icon = lastData.weather[0].icon;
        if (icon === "01d") {
            $(".sunny").removeClass("hidden");
        } else if (icon === "01n") {
            $(".clear-night").removeClass("hidden");
        } else if (icon === "02d") {
            $(".sunny").removeClass("hidden");
        } else if (icon === "02n") {
            $(".clear-night").removeClass("hidden");
        } else if (icon === "03d") {
            $(".sunny-cloudy").removeClass("hidden");
        } else if (icon === "03n") {
            $(".moon-cloudy").removeClass("hidden");
        } else if (icon === "04d") {
            $(".overcast").removeClass("hidden");
        } else if (icon === "04n") {
            $(".moon-overcast").removeClass("hidden");
        } else if (icon === "09d") {
            $(".drizzle").removeClass("hidden");
        } else if (icon === "09n") {
            $(".moon-drizzle").removeClass("hidden");
        } else if (icon === "10d") {
            $(".rainy").removeClass("hidden");
        } else if (icon === "10n") {
            $(".moon-rainy").removeClass("hidden");
        } else if (icon === "11d") {
            $(".thunderstorm").removeClass("hidden");
        } else if (icon === "11n") {
            $(".moon-thunderstorm").removeClass("hidden");
        } else if (icon === "13d") {
            $(".sun-snow").removeClass("hidden");
        } else if (icon === "13n") {
            $(".moon-snow").removeClass("hidden");
        } else if (icon === "50d") {
            $(".foggy").removeClass("hidden");
        } else if (icon === "50n") {
            $(".foggy-night").removeClass("hidden");
        } else if (weatherCode === 905 || 954 || 956) {
            $(".windy").removeClass("hidden");
        } else {
            $(".unknown").removeClass("hidden");
        }
    };

    const getWeather = function(la, lo, q) {
        const city = $city.text();
        $city.text(`${city} (Loading...)`);
        const weatherData = {
            appid: weatherApiKey,
            units: unit,
        };
        if (q) {
            weatherData.q = q;
        } else {
            weatherData.lat = la;
            weatherData.lon = lo;
        }
        $.getJSON(weatherApi, weatherData, printResults);
    };

    const changeUnit = function() {
        const $temp = $("#temp");
        const $unit = $("#unit");
        const currentTemp = parseFloat($temp.text());
        let newTemp = 0;
        // °C  x  9/5 + 32 = °F
        // (°F  -  32)  x  5/9 = °C
        if (unit === "imperial") {
            newTemp = ((currentTemp - 32) * 5) / 9;
            unit = "metric";
            $unit.text("°C");
        } else {
            newTemp = (currentTemp * 9) / 5 + 32;
            unit = "imperial";
            $unit.text("°F");
        }
        $temp.text(newTemp.toFixed(0));
    };

    $("#unit").click(changeUnit);
    $("#temp").click(changeUnit);
    getWeather(lat, lon, weather_city);
});
