// Helper object used to asynchronously get rating info from the BetterDoctors API
function Doctor() {

    var betterDocUrl = 'https://api.betterdoctor.com/2016-03-01/doctors/DOC_ID?user_key=e410d84a2e14f106dbd8bcd6c1e84363';

    // Get info about this doctor
    function getDocInfo(docId, callback) {
        var url = betterDocUrl.replace('DOC_ID', docId);
        $.getJSON(url, callback).fail(function() {
            alert('Unable to get rating information about this doctor');
            console.log('ERROR: Doc info search failed for ' + docId);
        });
    }

    // Use the BetterDoctor API to get the rating information for the specified doc
    this.getDocRating = function(docId, callback) {
        getDocInfo(docId, function(results) {
            // The first entry in the ratings array is the BetterDoctor rating
            var docRatingInfo = results.data.ratings[0];
            callback(docRatingInfo);
        });
    };
}

// Global doctor object used by the app
var doctor = new Doctor();