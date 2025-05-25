const socket = io();


if (navigator.geolocation) {
    navigator.geolocation.watchPosition((position) => {
        const lat = position.coords.latitude;
        const long = position.coords.longitude;

        socket.emit("send-location", {
            latitude: lat,
            longitude: long
        });
    }, (error) =>{
        console.error("Error getting location:", error);
    }, {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 5000
    }
    
    )
}


const map = L.map("map").setView([0, 0], 2);  // Determine the center of the earth and 10 level zoom

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

const markers = {

}


socket.on("receive-location", (data) => {
    const { latitude, longitude, id } = data;
    map.setView([latitude, longitude], 60); // Set the view to the new location with zoom level 10

    if(markers[id]) {
        markers[id].marker.setLatLng([latitude, longitude]);
    } else {
        const marker = L.marker([latitude, longitude]).addTo(map);
        markers[id] = {
            marker: marker,
            id: id
        };
    }
})

socket.on("user-disconnected", (id) => {
    if (markers[id]) {
        map.removeLayer(markers[id].marker);
        delete markers[id];
    }
});