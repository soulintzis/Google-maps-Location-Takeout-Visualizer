let restrictedAreas = []
const patrasMap = L.map("patrasMap").setView([38.230462, 21.75315], 11);
const attribution =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';
const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const tiles = L.tileLayer(tileUrl, { attribution });
tiles.addTo(patrasMap);

const circle = L.circle([38.230462, 21.75315], {
  color: "#a6a6a6",
  fillColor: "#bfbfbf",
  fillOpacity: 0.3,
  radius: 10000
}).addTo(patrasMap);

// Initialise the FeatureGroup to store editable layers
let editableLayers = new L.FeatureGroup();
patrasMap.addLayer(editableLayers);

const drawPluginOptions = {
  position: "topright",
  draw: {
    polygon: {
      allowIntersection: false, // Restricts shapes to simple polygons
      drawError: {
        color: "#red", // Color the shape will turn when intersects
        message: "<strong>Oh snap!<strong> you can't draw that!" // Message that will show when intersect
      },
      shapeOptions: {
        color: "#595959",
        fillColor: "#bfbfbf"
      }
    },
    // disable toolbar item by setting it to false
    polyline: false,
    circle: false, // Turns off this drawing tool
    rectangle: false,
    marker: false
  },
  edit: {
    featureGroup: editableLayers, //REQUIRED!!
    remove: false
  }
};

// Initialise the draw control and pass it the FeatureGroup of editable layers
const drawControl = new L.Control.Draw(drawPluginOptions);
patrasMap.addControl(drawControl);

patrasMap.on("draw:created", function(polygon) {
    const type = polygon.layerType, layer = polygon.layer;

    let counter = 0;

    for(let i = 0; i < layer.getLatLngs()[0].length; i++){
        if (!(layer.getLatLngs()[0][i].distanceTo(circle.getLatLng()) <= circle.getRadius())) {
            counter++;
        }
    }

    if(counter < layer.getLatLngs()[0].length){
        editableLayers.addLayer(layer);
        restrictedAreas.push(layer.getLatLngs()[0])
    }else{
        alert('There is no point to add a restricted area outside of the circle.')
    }
});

async function retriveRestrictedAreas() {
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(restrictedAreas)
    };
    await fetch("/restrictions", options);   
}