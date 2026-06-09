const socket = io();

const map = L.map("map").setView([0, 0], 19);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'OpenStreetMap'
}).addTo(map);

if(navigator.geolocation){
    navigator.geolocation.watchPosition((position)=>{
        const {latitude, longitude} = position.coords;
        socket.emit('send-location', {latitude, longitude});
    }, (error)=>{
        console.error('Error getting location:', error);
    },
    {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 2000,
    });
}
const marker = L.marker([0, 0]).addTo(map);
socket.on('receive-location', function (data) {
    const {id, latitude, longitude} = data;
    marker.setLatLng([latitude, longitude]);
    map.setView([latitude, longitude]);
    if(marker[id])
    {
        marker[id].setLatLng([latitude, longitude]);
    }
    else    {
        marker[id] = L.marker([latitude, longitude]).addTo(map);
    }
});

socket.on('user-disconnected', function (id) {  
    if(marker[id])    {
        map.removeLayer(marker[id]);
        delete marker[id];
    }   
});