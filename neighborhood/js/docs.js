//Global variables

var LOCAL_ZIPS = '8052180524805258052680528';       //Fort Collins ZIP codes
var SEARCH_RADIUS = '7';                            //Search a 7 mile radius
var SEARCH_CENTER = '40.5853%2C%20-105.0844%2C%20'; //Fort Collins city center
var SORT_TYPE = 'rating-desc';                      //List highest rated docs first
var NUM_DOCS = '100';                               //Number of docs to list
var API_KEY = 'e410d84a2e14f106dbd8bcd6c1e84363';   //BetterDoctors API key

var searchUrl = 'https://api.betterdoctor.com/2016-03-01/doctors?' +
                'location=' + SEARCH_CENTER + SEARCH_RADIUS + '&' +
                'sort=' + SORT_TYPE + '&' +
                'skip=0' + '&' +
                'limit=' + NUM_DOCS + '&' +
                'user_key=' + API_KEY;
console.log('URL is ' + searchUrl);

// Constructor for the Doctor API helper object
function Doctor() {

    // Internal function that uses the Better Doctor API to
    // find a list of doctors near the specified location
    function search(callback) {
        $.getJSON(searchUrl, callback).fail(function() {
            alert('ERROR: Failed to search BetterDoctor for list of local doctors');
            console.log('ERROR: BetterDoctor GET .../doctors failed');
        });
    }

    function initDocObject( docObj ) {
        var doc = new (Doctor);

        doc.name = 'No name available';
        doc.address = 'No practice location info available';
        doc.lat = 'No practice location info available';
        doc.lng = 'No practice location info available';
        doc.phone = 'No practice phone available';
        doc.specialty = 'No specialty info available';
        doc.rating = 'No rating info available';
        doc.numRatings = 0;

        if (docObj.profile != null) {
            var profile = docObj.profile;
            doc.name = profile.first_name + ' ' + profile.last_name + ', ' + profile.title;
            doc.uid = profile.slug;
        }
        if (docObj.specialties.length > 0) {
            doc.specialty = docObj.specialties[0].name;
        }
        var foundLocal = false;
        for (i = 0; (i < docObj.practices.length) && !foundLocal; i++) {
            var addr = docObj.practices[i].visit_address;
            console.log('Zip for doctor ' + doc.name + ', practice[' + i + '] is ' + addr.zip);
            console.log('LOCAL_ZIPS.includes(addr.zip) is ' + LOCAL_ZIPS.includes(addr.zip));
            if (LOCAL_ZIPS.includes(addr.zip)) {
                doc.lat = addr.lat;
                doc.lng = addr.lon;
                if (addr.street != null) {
                    doc.address = addr.street;
                    if (addr.street2 != null) {
                        doc.address = doc.address + ', ' + addr.street2;
                    }
                }
                foundLocal = true;
            }
            var phones = docObj.practices[i].phones;
            for (j = 0; j < phones.length; j++) {
                var phone = phones[j];
                if (phone.type == "landline") {
                    doc.phone = phones[j].number;
                }
            }
        }
        if (docObj.ratings.length > 0) {
            doc.rating = docObj.ratings[0].rating;
        }
        return(doc);
    }

    function printDocObject( docObj ) {

        $( "#docList" ).append('{ ' +
            '"name": ' + '" ' + docObj.name + '", ' +
            '"address": {' +
                '"office": "' + docObj.address + '", ' +
                '"lat": "' + docObj.lat + '", ' +
                '"long": "' + docObj.lng + '" ' +
            '},' +
            '"specialty": ' + '" ' + docObj.specialty + '", ' +
            '"uid": ' + '"' + docObj.uid + '"' +
            ' }');
    }

    function openList() {
        $( "#docList" ).append('<p>{ "docs": [</p>');
    }

    function closeList() {
        $( "#docList" ).append('<br />] }</p>');
    }

    function delimitObject( delimiter ) {
        $( "#docList" ).append(delimiter + '</p><p>');
    }

    // This function is exposed to the app. It pulls the desired info out of the
    // the records that the API returns.
    this.listDoctors = function(callback) {
        search(function(results) {
            var doctors = results.data;
            var docObjects = [];
            var docObj;

            openList();
            // Iterate over each doctor, pulling out the pertinent info
            for (var i = 0; i < doctors.length; i++) {
                // Create info object, initially containing photo's source URLs
                docObj = initDocObject(doctors[i]);
                console.log('In listDoctors...i is ' + i + ' and doc name is ' + docObj.name);
                printDocObject(docObj);
                if ( i < (doctors.length - 1) ) {
                    delimitObject( ',' );
                }
                docObjects.push(docObj);
            }
            closeList();
        });
    };
}

// Global object to be utilized by the app
var doctor = new Doctor();

doctor.listDoctors();