// Assign email to heading
var emailHeading = $('#heading-email');

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
    console.log("User signed in!");

    var email = user.email;
    emailHeading.html(email);
  }
  else {
    // User is signed out.
    console.log("User signed out!");
    window.location.href = "login.html";
  }
});

// Logout listener
var logoutBtn = $('#btn-logout');

logoutBtn.click( function() {
  firebase.auth().signOut().catch(function (error) {
    console.log(error);
  });
});

// Load maps
var map;

function initMap() {

  var uluru = {lat: -25.363, lng: 131.044};

  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 4,
    center: uluru
  });

  // Try and get location
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {

      // Center map in found location
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      map.setCenter(pos);
      map.setZoom(12);

      // Set marker
      var marker = new google.maps.Marker({
        position: pos,
        map: map,
        icon: 'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|193'
      });

      var infowindow = new google.maps.InfoWindow({
        content: 'Your current location'
      });

      marker.addListener('click', function() {
        infowindow.open(map, marker);

        // Close existing info windows that are open
        if (openWindow != null) {
          openWindow.close();
        }

        openWindow = infowindow;
      });

    }, function() {
      console.log("Unable to get location");
    });
  }
}

// Load facilities
var database = firebase.database();
var facilitiesRef = database.ref('facilities');
var locationsRef = database.ref('locations')
var geofire = new GeoFire(locationsRef);
var openWindow;

facilitiesRef.on('value', function(snapshot) {
  snapshot.forEach(function (childsnapshot) {
    var key = childsnapshot.key;

    // Get facility location
    geofire.get(key).then(function(location) {

      // Place marker
      var childData = childsnapshot.val();

      var contentString =
      '<h1>' + childData.name + '</h1>'
      + "Changing : " + childData.facilities.changing + '</br>'
      + "Feeding: " + childData.facilities.feeding + '</br>'
      + "Warming : " + childData.facilities.warming + '</br>';

      // Create infoWindow
      var infowindow = new google.maps.InfoWindow({
        content: contentString
      });

      // Create a marker
      var pos = {lat: location[0], lng: location[1]};
      var marker = new google.maps.Marker({
        position: pos,
        map: map,
        icon: 'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|944'
      });

      // Add a marker listener
      marker.addListener('click', function() {
        infowindow.open(map, marker);

        // Close existing info windows that are open
        if (openWindow != null) {
          openWindow.close();
        }

        openWindow = infowindow;
      });
    });
  });
});
