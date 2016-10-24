const DEBUG = true;
const MAP_CENTER = {lat: 40.526049, lng: -105.012088};
const MAP_ZOOM = 15;
const MARKER_DEFAULT = 'ff0000';
const MARKER_HIGHLIGHT = 'ffff24';

/*
// These are the restaurants that will be shown to the user.
*/
var restaurants = [
  {
    name: "Austin's",
    address: '2815 E Harmony Rd, Fort Collins, CO, 80528',
    location: {lat: 40.522608, lng: -105.025259},
    type: 'Sandwiches',
    locHint: 'Harmony and Corbett',
    info: "Info about Austin's"
  },
  {
    name: 'The Farmhouse',
    address: '1957 Jessup Dr, Fort Collins, CO, 80525',
    location: {lat: 40.561923, lng: -105.038034},
    type: 'Greek',
    locHint: 'Prospect and Timberline',
    info: "Info about the Farmhouse"
  },
  {
    name: "Fuzzy's Tacos",
    address: '2909 E Harmony Rd, Fort Collins, CO, 80525',
    location: {lat: 40.522639, lng: -105.023169},
    type: 'Tacos and tequila',
    locHint: 'Harmony and Ziegler',
    info: "Info about Fuzzy's Tacos"
  },
  {
    name: "William Oliver's Publick House",
    address: '2608 S Timberline Rd, Fort Collins, CO, 80525',
    location: {lat: 40.551825, lng: -105.037185},
    type: 'Whiskeys and pub food',
    locHint: 'Drake and Timberline',
    info: "Info about Wiliam Oliver's"
  },
  { name: "Taco Bell",
    address: '4645 Weitzel Street, Timnath, CO 80547',
    location: {lat: 40.520561, lng: -104.988248},
    type: 'Fast Mexican',
    locHint: 'Just north of Costco',
    info: "Info about Taco Bell"
  },
  {
    name: "Sonic",
    address: '3518 S Timberline Rd, Fort Collins, CO 80525',
    location: {lat: 40.538233, lng: -105.037735},
    type: 'Hot dogs and shakes',
    locHint: 'Horsetooth and Timberline',
    info: "Info about Sonic"
  }
];

var ViewModel = function() {
	var self = this;

	// Create an array to hold the list of restaurants that the user can choose from
	this.restaurantList = ko.observableArray( [] );

	// Populate the array with the data from the model (above)
	restaurants.forEach(function(restaurant) {
		self.restaurantList.push( new Restaurant(restaurant) );
	});

	// Set the initial current restaurant to the first one in the list
	this.currentRestaurant = ko.observable( this.restaurantList()[0] );

	// Set the current restaurant to the one just clicked
	this.setRestaurant = function(clickedRestaurant) {
		self.currentRestaurant(clickedRestaurant);
	};
}

// Create a new clickable restaurant for the list
var Restaurant = function(data) {
	this.name = ko.observable(data.name);
	this.address = ko.observable(data.address);
	this.location = ko.observable(data.location);
	this.type = ko.observable(data.type);
	this.locHint = ko.observable(data.locHint);
	this.info = ko.observable(data.info);
}

ko.applyBindings(new ViewModel());

var map;

var markers = [];

function initMap() {
	// Create a new map
	map = new google.maps.Map(document.getElementById('map'), {
	  center: MAP_CENTER,
	  zoom: MAP_ZOOM,
	  mapTypeControl: false
	});

	var myInfowindow = new google.maps.InfoWindow();

	// Create an array of markers for the restaurants
	for (var i = 0; i < restaurants.length; i++) {
	  // Get the position from the location attribute for each restaurant
	  var position = restaurants[i].location;
	  var title = restaurants[i].name;
	  var info = restaurants[i].info;
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
	  // Push this marker onto the array of markers
	  markers.push(marker);
	  // Create an onclick event to open the large infowindow at each marker
	  // Start the BOUNCE animation when the marker is clicked
	  google.maps.event.addListener(markers[i], 'click', function () {
	  	myInfowindow.setContent('<div>' + this.title + '</div>');
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
	for (var i = 0; i < markers.length; i++) {
	  bounds.extend(markers[i].position);
	  markers[i].visibility = true;
	}
	map.fitBounds(bounds);
}

// Loop through the restaurants and hide them all
function hideMarkers() {
	for (var i = 0; i < markers.length; i++) {
	  //markers[i].setMap(null);
	  markers[i].visibility = false;
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
