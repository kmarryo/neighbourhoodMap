// Interesting places for the map with lat-long coordinates and title to show in the map as markers
var markers = ko.observableArray([
    {
        name: 'Town hall',
        lat: 48.368821,
        lng: 10.8965303,
        title: 'Rathaus'
    },
    {
        name: 'Sausalitos',
        lat: 48.36697,
        lng: 10.8978486,
        title: 'Sausalitos'
    },
    {
        name: 'kahnfahrt',
        lat: 48.37551,
        lng: 10.9041863,
        title: 'Augsburger Kahnfahrt'
    }
]);


console.log('markers().length', markers().length);

for(var i = 0; i < markers().length; i++) {
    new google.maps.Marker({
       position: {lat: markers()[i].lat, lng: markers()[i].lng},
       map: map,
       title: markers()[i].title
    });
}

console.log('markers()[0]', markers()[0]);

