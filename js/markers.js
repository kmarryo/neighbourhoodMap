var map, pins, infoWindow;

// Google Maps API function for initializing the map
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 48.369826, lng: 10.8969703},
        zoom: 15
    });
    infoWindow = new google.maps.InfoWindow();
    ko.applyBindings(myViewModel());

}


function myViewModel() {
    // Knockout observableArray with position and infos for the markers
    this.pins = ko.observableArray([
        new Pin('townHall', 48.368821, 10.8965303, 'Rathaus', '<div class="info-window"><h1 class="info-heading">Rathaus</h1><div class="info-content">Hallo, das ist mein InfoWindow</div></div>'),
        new Pin('sausalitos', 48.36697, 10.8978486, 'Sausalitos', '<div class="info-window"><h1 class="info-heading">Sausalitos</h1><div class="info-content">Hallo, das ist mein InfoWindow2</div></div>'),
        new Pin('kahnfahrt', 48.37551, 10.9041863, 'Augsburger Kahnfahrt', '<div class="info-window"><h1 class="info-heading">Kahnfahrt</h1><div class="info-content">Hallo, das ist mein InfoWindow3</div></div>')
    ]);

}


// Pin constructor

var Pin = function (name, lat, lng, title, content) {
    var self = this;
    this.name = name;
    this.lat = lat;
    this.lng = lng;
    this.title = title;
    this.content = content;
    this.marker = new google.maps.Marker({
        position: {lat: this.lat, lng: this.lng},
        map: map,
        title: this.title
    });
    // Sets Event listener for clicks when pins are clicked.
    this.marker.addListener('click', function(){
        self.PinIsClicked();
    });
    this.search = this.search();
};
// In this function everything is stored what happens after click on the markers or the list items
Pin.prototype.PinIsClicked = function () {
    var self = this;
    // Google Maps API setAnimation function for animating markers on click
    this.marker.setAnimation(google.maps.Animation.BOUNCE);

    // Stops bouncing of marker after 700 ms so that it bounces one time
    setTimeout(function () {
        self.marker.setAnimation(null);
    }, 700);

    // GMaps API infoWindow: opens infoWindow and fills it with content
    infoWindow.setContent(this.content);

    infoWindow.open(map, this.marker);

}

Pin.prototype.search = function () {
    var self = this;
    $( "#tags" ).autocomplete({
        source: this.title.toLowerCase()
    });
    console.log('this.title', this.title);
    
}



