'use strict';

//////// GLOBAL Variables
var map, pins, infoWindow, myViewModel;

// Special stylings for map
var pinStyles = [{
    "featureType": "all",
    "elementType": "geometry.fill",
    "stylers": [{"weight": "2.00"}]
}, {"featureType": "all", "elementType": "geometry.stroke", "stylers": [{"color": "#9c9c9c"}]}, {
    "featureType": "all",
    "elementType": "labels.text",
    "stylers": [{"visibility": "on"}]
}, {"featureType": "landscape", "elementType": "all", "stylers": [{"color": "#f2f2f2"}]}, {
    "featureType": "landscape",
    "elementType": "geometry.fill",
    "stylers": [{"color": "#ffffff"}]
}, {
    "featureType": "landscape.man_made",
    "elementType": "geometry.fill",
    "stylers": [{"color": "#ffffff"}]
}, {"featureType": "poi", "elementType": "all", "stylers": [{"visibility": "off"}]}, {
    "featureType": "road",
    "elementType": "all",
    "stylers": [{"saturation": -100}, {"lightness": 45}]
}, {"featureType": "road", "elementType": "geometry.fill", "stylers": [{"color": "#eeeeee"}]}, {
    "featureType": "road",
    "elementType": "labels.text.fill",
    "stylers": [{"color": "#7b7b7b"}]
}, {
    "featureType": "road",
    "elementType": "labels.text.stroke",
    "stylers": [{"color": "#ffffff"}]
}, {
    "featureType": "road.highway",
    "elementType": "all",
    "stylers": [{"visibility": "simplified"}]
}, {
    "featureType": "road.arterial",
    "elementType": "labels.icon",
    "stylers": [{"visibility": "off"}]
}, {"featureType": "transit", "elementType": "all", "stylers": [{"visibility": "off"}]}, {
    "featureType": "water",
    "elementType": "all",
    "stylers": [{"color": "#46bcec"}, {"visibility": "on"}]
}, {"featureType": "water", "elementType": "geometry.fill", "stylers": [{"color": "#c8d7d4"}]}, {
    "featureType": "water",
    "elementType": "labels.text.fill",
    "stylers": [{"color": "#070707"}]
}, {"featureType": "water", "elementType": "labels.text.stroke", "stylers": [{"color": "#ffffff"}]}];

// Function with error message. Gets called in index.html as onerror on Google Maps script-Tag
function mapsError() {
    $('body').text('Sorry, but the map you are looking for could not be loaded. Please try again later.')
}


//////// Google Maps API function for initializing the map
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 48.369826, lng: 10.8969703},
        zoom: 13,
        styles: pinStyles
    });
    // Create new empty infoWindow. Gets populated with content under Pin.prototype.loadWikiArticles
    infoWindow = new google.maps.InfoWindow();

    // Gets map responsive so it centers when the window is resized
    var centerMap = map.getCenter();
    google.maps.event.addDomListener(window, 'resize', function () {
        map.setCenter(centerMap);
    });

/////// Pin constructor (Creates Markers)

    var Pin = function (name, lat, lng) {
        var self = this;
        this.name = ko.observable(name);
        this.lat = lat;
        this.lng = lng;
        // Creates the pins (markers)
        this.marker = new google.maps.Marker({
            position: {lat: this.lat, lng: this.lng},
            map: map,
            title: this.name()
        });
        // Sets Event listener for clicks when pins are clicked.
        this.marker.addListener('click', function () {
            self.PinIsClicked();
        });
    };


// In this function everything is stored what happens after click on the markers or the list items
    Pin.prototype.PinIsClicked = function () {
        var self = this;
        // Google Maps API setAnimation function for animating markers on click
        this.marker.setAnimation(google.maps.Animation.BOUNCE);
        map.panTo(this.marker.getPosition());

        // Stops bouncing of marker after 700 ms so that it bounces one time
        setTimeout(function () {
            self.marker.setAnimation(null);
        }, 700);


        // GMaps API infoWindow: opens infoWindow and fills it with content
        this.loadWikiArticles();
        infoWindow.open(map, this.marker);

    }

////////// Knockout JS ViewModel
    myViewModel = {
        // Create markers (pins) via Pin constructor
        // General structure: new Pin(name, lat, lng)
        pins: ko.observableArray([
            new Pin('Rathaus Augsburg', 48.368821, 10.8965303),
            new Pin('Augsburger Kahnfahrt', 48.37551, 10.9041863),
            new Pin('WWK-Arena (FC Augsburg)', 48.323186, 10.8832343),
            new Pin('Hoher Dom zu Augsburg', 48.372679, 10.8948273),
            new Pin('Gymnasium bei St. Stephan Augsburg', 48.376266, 10.8970563),
            new Pin('Augsburger Puppenkiste', 48.359926, 10.9033483),
            new Pin('Zoo Augsburg', 48.346959, 10.9174663),
            new Pin('Messe Augsburg', 48.338652, 10.8930013),
            new Pin('Parktheater im Kurhaus Göggingen', 48.34172, 10.8687353),
            new Pin('Flughafen Augsburg', 48.424266, 10.9306523)
        ]),
        filter: ko.observable(''),
        search: ko.observable('')
    };

    myViewModel.filteredItems = ko.computed(function () {
        var filter = this.filter().toLowerCase();

        return ko.utils.arrayFilter(this.pins(), function (pin) {
                var visible = pin.name().toLowerCase().indexOf(filter) !== -1;
                // Sets visibility of pins depending on search term
                pin.marker.setVisible(visible);
                // Returns list items that match with search term
                return visible;
            });
    }, myViewModel);




    //// Wikipedia API: Populates infoWindow of pins
    Pin.prototype.loadWikiArticles = function () {
        var self = this;
        var infoWindowContent = '<h2>' + self.name() + '</h2>';

        // Wikipedia API
        // To change between normal search for terms and geosearch change list to "geosearch" and uncomment the lines gscoord and gsradius
        $.ajax({
            url: 'https://de.wikipedia.org/w/api.php?action=opensearch',
            dataType: 'jsonp',
            data: {
                action: 'query',
                list: 'search',
                jsonp: 'callback',
                srsearch: self.name,
                //gscoord: self.lat + '|' + self.lng,
                //gsradius: 250,
                format: 'json'
            },
            success: function (data) {

                var wikiResults = data.query.search;
                // Loop through wikipedia results and create paragraphs with the wiki articles inside infoWindow
                // For better usability I reduced the number of articles to 3. To show more, it can be of course replaced by wikiResults.length
                for (var i = 0; i < 3; i++) {
                    var wikiArticle = wikiResults[i];
                    var url = 'http://de.wikipedia.org/wiki/' + wikiArticle.title;
                    infoWindowContent += '<p>' + '<a href="' + url + '">' + wikiArticle.title + '</a></p>';
                }
                infoWindow.setContent(infoWindowContent);
            },
            error: function (data) {
                infoWindowContent = '<p>Ooops, no data could be found.</p>';
                infoWindow.setContent(infoWindowContent);

            }
        })
        return false;
    };


// Execute Knockout JS and apply the bindings
    ko.applyBindings(myViewModel);

}