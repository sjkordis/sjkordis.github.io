const DEBUG = true;
const MAP_CENTER = {lat: 40.526049, lng: -105.012088};
const MAP_ZOOM = 15;

//
//	Model
//
var restaurantList = ko.observableArray([
  {
    name: "Austin's",
    address: '2815 E Harmony Rd, Fort Collins, CO, 80528',
    location: {lat: 40.522608, lng: -105.025259},
    type: 'Civilized comfort food',
    locHint: 'Harmony and Corbett',
    info: "Info about Austin's",
    marker: null,
    foursquareId: '4b6ca93cf964a520344a2ce3',
    foursquareRating: 'rating',
    foursquareLink: 'link to foursquare venue page'
  },
  {
    name: 'The Farmhouse',
    address: '1957 Jessup Dr, Fort Collins, CO, 80525',
    location: {lat: 40.561923, lng: -105.038034},
    type: 'Locally sourced artisan cuisine',
    locHint: 'Prospect and Timberline',
    info: "Info about the Farmhouse",
    marker: null,
    foursquareId: '4b6ca93cf964a520344a2ce3',
    foursquareRating: 'rating',
    foursquareLink: 'link to foursquare venue page'
  },
  {
    name: "Fuzzy's Tacos",
    address: '2909 E Harmony Rd, Fort Collins, CO, 80525',
    location: {lat: 40.522639, lng: -105.023169},
    type: 'Tacos and tequila',
    locHint: 'Harmony and Ziegler',
    info: "Info about Fuzzy's Tacos",
    marker: null,
    foursquareId: '4b6ca93cf964a520344a2ce3',
    foursquareRating: 'rating',
    foursquareLink: 'link to foursquare venue page'
  },
  {
    name: "William Oliver's Publick House",
    address: '2608 S Timberline Rd, Fort Collins, CO, 80525',
    location: {lat: 40.551825, lng: -105.037185},
    type: 'Whiskeys and pub food',
    locHint: 'Drake and Timberline',
    info: "Info about Wiliam Oliver's",
    marker: null,
    foursquareId: '4b6ca93cf964a520344a2ce3',
    foursquareRating: 'rating',
    foursquareLink: 'link to foursquare venue page'
  },
  { name: "Taco Bell",
    address: '4645 Weitzel Street, Timnath, CO 80547',
    location: {lat: 40.520561, lng: -104.988248},
    type: 'Fast Mexican',
    locHint: 'Just north of Costco',
    info: "Info about Taco Bell",
    marker: null,
    foursquareId: '4b6ca93cf964a520344a2ce3',
    foursquareRating: 'rating',
    foursquareLink: 'link to foursquare venue page'
  },
  {
    name: "Sonic",
    address: '3518 S Timberline Rd, Fort Collins, CO 80525',
    location: {lat: 40.538233, lng: -105.037735},
    type: 'Hot dogs and shakes',
    locHint: 'Horsetooth and Timberline',
    info: "Info about Sonic",
    marker: null,
    foursquareId: '4b6ca93cf964a520344a2ce3',
    foursquareRating: 'rating',
    foursquareLink: 'link to foursquare venue page'
  }
]);

//
//	View Model
//
var ViewModel = function() {
	var self = this;
	var aMarker = null;

	// Set the initial current restaurant to the first one in the list
	this.currentRestaurant = ko.observable( restaurantList()[0] );

	// Set the current restaurant to the one just clicked
	this.setRestaurant = function(clickedRestaurant) {
		self.currentRestaurant(clickedRestaurant);
		google.maps.event.trigger(self.currentRestaurant().marker,'click');
	};
}

// Create a new clickable restaurant for the list
var Restaurant = function(data) {
	this.name = ko.observable(data.name);
}

ko.applyBindings(new ViewModel());

//
//	Google Map
//

var map;

var myInfowindow = null;

//var markers = [];

function initMap() {
	// Create a new map
	map = new google.maps.Map(document.getElementById('map'), {
	  center: MAP_CENTER,
	  zoom: MAP_ZOOM,
	  mapTypeControl: false
	});

	myInfowindow = new google.maps.InfoWindow();

	// Create an array of markers for the restaurants
	for (var i = 0; i < restaurantList().length; i++) {
	  // Get the position from the location attribute for each restaurant
	  var position = restaurantList()[i].location;
	  var title = restaurantList()[i].name;
	  var info = createHTML(restaurantList()[i]);
	  // Create one marker per restaurant
	  var marker = new google.maps.Marker({
	    position: position,
	    title: title,
	    draggable: false,
	    map: map,
	    animation: google.maps.Animation.DROP,
	    info: info,
	    id: i
	  });
	  // Store the marker in the model
	  restaurantList()[i].marker = marker;
	  // Push this marker onto the array of markers
	  //markers.push(marker);
	  // Create an onclick event to open the large infowindow at each marker
	  // Start the BOUNCE animation when the marker is clicked
	  //google.maps.event.addListener(markers[i], 'click', function () {
	  google.maps.event.addListener(restaurantList()[i].marker, 'click', function () {
	  	myInfowindow.setContent(this.info);
	  	myInfowindow.open(this.map, this);
	  	toggleBounce(this);
	  });
	}
	showMarkers();
}

// Toggle the animation
function toggleBounce (marker) {
	//printMarker('In toggleBounce', marker);
    if (marker.getAnimation() != null) {
        marker.setAnimation(null);
    } else {
        marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function(){marker.setAnimation(null);}, 650);
    }
    //showMarkers();
};

// Loop through the markers array and display them all
function showMarkers() {
	var bounds = new google.maps.LatLngBounds();
	// Extend the boundaries of the map for each marker and display the marker
	for (var i = 0; i < restaurantList().length; i++) {
	  bounds.extend(restaurantList()[i].marker.position);
	  restaurantList()[i].marker.visibility = true;
	}
	map.fitBounds(bounds);
}

// Loop through the restaurants and hide them all
function hideMarkers() {
	for (var i = 0; i < restaurantList().length; i++) {
	  //restaurantList()[i].marker.setMap(null);
	  restaurantList()[i].marker.visibility = false;
	}
}

// Show only the specified marker
function showOneMarker(marker) {
	//marker.setMap(map);
	marker.visibility = true;
}

function printMarker (msg, marker) {
	console.log(msg);
	if (marker != null && marker != undefined) {
		console.log('marker.title is ' + marker.title);
		console.log('marker.position is ' + marker.position);
		console.log('marker.draggable is ' + marker.draggable);
		console.log('marker.map is ' + marker.map);
		console.log('marker.animation is ' + marker.getAnimation());
		console.log('marker.id is ' + marker.id);
		console.log('marker visibility is ' + marker.visibility);
	} else {
		console.log('marker is ' + marker);
	}
}

function createHTML(item) {
	var html = '<div>' +
	'<p><strong>' + item.name + '</strong></p>' +
	'<p><i>' + item.type + '</i></p>' +
	'<p>' + item.address + '</p>' +
	'<p>' + item.foursquareRating + '</p>' +
	'<p>' + item.foursquareLink + '</p>' +
	'</div>';
	return html;
}
