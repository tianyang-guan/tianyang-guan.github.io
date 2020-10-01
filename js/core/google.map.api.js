// Create the script tag, set the appropriate attributes
var script = document.createElement("script");
script.src =
    "https://maps.googleapis.com/maps/api/js?key=AIzaSyCuzyKpQZ3qqrx6qsyDsZnQyhLj75MQyBI&callback=initMap";
script.defer = true;

// Attach your callback function to the `window` object
window.initMap = function () {
    // JS API is loaded and available
};

// Append the 'script' element to 'head'
document.head.appendChild(script);
