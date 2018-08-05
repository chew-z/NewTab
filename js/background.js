let lon = 11.99;
let lat = 43.28;
let weather_city = "Cortona"; //

const openLocalFile = (localFileUrl, baseTab) => {
    chrome.tabs.create({
        url: localFileUrl,
        index: baseTab.index + 1,
    });
};

/*
Logs that storage area has changed,
then for each item changed,
log its old value and its new value.
*/
function logStorageChange(changes, area) {
    console.log(`Change in storage area: ${area}`);
    const changedItems = Object.keys(changes);
    changedItems.forEach((key) => {
        console.log(`${key} has changed:`);
        console.log("Old value: ");
        console.log(changes[key].oldValue);
        console.log("New value: ");
        console.log(changes[key].newValue);
    });
}

function doStorageChange(changes, area) {
    logStorageChange(changes, area);
}

function restoreOptions() {
    chrome.storage.sync.get("weather_city", (obj) => {
        if (obj.hasOwnProperty("weather_city")) {
            weather_city = obj.weather_city;
        }
    });
    chrome.storage.sync.get("lat", (obj) => {
        if (obj.hasOwnProperty("lat")) {
            lat = obj.lat;
        }
    });
    chrome.storage.sync.get("lon", (obj) => {
        if (obj.hasOwnProperty("lon")) {
            lon = obj.lon;
        }
    });
}

// When clicked extension icon
// chrome.browserAction.onClicked will not fire if the browser action has a popup
// https://developer.chrome.com/extensions/browserAction#event-onClicked
// chrome.browserAction.onClicked.addListener( (activeTab) => {
//     chrome.tabs.create({'url': "/html/options.html" } )
// })

chrome.runtime.onUpdateAvailable.addListener((details) => {
    chrome.storage.sync.set({ lat: lat, lon: lon, weather_city: weather_city }, () => {
        if (chrome.runtime.lastError) {
            console.log(chrome.runtime.lastError);
            chrome.runtime.reload();
        } else {
            console.log(`${new Date().toString()} variables saved `);
            chrome.runtime.reload();
        }
    });
});

chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason == "install") {
        console.log("This is first install!");
    } else if (details.reason == "update") {
        const thisVersion = chrome.runtime.getManifest().version;
        restoreOptions();
        console.log(`Updated from ${details.previousVersion} to ${thisVersion}!`);
    }
});

chrome.storage.onChanged.addListener(doStorageChange);

chrome.runtime.onMessage.addListener((message, sender) => {
    if (message.method === "openLocalFile") {
        const localFileUrl = message.localFileUrl;
        const tab = sender.tab;
        openLocalFile(localFileUrl, tab);
    }
});

function start() {
    restoreOptions();
}

start();
