      function initAutocomplete() {
        var map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: -33.8688, lng: 151.2195},
          zoom: 13,
          mapTypeId: 'roadmap'
        });

        // Create the search box and link it to the UI element.
        var input = document.getElementById('pac-input');
        var searchBox = new google.maps.places.SearchBox(input);
        map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

        // Bias the SearchBox results towards current map's viewport.
        map.addListener('bounds_changed', function() {
          searchBox.setBounds(map.getBounds());
        });

        var markers = [];
        // Listen for the event fired when the user selects a prediction and retrieve
        // more details for that place.
        searchBox.addListener('places_changed', function() {
          var places = searchBox.getPlaces();

          if (places.length == 0) {
            return;
          }

          // Clear out the old markers.
          markers.forEach(function(marker) {
            marker.setMap(null);
          });
          markers = [];

          // For each place, get the icon, name and location.
          var bounds = new google.maps.LatLngBounds();
          places.forEach(function(place) {
            if (!place.geometry) {
              console.log("Returned place contains no geometry");
              return;
            }
            var icon = {
              url: place.icon,
              size: new google.maps.Size(71, 71),
              origin: new google.maps.Point(0, 0),
              anchor: new google.maps.Point(17, 34),
              scaledSize: new google.maps.Size(25, 25)
            };

            // Create a marker for each place.
            markers.push(new google.maps.Marker({
              map: map,
              icon: icon,
              title: place.name,
              position: place.geometry.location
            }));

            if (place.geometry.viewport) {
              // Only geocodes have viewport.
              bounds.union(place.geometry.viewport);
            } else {
              bounds.extend(place.geometry.location);
            }
          });
          map.fitBounds(bounds);
        });
      }
      //weatherly from here down


var icon;
var latitude;
var longitude;
var city;
var temperature;

function darksky_complete(result) {
    console.log(result.latitude);
    console.log(result.longitude);
    console.log(result.timezone);
    console.log(result.currently.icon);
    console.log(result.currently.time);
    console.log(result.currently.temperature);
    icon=result.currently.icon
    temperature =result.currently.temperature
    generateCard();
    

}
   function toggle_div(id){
       var divElement = document.getElementById(id);
       if(divElement.style.display == 'none')
         divElement.style.display = 'block';
         else
         divElement.style.display = 'none';
   }

function lookupLatLong_Complete(result) {
    
     city= result.results["0"].formatted_address;
     
     latitude = result.results["0"].geometry.location.lat;
     longitude = result.results["0"].geometry.location.lng;
    console.log("The lat and long is " + latitude + ", " + longitude);


    var request = {
        url: "https://api.darksky.net/forecast/3076dd7488b4447914c19faca690a9f0/" + latitude + "," + longitude,
        dataType: "jsonp",
        success: darksky_complete


    };
    $.ajax(request);

}
function lookupLatLong(city, state, postalCode) {

    var address = "";
    if (postalCode.length != 0) {
        address = postalCode.trim();
    }
    else if (city.length != 0 && state != 0) {
        address = city.trim() + ", " + state;
    }
    else {
        return;
    }


    var googleUrl = "https://maps.googleapis.com/maps/api/geocode/json?address="
        + address + "&key=AIzaSyANgZVmo6IYYgJX4bG2m0mxyKsQhvM6aiE";

    var request = {
        url: googleUrl,
        success: lookupLatLong_Complete

    };

    $.ajax(request);
}


 function lookupWeatherForPostalCode_Click() {
          var pcode = $("#postalCode").val();
          lookupLatLong("", "", pcode);
          console.log(test);
       
      } 

function lookupWeatherForPostalCode_Click() {
    var pcode = $("#postalCode").val();
    lookupLatLong("", "", pcode);

}

    function hide() { 
  $("#cards").empty();
    }

function weatherTemplate() {
 
    var template = $("#templateDiv").html(); 

            switch(icon){
             case "clear-day":
             case "clear-night":
             case "rain":
             case "fog":
             case "snow":
             case "sleet":
             case "cloudy":
             case "wind":
             case "partly-cloudy-day":
             case "partly-cloudy-night":
               template = template.replace("@@help@@", icon + ".png" );
               break;
               default:
                 template = template.replace("@@help@@", "http://wallpapercave.com/wp/4W2pw5V.jpg");
               break;
         }
                 

    
   
    template = template.replace("@@icon@@", icon);
    template = template.replace("@@latitude@@", latitude);
    template = template.replace("@@longitude@@", longitude);
    template = template.replace("@@city@@", city);
    template = template.replace("@@temperature@@", temperature);
    
    


    // Return the new HTML.
    return template;
}


// The divs will automatically wrap because of Bootstrap knowing it's a col-md-3.
function generateCard(result){
var html = weatherTemplate;
$("#cards").append(html);
}

$(function () {
    $("#postButton").on("click", lookupWeatherForPostalCode_Click)
    $("#cards").on("click", hide)
});