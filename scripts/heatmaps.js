heatmapGraphs();
async function getUser() {
    const response = await fetch("http://localhost:3000/api/current_user");
	return await response.json();
}

async function getAllLocations() {  
	const user = await getUser();
	const user_id = user.user_id;
	const response = await fetch(
		"http://localhost:3000/api/locations/" + user_id
    );
	return await response.json();
}

async function getLatAndLon() {
    const locations = await getAllLocations();
	let points = [];
	for(let item of locations){
		let lococation =  {
			lat: item.latitudeE7/10000000,
            lng: item.longitudeE7/10000000  ,
            counter: 1
        };
		points.push(lococation);
    }
	return points;
}
// async function getLatLon() {
//     const url = "http://localhost:3000/api/locations/";
//     let xhr = new XMLHttpRequest;
//     xhr.open('GET', url, true)

//     xhr.onload = function () {
//         if (this.status === 200)
//         {
//             console.log(JSON.parse(this.responseText))
//             heatmapGraphs(JSON.parse(this.responseText));
// 		}else {
//             console.log('error')
//         }
//     }

//     xhr.send()
// }

async function heatmapGraphs(){
    let results = await getLatAndLon();
    console.log(results)
    let options ={
        zoom: 11,
        center:[38.230462, 21.75315]
    };
    let config={
        radius:6,
        maxOpacity:10,
        scaleRadius:false,
        latField:'lat',
        longField:'lng',
        valueField: 'count',
        gradient: {
            0.45: "rgb(000,000,255)",
            0.55: "rgb(000,255,255)",
            0.65: "rgb(000,255,000)",
            0.95: "rgb(255,255,000)",
            1.00: "rgb(255,000,000)"
        }
    };
    const user_heatmap = L.map("heatmap").setView([38.230462, 21.75315], 11);
    const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';
    const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    const tiles = L.tileLayer(tileUrl, { attribution });
    tiles.addTo(user_heatmap);
    
    let heatmap = new HeatmapOverlay(config);
   

    testData ={
        data:results
    }
    console.log(testData);
    heatmap.setData(testData);
    user_heatmap.addLayer(heatmap);
}

