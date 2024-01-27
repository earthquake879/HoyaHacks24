function initMap() {
    var location = { lat: 38.907852, lng: -77.072807 };
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 4,
        center: location
    });
    var marker = new google.maps.Marker({
        position: location,
        map: map,
        title: 'My location'
    });
}
