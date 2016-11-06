## Neighborhood Map Project

Welcome to my Neighborhood Map project. This web page lists the 100 highest rated doctors nearest my home in Fort Collins, Colorado according to the website BetterDoctors.com. It shows the location of each doctor's office on a map.

To learn more about a specific doctor, click that doctor's name in the list on the left or click a marker on the map. An info window displays the doctor's specialty, address, and rating. Only one info window can be open at any given time.

This project emphasizes the following concepts:

* Separation of concerns
* Asynchronous data retrieval
* REST APIs

It is implemented using KnockOut and features asynchronous calls to the Google Maps Javascript API and the BetterDoctors API.

Web site URL:  [https://sjkordis.github.io/neighborhood/](https://sjkordis.github.io/neighborhood/)

Location of source files:  [https://github.com/sjkordis/sjkordis.github.io/tree/master/neighborhood/](https://github.com/sjkordis/sjkordis.github.io/tree/master/neighborhood)

The implementation uses two steps:

1. The first step reads the data from the minified file [js/doctorData.json](js/doctorData.json) and prepares the list of doctors displayed on the left. The contents of this file were prepared ahead of time to reduce the load time for the application (see [prepDocs.html](prepDocs.html)). This reduced the load time by approximately 5 seconds. The list of doctors is a KnockOut observable array.

2. The second step makes an asynchronous call to the BetterDoctors API to retrieve the rating for the selected doctor. It displays an info window on the Google Map containing information about the doctor's practice, including the rating.

NOTES:

a.  To understand the Google Maps portion of this assignment, I did all the exercises provided in the lectures. Same for the KnockOut and API portions.

b. I read many Udacity forum posts and drew inspiration from the suggestions offered. I also consulted Stack Overflow when I got stuck, which happened frequently.

c. I tested the application on two Windows laptops (with and without a large monitor), an Android phone, and an Android tablet. I used the Google Chrome device emulator to test against virtual iOS devices.
