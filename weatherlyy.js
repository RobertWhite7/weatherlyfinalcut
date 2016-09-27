var time;
var icon;
var latitude;
var longitude;
var city;
var tempature;

function darksky_complete(result) {
    console.log(result.latitude);
    console.log(result.longitude);
    console.log(result.timezone);
    console.log(result.currently.icon);
    console.log(result.currently.time);
    console.log(result.currently.tempature);
    icon=result.currently.icon
    tempature =result.currently.tempature
    

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

function generateCard() {
 
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
               template = template.replace("@@help@@", icon);
               break;
               default:
                 template = template.replace("@@help@@", "http://wallpapercave.com/wp/4W2pw5V.jpg");
               break;
         }
                 

    
    template = template.replace("@@time@@", time);
    template = template.replace("@@icon@@", icon);
    template = template.replace("@@latitude@@", latitude);
    template = template.replace("@@longitude@@", longitude);
    template = template.replace("@@city@@", city);
    template = template.replace("@@tempature@@", tempature);
    
    


    // Return the new HTML.
    return template;
}


// The divs will automatically wrap because of Bootstrap knowing it's a col-md-3.
function generateCard(result){
var html = generateCard;
$("#cards").append(html);
}

        


$(function () {
    $("#postButton").on("click", lookupWeatherForPostalCode_Click)
});
 





