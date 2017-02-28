// Interesting places for the map with lat-long coordinates and title to show in the map as markers
// var markers = {
//     "townHall": {
//         name: 'Town hall',
//         lat: 48.368821,
//         lng: 10.8965303,
//         title: 'Rathaus'
//     },
//     "sausalitos":
//     {
//         name: 'Sausalitos',
//         lat: 48.36697,
//         lng: 10.8978486,
//         title: 'Sausalitos'
//     },
//     "kahnfahrt":
//     {
//         name: 'kahnfahrt',
//         lat: 48.37551,
//         lng: 10.9041863,
//         title: 'Augsburger Kahnfahrt'
//     }
// };



var NewMarker = function (name, lat, lng, title) {
    this.name = name;
    this.lat = lat;
    this.lng = lng;
    this.title = title;
};


var markers = ko.observableArray([
    new NewMarker('townHall', 48.368821, 10.8965303, 'Rathaus'),
    new NewMarker('sausalitos', 48.36697, 10.8978486, 'Sausalitos'),
    new NewMarker('kahnfahrt', 48.37551, 10.9041863, 'Augsburger Kahnfahrt')
]);


console.log('markers().length', markers().length);

for (var i = 0; i < markers().length; i++) {
    new google.maps.Marker({
        position: {lat: markers()[i].lat, lng: markers()[i].lng},
        map: map,
        title: markers()[i].title
    });
}

