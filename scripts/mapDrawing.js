var map;
var restrictedAreas = [];
var obj = {
    angles: [],
    coordinates: []
}
var locations = [];

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

    // google.maps.event.addListener(drawingManager, 'overlaycomplete', function (polygon) {
    //     var coordinatesArray = polygon.overlay.getPath().getArray();
    //     var obj = {
    //         coordinates: []
    //     }
    //     for (var i = 0; i < coordinatesArray.length; i++) {
    //         console.log(coordinatesArray[i].toJSON());
    //         obj.coordinates.push(coordinatesArray[i].toJSON());
    //     }
    //     restrictedAreas.push(obj);
    // });

    google.maps.event.addListener(drawingManager, 'polygoncomplete', function (polygon) {
        // document.getElementById('info').innerHTML += "<b>polygon points:<b>" + "<br><br>";
        for (var i = 0; i < polygon.getPath().getLength(); i++) {
            // document.getElementById('info').innerHTML += "" + polygon.getPath().getAt(i).toUrlValue(6) + ";";
            obj.coordinates.push(polygon.getPath().getAt(i).toUrlValue(6));
        }
        obj.angles.push(polygon.getPath().getLength());
        // polygonArray.push(polygon);
        // restrictedAreas.push(obj.coordinates);
        // console.log(obj);
        // const options = {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json'
        //     },
        //     body: JSON.stringify(obj)
        // };
        // fetch("/api", options);
    });

}
// function fetchRestrictedAreas(polygon) {
//     for (var i = 0; i < polygon.getPath().getLength(); i++) {
//         obj.coordinates.push(polygon.getPath().getAt(i).toUrlValue(6));
//     }
//     obj.angles.push(polygon.getPath().getLength());
//     console.log(obj);
//     const options = {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(obj)
//     };
//     console.log("Hello");
//     // fetch("/api", options);
// }



// export function retriveRestrictedAreas() {
//     var retrivedObj = localStorage.getItem('coordinates');
//     return retrivedObj;
// };


async function myFunk() {
    var fileInput = document.getElementById('fileup');   
    const options1 = {
        method: 'POST',
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        body: fileInput
    };
    const options2 = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(obj)
    };
    console.log(fileInput);
    await fetch("/api", options2);   
}