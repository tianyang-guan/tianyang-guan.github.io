let map, infoWindow;

let pos;

function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 15,
    });

    // Try HTML5 geolocation.
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };

                sendPos(pos);

                // let response = await fetch(`https://websvf.top:3000/position/${pos.lat}/${pos.lng}`);
                // let result = response.json();
                // console.log(pos);

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

async function sendPos(pos) {
    let response = await fetch(
        `http://websvf.top:3000/position/${pos.lat}/${pos.lng}`
    );
    // let result = response.json();
    // console.log(pos);
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

const intersect = function (a, b) {
    return new Set(a.filter((v) => ~b.indexOf(v)));
};

const gettowncity = function (addcomp) {
    if (typeof addcomp == "object" && addcomp instanceof Array) {
        let order = [
            "sublocality_level_1",
            "neighborhood",
            "locality",
            "postal_town",
        ];

        for (let i = 0; i < addcomp.length; i++) {
            let obj = addcomp[i];
            let types = obj.types;
            if (intersect(order, types).size > 0) return obj;
        }
    }
    return false;
};
