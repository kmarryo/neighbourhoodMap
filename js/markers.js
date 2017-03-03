var map, pins;

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 48.369826, lng: 10.8969703},
        zoom: 15
    });
    // Constructor function for markers
    var Pin = function (name, lat, lng, title) {
        var self = this;
        this.name = name;
        this.lat = lat;
        this.lng = lng;
        this.title = title;
        this.marker = new google.maps.Marker({
            position: {lat: self.lat, lng: self.lng},
            map: map,
            title: self.title
        });
        // Sets Event listener for clicks when pins are clicked.
        this.marker.addListener('click', this.toggleAnimation);
    };

    // Animates marker when it is clicked
    Pin.prototype.toggleAnimation = function () {
        var self = this;
        self.setAnimation(google.maps.Animation.BOUNCE);

        setTimeout(function () {
            self.setAnimation(null);
        }, 700);
    }
    // Knockout observableArray with position and infos for the markers
    pins = ko.observableArray([
        new Pin('townHall', 48.368821, 10.8965303, 'Rathaus'),
        new Pin('sausalitos', 48.36697, 10.8978486, 'Sausalitos'),
        new Pin('kahnfahrt', 48.37551, 10.9041863, 'Augsburger Kahnfahrt')
    ]);


    console.log('pins', pins);
    ko.applyBindings(pins);

}








