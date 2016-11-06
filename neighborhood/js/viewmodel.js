// Object representing a single doctor
// Each doctor has his or her own map Marker and infoWindow
function Doctor(dataObj) {

    var self = this;
    self.name = dataObj.name;
    self.office = dataObj.address.office;
    self.uid = dataObj.uid;
    self.lat = Number(dataObj.address.lat);
    self.lng = Number(dataObj.address.long);
    self.specialty = dataObj.specialty;

    // Get this info from the BetterDoctor API asynchronously
    self.rating = null;
    self.numRatings = null;
    self.ratingImg = null;

    // Store the rating-related infoWindow content here
    self.ratingContent = null;

    // Create the map marker for this Doctor
    self.mapMarker = new google.maps.Marker({
        position: {lat: self.lat, lng: self.lng},
        map: map,
        title: self.name
    });

    // Create the info window for this Doctor
    self.infoWindow = new google.maps.InfoWindow();

    // Show the info window, building content first if necessary
    self.showInfoWindow = function() {
        // Build the basic info window content, if hasn't been done
        if (!self.infoWindow.getContent()) {
            // Initialize basic info window content and display it
            self.infoWindow.setContent('Loading content...');
            var content = '<h3 class="doc-title">' + self.name + '</h3>';
            content += '<small class="doc-specialty">' + self.specialty + '</small>';
            content += '<br/>';
            content += '<small class="doc-address">' + self.office + '</small>';
            self.infoWindow.setContent(content);
        }

        //If the Doctor's rating has not yet been fetched, get it now
        if (!self.ratingContent) {
            doctor.getDocRating(self.uid, function(results) {
                var content = '<div class="doc-box">';
                content += '<h3 class="doc-rating-title">Rating </h3>';
                content += '<small class="doc-rating">';
                if (results != null) {
                    content += results.rating;
                    content += ' out of 5';
                } else {
                   content += '<i>No rating information available</i>';
                }
                content += '</small>';
                content += '</div>';
                self.ratingContent = content;
                var allContent = self.infoWindow.getContent() + content;
                self.infoWindow.setContent(allContent);
            });
        }

        // Show info window
        self.infoWindow.open(map, self.mapMarker);
    };

    // Enable marker bounce animation, and show the info window.
    // If another Doctor is active, turn it off (only one can be active at a time).
    self.turnOn = function() {
        // Check the variable that references the currently active Doctor.
        // If the value is not null, and it does not point to this Doctor,
        // turn off the currently active Doctor.
        if (Doctor.prototype.active) {
            if (Doctor.prototype.active !== self) {
                Doctor.prototype.active.turnOff();
            }
        }

        // Enable marker bounce animation and show info window
        self.mapMarker.setAnimation(google.maps.Animation.BOUNCE);
        self.showInfoWindow();

        // Set this Doctor as the active one
        Doctor.prototype.active = self;
    };

    // Disable marker bounce animation and close the info window
    self.turnOff = function() {
        self.mapMarker.setAnimation(null);
        self.infoWindow.close();

        // Set the class variable that holds the reference to the active object
        // to null
        Doctor.prototype.active = null;
    };

    // Center the map on the requested location, then activates this Doctor.
    // This happens via Knockout when a listview item is clicked
    self.focus = function() {
        map.panTo({lat: self.lat, lng: self.lng});
        self.turnOn();
    };

    // Toggle the active state of this Doctor.
    // This is the callback for the marker's click event.
    self.mapMarkerClick = function() {
        // If currently active (marker bouncing, info window visible),
        // deactivate. Otherwise, activate.
        if (Doctor.prototype.active === self) {
            self.turnOff();
        } else {
            self.turnOn();
        }
    };

    // Turn off this Doctor when the info marker's close button is clicked
    self.infoWindowClose = function() {
        self.turnOff();
    };

    // Set mapMarkerClickHandler as the click callback for the map marker
    self.mapMarker.addListener('click', self.mapMarkerClick);

    // Set infoWindowCloseClickHandler as the click callback for the info
    // window's close button
    self.infoWindow.addListener('closeclick', self.infoWindowClose);

    // Use this for debugging
    self.printDoc = function() {
        console.log('Doctor is ' + self.name);
        console.log('...uid is ' + self.uid)
        console.log('...address is ' + self.office);
        console.log('...lat is ' + self.lat);
        console.log('...lng is ' + self.lng);
    };
}

// Static class variable
// Store the active Doctor (the one with a visible infoWindow)
// Null until a Doctor is clicked
Doctor.prototype.active = null;

//
// View model that controls the display of the list of Doctors on the screen
//
function ViewModel() {
    var self = this;
    self.doctors = ko.observableArray([]);
    self.filter = ko.observable('');
    self.loadMsg = ko.observable('Loading doctor data ...');
    self.isVisible = ko.observable(true);

    // Update the list contents whenever the filter is modified
    // Toggle map marker visibility depending on the filter results
    self.filteredList = ko.computed(function() {
        var matches = [];
        // Do a case-insensitive search based on the filter observable
        var re = new RegExp(self.filter(), 'i');

        // Iterate over all Doctors, searching for a matching name
        self.doctors().forEach(function(doctor) {
            // Found a match - display the marker
            if (doctor.name.search(re) !== -1) {
                matches.push(doctor);
                doctor.mapMarker.setVisible(true);
            // No match - hide the marker
            } else {
                // Hide marker
                doctor.mapMarker.setVisible(false);

                // If the info window for this Doctor is open, close it
                if (Doctor.prototype.active === doctor) {
                    doctor.turnOff();
                }
            }
        });

        return matches;
    });

    // Show/hide the list when the toggle button is clicked
    self.toggleList = function() {
        self.isVisible(!self.isVisible());
    };

    // Do this when a list item is clicked
    self.clickListItem = function(doc) {
        // Hide the list if the viewing area is small
        if (window.innerWidth < 1024) {
            self.isVisible(false);
        }

        // Show the Doctor's map marker and info window
        doc.focus();
    };

    // Initialize the array of Doctor objects from previously gathered data
    var jsonUrl = 'https://sjkordis.github.io/neighborhood/js/doctorData.json';
    $.getJSON(jsonUrl, function(data) {
        var doctors = [];
        var doctor;
        //var bounds = new google.maps.LatLngBounds();

        bounds = new google.maps.LatLngBounds();

        data.docs.forEach(function(dataObj) {
            // Create a new doctor
            doctor = new Doctor(dataObj);
            // Use for debugging
            // doctor.printDoc();
            // Append the new doctor to the array of doctors
            doctors.push(doctor);

            // Extend the bounds to include this doctor's location
            bounds.extend(doctor.mapMarker.position);
        });

        // Update the observable array of doctors
        self.doctors(doctors);

        // Resize the map to display all markers in the bounds object
        map.fitBounds(bounds);

        // Set the loading message to null to hide it
        self.loadMsg(null);
    }).fail(function() {
        self.loadMsg('Unable to load data... please try again later');
        console.log('ERROR: Cannot get doctor data');
    });
}


// Initialize the Google Map object and start Knockout (callback)
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 15,
        center: {lat: 40.5853, lng: -105.0844}, // Fort Collins, Colorado
        mapTypeControl: false,
    });

    // Start Knockout only after the map is initialized
    ko.applyBindings(new ViewModel());
}

// Fail gracefully if unable to load the Google Map (callback)
function initMapError() {
    alert('Unable to load the Google Map');
    console.log('Unable to load the Google Map');
}

// Google Map object
var map;

// Global variable to hold the initial map bounds with all markers
var bounds;

// Resize the map when the user resizes the window (for responsiveness)
window.onresize = function() {
    if (bounds != null) {
        map.fitBounds(bounds);
    }
}