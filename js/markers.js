var map, pins;
var contentString = '<div id="content">'+
    '<div id="siteNotice">'+
    '</div>'+
    '<h1 id="firstHeading" class="firstHeading">Uluru</h1>'+
    '<div id="bodyContent">'+
    '<p><b>Uluru</b>, also referred to as <b>Ayers Rock</b>, is a large ' +
    'sandstone rock formation in the southern part of the '+
    'Northern Territory, central Australia. It lies 335&#160;km (208&#160;mi) '+
    'south west of the nearest large town, Alice Springs; 450&#160;km '+
    '(280&#160;mi) by road. Kata Tjuta and Uluru are the two major '+
    'features of the Uluru - Kata Tjuta National Park. Uluru is '+
    'sacred to the Pitjantjatjara and Yankunytjatjara, the '+
    'Aboriginal people of the area. It has many springs, waterholes, '+
    'rock caves and ancient paintings. Uluru is listed as a World '+
    'Heritage Site.</p>'+
    '<p>Attribution: Uluru, <a href="https://en.wikipedia.org/w/index.php?title=Uluru&oldid=297882194">'+
    'https://en.wikipedia.org/w/index.php?title=Uluru</a> '+
    '(last visited June 22, 2009).</p>'+
    '</div>'+
    '</div>';

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 48.369826, lng: 10.8969703},
        zoom: 15
    });

    ko.applyBindings(myViewModel());

}


console.log('pins', pins);




//##Functions
/**
 *
 */
function myViewModel() {
    // Knockout observableArray with position and infos for the markers
    var pins = ko.observableArray([
        new Pin('townHall', 48.368821, 10.8965303, 'Rathaus', '<div class="info-window"><h1 class="info-heading">InfoWindow 1</h1><div class="info-content">Hallo, das ist mein InfoWindow</div></div>'),
        new Pin('sausalitos', 48.36697, 10.8978486, 'Sausalitos', '<div class="info-window"><h1 class="info-heading">InfoWindow 2</h1><div class="info-content">Hallo, das ist mein InfoWindow2</div></div>'),
        new Pin('kahnfahrt', 48.37551, 10.9041863, 'Augsburger Kahnfahrt', '<div class="info-window"><h1 class="info-heading">InfoWindow 3</h1><div class="info-content">Hallo, das ist mein InfoWindow3</div></div>')
    ]);

    return {
        pins: pins
    };
}

//##Objects

/**
 * Pin Object
 */
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
    this.infowindow = new google.maps.InfoWindow({
        content: this.content
    });;
    // Sets Event listener for clicks when pins are clicked.
    this.marker.addListener('click', function(){
        self.PinIsClicked();
    });
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

    // GMaps API infowindow
    this.infowindow.close(map, this.marker);
    this.infowindow.open(map, this.marker);

}



