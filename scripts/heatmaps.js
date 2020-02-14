ajaxHeatmapCall();

async function ajaxHeatmapCall() {
    const url = "http://localhost:3000/api/heatmap_locations";
    let xhr = new XMLHttpRequest;
    xhr.open('GET', url, true)

    xhr.onload = function () {
        if (this.status === 200)
        {
            heatmapGraphs(JSON.parse(this.responseText));
		}else {
            console.log('error')
        }
    }

    xhr.send()
}

async function heatmapGraphs(results){
    let config={
        radius:5,
        maxOpacity:8,
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
        data: results
    }
    heatmap.setData(testData);
    user_heatmap.addLayer(heatmap);
}

