      var map;

      // Create a new blank array for all the listing markers.
      var markers = [];

      // This global polygon variable is to ensure only ONE polygon is rendered.
      var polygon = null;

      // Create placemarkers array to use in multiple functions to have control
      // over the number of places that show.
      var placeMarkers = [];

      function initMap() {
        // Constructor creates a new map - only center and zoom are required.
        map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: 40.526049, lng: -105.012088},
          zoom: 15,
          mapTypeControl: false
        });

        /*
        // These are the real estate listings that will be shown to the user.
        // Normally we'd have these in a database instead.
        var locations = [
          {title: 'Park Ave Penthouse', location: {lat: 40.7713024, lng: -73.9632393}},
          {title: 'Chelsea Loft', location: {lat: 40.7444883, lng: -73.9949465}},
          {title: 'Union Square Open Floor Plan', location: {lat: 40.7347062, lng: -73.9895759}},
          {title: 'East Village Hip Studio', location: {lat: 40.7281777, lng: -73.984377}},
          {title: 'TriBeCa Artsy Bachelor Pad', location: {lat: 40.7195264, lng: -74.0089934}},
          {title: 'Chinatown Homey Space', location: {lat: 40.7180628, lng: -73.9961237}}
        ];
        */
        var locations = [
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

        var largeInfowindow = new google.maps.InfoWindow();

        // Style the markers a bit. This will be our listing marker icon.
        var defaultIcon = makeMarkerIcon('ff0000');

        // Create a "highlighted location" marker color for when the user
        // mouses over the marker.
        var highlightedIcon = makeMarkerIcon('FFFF24');

        // The following group uses the location array to create an array of markers on initialize.
        for (var i = 0; i < locations.length; i++) {
          // Get the position from the location array.
          var position = locations[i].location;
          var title = locations[i].name;
          // Create a marker per location, and put into markers array.
          var marker = new google.maps.Marker({
            position: position,
            title: title,
            animation: google.maps.Animation.DROP,
            icon: defaultIcon,
            id: i
          });
          // Push the marker to our array of markers.
          markers.push(marker);
          // Create an onclick event to open the large infowindow at each marker.
          marker.addListener('click', function() {
            populateInfoWindow(this, largeInfowindow);
          });
          // Two event listeners - one for mouseover, one for mouseout,
          // to change the colors back and forth.
          marker.addListener('mouseover', function() {
            this.setIcon(highlightedIcon);
          });
          marker.addListener('mouseout', function() {
            this.setIcon(defaultIcon);
          });
        }
        document.getElementById('show-restaurants').addEventListener('click', showListings);

        document.getElementById('hide-restaurants').addEventListener('click', function() {
          hideMarkers(markers);
        });
      }

      // This function populates the infowindow when the marker is clicked. We'll only allow
      // one infowindow which will open at the marker that is clicked, and populate based
      // on that markers position.
      function populateInfoWindow(marker, infowindow) {
        // Check to make sure the infowindow is not already opened on this marker.
        if (infowindow.marker != marker) {
          // Clear the infowindow content to give the streetview time to load.
          infowindow.setContent('');
          infowindow.marker = marker;
          // Make sure the marker property is cleared if the infowindow is closed.
          infowindow.addListener('closeclick', function() {
            infowindow.marker = null;
          });
          // Set the content for the infowindow
          infowindow.setContent('<div>' + marker.title + '</div>');
          // Open the infowindow on the correct marker.
          infowindow.open(map, marker);
        }
      }

      // This function will loop through the markers array and display them all.
      function showListings() {
        var bounds = new google.maps.LatLngBounds();
        // Extend the boundaries of the map for each marker and display the marker
        for (var i = 0; i < markers.length; i++) {
          markers[i].setMap(map);
          bounds.extend(markers[i].position);
        }
        map.fitBounds(bounds);
      }

      // This function will loop through the listings and hide them all.
      function hideMarkers(markers) {
        for (var i = 0; i < markers.length; i++) {
          markers[i].setMap(null);
        }
      }

      // This function takes in a COLOR, and then creates a new marker
      // icon of that color. The icon will be 21 px wide by 34 high, have an origin
      // of 0, 0 and be anchored at 10, 34).
      function makeMarkerIcon(markerColor) {
        var markerImage = new google.maps.MarkerImage(
          'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +
          '|40|_|%E2%80%A2',
          new google.maps.Size(21, 34),
          new google.maps.Point(0, 0),
          new google.maps.Point(10, 34),
          new google.maps.Size(21,34));
        return markerImage;
      }
