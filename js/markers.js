// GLOBAL Variables
var map, pins, infoWindow, myViewModel;
var pinStyles = [{"featureType":"all","elementType":"geometry.fill","stylers":[{"weight":"2.00"}]},{"featureType":"all","elementType":"geometry.stroke","stylers":[{"color":"#9c9c9c"}]},{"featureType":"all","elementType":"labels.text","stylers":[{"visibility":"on"}]},{"featureType":"landscape","elementType":"all","stylers":[{"color":"#f2f2f2"}]},{"featureType":"landscape","elementType":"geometry.fill","stylers":[{"color":"#ffffff"}]},{"featureType":"landscape.man_made","elementType":"geometry.fill","stylers":[{"color":"#ffffff"}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"all","stylers":[{"saturation":-100},{"lightness":45}]},{"featureType":"road","elementType":"geometry.fill","stylers":[{"color":"#eeeeee"}]},{"featureType":"road","elementType":"labels.text.fill","stylers":[{"color":"#7b7b7b"}]},{"featureType":"road","elementType":"labels.text.stroke","stylers":[{"color":"#ffffff"}]},{"featureType":"road.highway","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"road.arterial","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#46bcec"},{"visibility":"on"}]},{"featureType":"water","elementType":"geometry.fill","stylers":[{"color":"#c8d7d4"}]},{"featureType":"water","elementType":"labels.text.fill","stylers":[{"color":"#070707"}]},{"featureType":"water","elementType":"labels.text.stroke","stylers":[{"color":"#ffffff"}]}];

// Function with error message. Gets called in index.html as onerror on Google Maps script-Tag
function mapsError() {
    $('body').text('Sorry, but the map you are looking for could not be loaded. Please try again later.')
}


// Google Maps API function for initializing the map
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 48.369826, lng: 10.8969703},
        zoom: 15,
        styles: pinStyles
    });
    infoWindow = new google.maps.InfoWindow();

// Pin constructor

    var Pin = function (name, lat, lng, title, content) {
        var self = this;
        this.name = ko.observable(name);
        this.lat = lat;
        this.lng = lng;
        this.title = title;
        this.content = content;
        // Creates the pins (markers)
        this.marker = new google.maps.Marker({
            position: {lat: this.lat, lng: this.lng},
            map: map,
            title: this.title
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

        // Stops bouncing of marker after 700 ms so that it bounces one time
        setTimeout(function () {
            self.marker.setAnimation(null);
        }, 700);

        //infoWindow.setContent(this.content + this.loadWikiArticles());

        // GMaps API infoWindow: opens infoWindow and fills it with content
        //infoWindow.setContent(this.content);
        this.loadWikiArticles();
        infoWindow.open(map, this.marker);

    }


// Knockout JS ViewModel
    myViewModel = {
        // Create markers (pins) via Pin constructor
        // General structure: new Pin(name, lat, lng, title, content)
        pins: ko.observableArray([
            new Pin('townHall', 48.368821, 10.8965303, 'Rathaus', '<div class="info-window"><h1 class="info-heading">Rathaus</h1><div class="info-content">Hallo, das ist mein InfoWindow</div></div>'),
            new Pin('sausalitos', 48.36697, 10.8978486, 'Sausalitos', '<div class="info-window"><h1 class="info-heading">Sausalitos</h1><div class="info-content">Hallo, das ist mein InfoWindow2</div></div>'),
            new Pin('kahnfahrt', 48.37551, 10.9041863, 'Augsburger Kahnfahrt', '<div class="info-window"><h1 class="info-heading">Kahnfahrt</h1><div class="info-content">Hallo, das ist mein InfoWindow3</div></div>')]),
        filter: ko.observable(""),
        search: ko.observable("")
    };

// Enhance myViewModel for filtering the input search
    myViewModel.filteredItems = ko.dependentObservable(function () {
        // Helper function stringStartsWith replaces the deprecated ko.utils.stringStartsWith
        var stringStartsWith = function (string, startsWith) {
            string = string || "";
            if (startsWith.length > string.length)
                return false;
            return string.substring(0, startsWith.length) === startsWith;
        };

        // Creating filter, set all letters to lowercase for usability
        var pinFilter = this.filter().toLowerCase();
        if (pinFilter === false) {
            return this.pins();
        } else {
            return ko.utils.arrayFilter(this.pins(), function (pin) {
                return stringStartsWith(pin.name().toLowerCase(), pinFilter);
            });
        }
    }, myViewModel);



    //// API Copy from previous project on gitlab
    Pin.prototype.loadWikiArticles = function () {
        var self = this;

        var $wikiElem = $('#wikipedia-links');
        // clear out old data before new request
        $wikiElem.text("");
        // Wikipedia API
        $.ajax({
            url: "https://de.wikipedia.org/w/api.php?action=opensearch",
            dataType: "jsonp",
            data: {
                action: "query",
                list: "geosearch",
                jsonp: "callback",
                gscoord: self.lat + '|' + self.lng,
                gsradius: 250,
                format: "json"
            },
            success: function (data) {
                console.log('The request was successfully loaded');

                var wikiResults = data.query.geosearch;
                var infoWindowContent = '<h2>' + self.name() + '</h2>';
                for (var i = 0; i < 3; i++) {
                    var wikiArticle = wikiResults[i];
                    var url = "http://de.wikipedia.org/wiki/" + wikiArticle.title;
                    infoWindowContent += '<p>' + '<a href="' + url + '">' + wikiArticle.title + '</a></p>';
                }
                infoWindow.setContent(infoWindowContent);
            }
        }).fail(function () {
            $('body').text('Ooops, no data could be loaded. Please try again later.');
        });
        return false;
    };
    

// Execute Knockout JS and apply the bindings
    ko.applyBindings(myViewModel);

}

/////////
/////////
/////////

