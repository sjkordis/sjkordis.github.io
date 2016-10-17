const DEBUG = true;

var restaurants = [
  {
    name: "Austin's",
    address: '2815 E Harmony Rd, Fort Collins, CO, 80528',
    location: {lat: 40.522608, lng: -105.025259},
    type: 'Sandwiches'
  },
  {
    name: 'The Farmhouse',
    address: '1957 Jessup Dr, Fort Collins, CO, 80525',
    location: {lat: 40.561923, lng: -105.038034},
    type: 'Greek'
  },
  {
    name: "Fuzzy's Tacos",
    address: '2909 E Harmony Rd, Fort Collins, CO, 80525',
    location: {lat: 40.522639, lng: -105.023169},
    type: 'Tacos and Tequila'
  },
  {
    name: "J Gumbo's",
    address: '2842 Council Tree Ave #131, Fort Collins, CO, 80525',
    location: {lat: 40.526121, lng: -105.024282},
    type: 'Cajun'
  },
  { name: "Taco Bell",
    address: '4645 Weitzel Street, Timnath, CO 80547',
    location: {lat: 40.520561, lng: -104.988248},
    type: 'Fast Mexican'
  },
  {
    name: "Sonic",
    address: '3518 S Timberline Rd, Fort Collins, CO 80525',
    location: {lat: 40.538233, lng: -105.037735},
    type: 'Hot Dogs and Shakes'
  }
];

var ViewModel = function() {
	var self = this;

	this.restaurantList = ko.observableArray( [] );

	restaurants.forEach(function(restaurant) {
		self.restaurantList.push( new Restaurant(restaurant) );
	});

	this.currentRestaurant = ko.observable( this.restaurantList()[0] );

	this.setRestaurant = function(clickedRestaurant) {
		self.currentRestaurant(clickedRestaurant);
	};
}

var Restaurant = function(data) {
	this.name = ko.observable(data.name);
    this.nickName = ko.observableArray(data.nickName);
}

ko.applyBindings(new ViewModel());
