'use strict';


var refresh_interval = 180;     //In minutes
var lon = 11.99;
var lat = 43.28;
var weather_city = "Cortona"    //

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
    console.log("Change in storage area: " + area);
    let changedItems = Object.keys(changes);
    changedItems.forEach( (key) => {
        console.log(key + " has changed:");
        console.log("Old value: ");
        console.log(changes[key].oldValue);
        console.log("New value: ");
        console.log(changes[key].newValue);
    });
}


function doStorageChange(changes, area) {
    let changedItems = Object.keys(changes);
    /* 
    changedItems.forEach( (key) =>  {
        if(key == "refresh_interval") {
            refresh_interval =  changes[key].newValue;
            console.log(new Date().toString() + ' Set alarm to ' + refresh_interval + ' minutes');
       }
    */
    logStorageChange(changes, area);
}


function restoreOptions() {
    chrome.storage.sync.get("refresh_interval", (obj) => {
        if(obj.hasOwnProperty("refresh_interval")) refresh_interval = obj.refresh_interval;
    });
    chrome.storage.sync.get("weather_city", (obj) => {
        if(obj.hasOwnProperty("weather_city")) weather_city = obj.weather_city;
    });
    chrome.storage.sync.get("lat", (obj) => {
        if(obj.hasOwnProperty("lat")) lat = obj.lat;
    });
    chrome.storage.sync.get("lon", (obj) => {
        if(obj.hasOwnProperty("lon")) lon = obj.lon;
    });

}


// When clicked extension icon
// chrome.browserAction.onClicked will not fire if the browser action has a popup
// https://developer.chrome.com/extensions/browserAction#event-onClicked
chrome.browserAction.onClicked.addListener( (activeTab) => {
    chrome.tabs.create({'url': "/html/options.html" } )
})

chrome.storage.onChanged.addListener(doStorageChange);

chrome.runtime.onMessage.addListener((message, sender) => {
    if (message.method === 'openLocalFile') {
        const localFileUrl = message.localFileUrl;
        const tab = sender.tab;
        openLocalFile(localFileUrl, tab);
    }
});


function start() {
    restoreOptions();
}


start();
