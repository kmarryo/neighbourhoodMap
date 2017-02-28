// Constructor function for markers
var NewMarker = function (name, lat, lng, title) {
    this.name = name;
    this.lat = lat;
    this.lng = lng;
    this.title = title;
};

// Animates marker when it is clicked
NewMarker.prototype.toggleAnimation = function () {
        console.log('click');

        // if (this.getAnimation() !== null) {
        //     this.setAnimation(null);
        // } else {
        //     this.setAnimation(google.maps.Animation.BOUNCE);
        // }
}

// Knockout observableArray with position and infos for the markers
var markers = ko.observableArray([
    new NewMarker('townHall', 48.368821, 10.8965303, 'Rathaus'),
    new NewMarker('sausalitos', 48.36697, 10.8978486, 'Sausalitos'),
    new NewMarker('kahnfahrt', 48.37551, 10.9041863, 'Augsburger Kahnfahrt')
]);


console.log('markers().length', markers().length);



ko.applyBindings(markers);