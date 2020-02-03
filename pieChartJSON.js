var dataPoints = [];

var chart = new CanvasJS.Chart("chartContainer", {
	title: {
		text: "Pie chart from JSON data"
	},
	data: [{
		type: "pie",
    indexLabel: "{label}, {y}",
		dataPoints: dataPoints
	}]
});

function addData(data) {
	for (var i = 0; i < data.length; i++) {
		dataPoints.push({
			label: data[i].id,
			y: data[i].createdAt
		});
	}
	chart.render();

}

$.getJSON("localhost:3000/api/users", addData);