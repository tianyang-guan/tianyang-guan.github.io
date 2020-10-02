let map, infoWindow;

let pos;

let address = undefined;

let weather = undefined;

function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 15,
    });

    const geocoder = new google.maps.Geocoder();

    // Try HTML5 geolocation.
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };

                sendPos(pos, geocoder);

                let latLng = new google.maps.LatLng(pos.lat, pos.lng);
                let marker = new google.maps.Marker({
                    position: latLng,
                    map: map,
                    title: "Your location",
                    draggable: true,
                    animation: google.maps.Animation.DROP,
                });
                marker.addListener("click", toggleBounce);

                map.setCenter(pos);
            },
            () => {
                handleLocationError(true, infoWindow, map.getCenter());
            }
        );
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }
}

function GetTime(dt = undefined) {
    // let time_zone = (0 - new Date().getTimezoneOffset()) * 60;
    let date = dt ? new Date(dt * 1000) : new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();

    let result = `[${year}-${month}-${day}    ${hours} : ${minutes} : ${seconds}]`;

    return result;
}

function GetTemp(temp) {
    return Number((temp - 273).toFixed(2));
}

async function sendPos(pos, geocoder) {
    try {
        let position = await geocodeLatLng(pos, geocoder);

        if (!("fetch" in window)) {
            console.log("Fetch API not found, try including the polyfill");
            return;
        }
        let str = new Request(
            `https://aitopcoder.com:3001/weatherpos/${pos.lat}/${pos.lng}`,
            { method: "GET" }
        );

        let response = await fetch(str);
        weather = await response.json();
        let current = weather.current;
        current.dt = GetTime(current.dt);
        current.sunrise = GetTime(current.sunrise);
        current.sunset = GetTime(current.sunset);
        current.temp = GetTemp(current.temp);
        current.feels_like = GetTemp(current.feels_like);
        current.dew_point = GetTemp(current.dew_point);

        let map = document.getElementById("google-map");
        map.classList.add("map-display");

        address = position[0].formatted_address;

        // console.log(weather);
        // console.log(position);
    } catch (error) {
        console.log(error);
    }
}

function toggleBounce() {
    if (marker.getAnimation() !== null) {
        marker.setAnimation(null);
    } else {
        marker.setAnimation(google.maps.Animation.BOUNCE);
    }
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(
        browserHasGeolocation
            ? "Error: The Geolocation service failed."
            : "Error: Your browser doesn't support geolocation."
    );
    infoWindow.open(map);
}

function geocodeLatLng(pos, geocoder) {
    return new Promise((res, rej) => {
        // package a callback to promise
        geocoder.geocode({ location: pos }, (results, status) => {
            if (status === "OK") {
                res(results);
            } else {
                res({ error: "cannot find city" });
            }
        });
    });
}
(function ($) {
    "use strict";
    let addr_handle = setInterval(() => {
        if (address) {
            $(".addr").text(address);
            clearInterval(addr_handle);
        }
    }, 100);

    let weather_handle = setInterval(() => {
        if (weather) {
            $(".temp").text(weather.current.temp + "℃");
            $(".humi").text(weather.current.humidity + "RH");
            let array = weather.current.weather;
            for (let i = 0; i < array.length; i++) {
                let icon = array[i].icon;
                let status = array[i].main.toLowerCase();
                $("#weather-status").append(
                    `<div class="weather-status-element">
                        <img class="weather-img" src="https://openweathermap.org/img/wn/${icon}@2x.png"></img>
                        <span class="weather-text">${status}</span>
                    <div>`
                );
            }

            $("#temp-humi").toggleClass("temp-humi temp-humi-flex");
            $("#weather-status").toggleClass(
                "weather-status weather-status-flex"
            );

            clearInterval(weather_handle);
        }
    }, 100);
})(jQuery);
