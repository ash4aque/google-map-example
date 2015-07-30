
/**
 * Constructor function to initialize the customMap instance and set the initial passed arguments.
 *
 * @param markerObj
 */
function customMap (currentData) {
    this.data = currentData;
    this.markers = [];
    this.map = null;
}

/**
*This method will initalize the map centered in US lat, long, attache listeners and render the map based on users zoom level.
* "lat" : 37.09024,
* "lng" : -95.712891
*
*/
customMap.prototype.init = function() {
  var that = this;
  this.map = new google.maps.Map(document.getElementById("googleMap"), {
    center: new google.maps.LatLng(37.09024, -95.712891), // set US lat,long for center the map
    zoom: 2,
    minZoom:2,
    maxZoom:4,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  });

  google.maps.event.addListener(that.map, 'zoom_changed', function() {
      $("#container").html("");
      var zoomLevel = that.map.getZoom();
      var currentObj = null;
      var type = "States";
      if (zoomLevel ==3) {
          currentObj = that.data["city"];
          type = "Cities";
      } else if (zoomLevel == 4) {
          currentObj = that.data["zip"];
          type = "Zipcodes";
      } else {
          currentObj = that.data["state"];
      }    
      that.render(that.map, currentObj, type);   
  });
  this.render(this.map, this.data["state"], "States");
};
/**
 * This method will render the map and attach the pins based on passed data.
 *
 * @param map object, markerObj and type 
 */ 
customMap.prototype.render = function(map, markerObj, type) {
  var start = new Date().getMilliseconds();
  this.clearMarker(this.markers);
  for (var key in markerObj) {
    var data = markerObj[key];
    var latLng = new google.maps.LatLng(data.location.lat, data.location.lng); 
    var marker = new google.maps.Marker({
      position: latLng,
      map: map,
      title: ""
    });
    this.markers.push(marker);
    (function(marker, data, key) {
      var contentString  = data[key].count + " Users in "+ data[key].name;
      var infowindow = new google.maps.InfoWindow({content: contentString,});

      google.maps.event.addListener(marker,'click',function() {
        infowindow.open(map, marker);
      });
      $("#type").html(type);
      $("#container").append("<p>"+contentString+"</p>");

    })(marker, markerObj, key);
  }
  var end = new Date().getMilliseconds();
  var time = end - start;
  $("#renderMap-time").html("Execution time for render map is " + time + " milliseconds");
};
/**
 * This method will clear the already existing markers on map.
 */
customMap.prototype.clearMarker = function() {
  if (this.markers.length>0){
    for (var i = 0; i < this.markers.length; i++) {
      this.markers[i].setMap(null);
    }
  }
};