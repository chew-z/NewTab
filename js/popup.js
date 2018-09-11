// options.js

const background = chrome.extension.getBackgroundPage();

document.addEventListener("DOMContentLoaded", () => {
    // units (F/C), city or lon/lat, forecast refresh freq, background image link
    const weatherCity = document.getElementById("weatherCity");
    const weatherCityForm = document.getElementById("weatherCityForm");
    weatherCity.value = background.weather_city;
    weatherCityForm.addEventListener(
        "submit",
        () => {
            console.log(`Form submitted ${weatherCity.value}`);
            chrome.storage.sync.set({ weather_city: weatherCity.value });
            background.weather_city = weatherCity.value;
        },
        false,
    );
});
