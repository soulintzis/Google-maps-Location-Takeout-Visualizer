let charts = null;
let date_from = null;
let date_until = null;


window.onload = function() {
	curr_date();
	getEcoScore()
};

function typesGraph(results){
	let types = [], counters = [];
	for(let item of results) {
		types.push(item.type);
		counters.push(item.counter);
	}
	if(charts !== null){ 
		charts.destroy();
	}
	const ctx = document.getElementById('graphs').getContext('2d');
	charts = new Chart(ctx,{
		type:'bar',
		options: {
			scales: {
				yAxes: [{
					ticks: {
						beginAtZero: true
					}
				}]
			},
			title: {
				display: true,
				position: 'top',
				fontSize: 16,
				text: 'Number of Records per Activity'
			},
			legend: {
				display: true,
				position: 'bottom',
			}
		},
		data: {
			datasets: [{
				label: [types],
				data: counters,
				backgroundColor: '#009973',
				bordercolorColor: '#000',
				borderWidth: 2
			}],
			labels: types
		}
	});
}

function hourGraph(results){
	const ctx=document.getElementById('graphs').getContext('2d');
	if(charts !== null){ 
		charts.destroy();
	}
	charts = new Chart(ctx,{
		type:'bar',
		options: {
			scales: {
				scales:{
					xAxes: [{
						stacked: true
					}],
					yAxes: [{
						stacked: true,
						ticks: {
							beginAtZero: true
						}
					}],
				}
			},
			title: {
				display: true,
				position: 'top',
				fontSize: 16,
				text: 'Number of Records per Activity'
			},
			legend: {
				display: true,
				position: 'bottom',
			}
		},
		data:{
			datasets: manipulateDateForHourGraph(results),
			labels: getHours()
		}
	});
}

function dayGraph(results){
	let result = manipulateDateForDayGraph(results);
	const ctx=document.getElementById('graphs').getContext('2d');
	if(charts !== null){ 
		charts.destroy();
	}
	charts = new Chart(ctx,{
		type:'bar',
		options: {
			scales: {
				scales:{
					xAxes: [{
						stacked: true
					}],
					yAxes: [{
						stacked: true,
						ticks: {
							beginAtZero: true
						}
					}],
				}
			},
			title: {
				display: true,
				position: 'top',
				fontSize: 16,
				text: 'Number of Records per Activity'
			},
			legend: {
				display: true,
				position: 'bottom',
			}
		},
		data:{
			datasets: result.display_data,
			labels: result.labels
		}
	});
}


function getHours() {
	var hours = [];
	var text_hour;
	for (var i = 0; i < 24; i++) {
		if (i > 9) {
			text_hour = i+':00';
		} else {
			text_hour = '0'+i+':00';
		}
		hours.push(text_hour);
	}
	return hours;
}

function getTypesOfActivity() {
	document.getElementById("loading-img").style.display = "block";
	from = getDateFrom();
	until = getDateUntil();
	console.log(from,until);
	const url = 'http://localhost:3000/api/' + from + '/' + until + '/get-types-of-activity';
    let xhr = new XMLHttpRequest;
    xhr.open('GET', url, true)

    xhr.onload = function () {

        if (this.status === 200)
        {
			typesGraph(JSON.parse(this.responseText));
			document.getElementById("loading-img").style.display = "none";
		}else {
            console.log('error');
        }
    }

    xhr.send()
}

async function getBusiestHour() {
	document.getElementById("loading-img").style.display = "block";
	from = getDateFrom();
	until = getDateUntil();
    const url = 'http://localhost:3000/api/' + from + '/' + until + '/get_busiest_hour_of_the_day';
    let xhr = new XMLHttpRequest;
    xhr.open('GET', url, true)

    xhr.onload = function () {
        if (this.status === 200)
        {
			hourGraph(JSON.parse(this.responseText));
			document.getElementById("loading-img").style.display = "none";
		}else {
            console.log('error')
        }
    }

    xhr.send()
}

async function getEcoScore() {
    const user = await getUser();
	const user_id = user.user_id;
    const url = "http://localhost:3000/api/locations/get_eco_score/" + user_id;
    let xhr = new XMLHttpRequest;
    xhr.open('GET', url, true)

    xhr.onload = function () {
        if (this.status === 200)
        {
			pieChart(JSON.parse(this.responseText));
		}else {
            console.log('error')
        }
    }

    xhr.send()
}

async function getBusiestDay() {
	document.getElementById("loading-img").style.display = "block";
	from = getDateFrom();
	until = getDateUntil();
    const url = 'http://localhost:3000/api/' + from + '/' + until +  '/get_busiest_day_of_the_week/';
    let xhr = new XMLHttpRequest;
    xhr.open('GET', url, true)

    xhr.onload = function () {
        if (this.status === 200)
        {
			dayGraph(JSON.parse(this.responseText));
			document.getElementById("loading-img").style.display = "none";
		}else {
            console.log('error')
        }
    }

    xhr.send()
}

function getDateFrom() {
    let date = document.getElementById("from_date").value;
    let d = new Date(date);
    year = d.getFullYear();
    month = ((d.getMonth()+1) < 10 ? '0' : '') + (d.getMonth()+1);
    day = (d.getDate() < 10 ? '0' : '') + d.getDate();
    from_date = day + '/' + month + '/' + year;
	return from_date;
}

function getDateUntil() {
    let date = document.getElementById("until_date").value;
    let d = new Date(date);
    year = d.getFullYear();
    month = ((d.getMonth()+1) < 10 ? '0' : '') + (d.getMonth()+1);
    day = (d.getDate() < 10 ? '0' : '') + d.getDate();
    until_date = day + '/' + month + '/' + year;
	return until_date;
}

function curr_date() {
    let from = document.getElementById("from_date");
    let until = document.getElementById("until_date");
    let today = new Date();
    until.value = today.toISOString().substr(0, 10);
	today.setFullYear(today.getFullYear() - 1);
	from.value = today.toISOString().substr(0, 10);
}

function manipulateDateForHourGraph(result) {
	let data = result.map(function(e) {
		return e.hours;
	});
	let labels = result.map(function(e) {
		return e.type;
	});

	display_data = []
	for(j = 0; j < data.length; j++) {
		let hours = [];
		for(i = 0; i < 24; i++) {
			index = data[j].findIndex(x => x.hour === i);
			if(index === -1){
				hours.push(0);
			}else{
				hours.push(data[j][index].counter);
			}
		}
		let inserted_data = {
			label: labels[j],
			data: hours,
			backgroundColor: getRandomColor()
		};
		display_data.push(inserted_data);
	}
	return display_data;
}

function manipulateDateForDayGraph(result) {
	let data = result.map(function(e) {
		return e.days;
	});

	let activity_labels = result.map(function(e) {
		return e.type;
	});

	let labels = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
	display_data = []
	for(j = 0; j < data.length; j++) {
		let days = [];
		for(i = 0; i < 7; i++) {
			index = data[j].findIndex(x => x.day === i);
			if(index === -1){
				days.push(0);
			}else{
				days.push(data[j][index].counter);
			}
		}
		let inserted_data = {
			label: activity_labels[j],
			data: days,
			backgroundColor: getRandomColor()
		};
		display_data.push(inserted_data);
	}
	return { display_data, labels };
}

function getRandomColor() {
	var letters = '0123456789ABCDEF';
	var color = '#';
	for (var i = 0; i < 6; i++) {
	  color += letters[Math.floor(Math.random() * 16)];
	}
	return color;
}

function getGraph(selectedObject) {
	let value = selectedObject.value;
	if(value === 'types_of_activity'){
		getTypesOfActivity();
	}else if(value === 'busiest_hour'){
		getBusiestHour();
	}else if(value === 'busiest_day'){
		getBusiestDay();
	}
}

async function pieChart(results){
	const ctx = document.getElementById('eco-score').getContext('2d');
	let pieChart = new Chart(ctx,{
	type:'doughnut',
	options: {
        title: {
			display: true,
			position: 'top',
			fontSize: 16,
            text: 'Eco-Score'
		},
		legend: {
			display: true,
			position: 'bottom',
		},
		responsive: true
    },
	data : {
		datasets: [{
			label:("Eco", "Non Eco"),
			data: [results.eco_counter, results.non_eco_counter],
			backgroundColor:['#248f24','#cc0000'],
			bordercolor:['#fff','#fff'],
			borderWidth:0.3,
			position: top
		}],
		labels:["Eco Behavior","Non Eco Behavior"]
	}
});
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
	let location = {
		latitude: Number,
		longitude: Number
	}
	for(let item of locations){
		let loc =  {
			latitude: item.latitudeE7/10000000,
			longitude: item.longitudeE7/10000000
		};
		points.push(loc);
	}
	return points;
}


async function getUser() {
	const response = await fetch("http://localhost:3000/api/current_user");
	return await response.json();
}

// async function getCurrentMonthActivities() {
// 	const user = await getUser();
// 	const user_id = user.user_id;
// 	const response = await fetch(
// 		"http://localhost:3000/api/locations/current_month/" + user_id
// 	);
// 	return await response.json();
// }

// async function getAllActivities() {
// 	const user = await getUser();
// 	const user_id = user.user_id;
// 	const response = await fetch(
// 		"http://localhost:3000/api/locations/" + user_id
// 	);
// 	return await response.json();
// }

// async function getEcoScore() {  
// 	const user = await getUser();
// 	const user_id = user.user_id;
// 	const response = await fetch(
// 		"http://localhost:3000/api/locations/get_eco_score/" + user_id
// 	);
// 	return await response.json();
// }

// const data = await JSON.parse(response.text());
// return data;
// const url = 'http://localhost:3000/api/locations/' + '71f36dd99aa4d65c111a52587007d4f80b9fd2f531c903c3ecc5ea3c64ae5496';
// let xhr = new XMLHttpRequest;
// xhr.open('GET', url, true)

// xhr.onload = function () {

// if (this.status === 200)
// {
//     let data = JSON.parse(this.response)

// }else {
//     console.log('error')
//   }
// }

// xhr.send(this.response);

