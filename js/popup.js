// options.js

const background = chrome.extension.getBackgroundPage();

document.addEventListener("DOMContentLoaded", () => {
    // units (F/C), city or lon/lat, forecast refresh freq, background image link
    const weatherCity = document.getElementById("weatherCity");
    const weatherCityForm = document.getElementById("weatherCityForm");
    weatherCity.value = background.weather_city;
    /*
    let latCity = document.getElementById("latCity");
    let lonCity = document.getElementById("lonCity");
    latCity.value = background.lat;
    lonCity.value = background.lon;
    // add listeners for options change
    refreshInterval.addEventListener("input", () => {
        chrome.storage.sync.set({ "refresh_interval": refreshInterval.value } );
    });
    */
    weatherCityForm.addEventListener(
        "submit",
        () => {
            console.log(`Form submitted ${weatherCity.value}`);
            /* 
        background.lat = latCity.value;
        background.lon = lonCity.value;
        chrome.storage.sync.set({ "lat": latCity.value } );
        chrome.storage.sync.set({ "lon": lonCity.value } );
        */
            chrome.storage.sync.set({ weather_city: weatherCity.value });
            background.weather_city = weatherCity.value;
        },
        false,
    );
});
