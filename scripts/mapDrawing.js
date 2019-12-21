var map;
var restrictedAreas = [];
var locations = {};
function initMap() {
    var map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 38.246639, lng: 21.734573 },
        zoom: 13,
        mapTypeId: google.maps.MapTypeId.RoadMap,
        mapTypeControl: false
    });

    var drawingManager = new google.maps.drawing.DrawingManager({
        drawingMode: google.maps.drawing.OverlayType.POLYGON,
        drawingControl: false,
        drawingControlOptions: {
          drawingModes: 'polygon'
        }
      });
      drawingManager.setMap(map);

    google.maps.event.addListener(drawingManager, 'overlaycomplete', function(polygon) {
        var coordinatesArray = polygon.overlay.getPath().getArray();
        var obj = {
            coordinates: []
        }
        for (var i = 0; i < coordinatesArray.length; i++) {
            console.log(coordinatesArray[i].toJSON());
            obj.coordinates.push(coordinatesArray[i].toJSON());            
        }
        restrictedAreas.push(obj);
    });
}