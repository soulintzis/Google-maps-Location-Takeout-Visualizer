var map;
var restrictedAreas = {
    angles: [],
    coordinates: []
}

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

    google.maps.event.addListener(drawingManager, 'polygoncomplete', function (polygon) {
        for (var i = 0; i < polygon.getPath().getLength(); i++) {
            restrictedAreas.coordinates.push(polygon.getPath().getAt(i).toUrlValue(6));
        }
        restrictedAreas.angles.push(polygon.getPath().getLength());
    });
}

async function retriveRestrictedAreas() {
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(restrictedAreas)
    };
    await fetch("/api", options);   
}