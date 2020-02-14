let charts = null;
let date_from = null;
let date_until = null;

getEcoScoreForYear();

getEcoScore()
function typesGraph(results){
	let types = [], counters = [];
	for(let item of results) {
		types.push(item._id);
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
			maintainAspectRatio: false,
			title: {
				display: true,
				position: 'top',
				fontSize: 16,
				text: 'Records per Activity'
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
			maintainAspectRatio: false,
			title: {
				display: true,
				position: 'top',
				fontSize: 16,
				text: 'Records per Activity'
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
	if(charts !== null){ 
		charts.destroy();
	}
	let result = manipulateDateForDayGraph(results);
	const ctx=document.getElementById('graphs').getContext('2d');
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
			maintainAspectRatio: false,
			title: {
				display: true,
				position: 'top',
				fontSize: 16,
				text: 'Records per Activity'
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
			console.log(JSON.parse(this.responseText));
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
     const url = "http://localhost:3000/api/locations/get_eco_score";
    let xhr = new XMLHttpRequest;
    xhr.open('GET', url, true)

    xhr.onload = function () {
        if (this.status === 200)
        {
			console.log(JSON.parse(this.responseText))
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
    const url = 'http://localhost:3000/api/' + from + '/' + until +  '/get_busiest_day_of_the_week';
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



function manipulateDateForHourGraph(result) {
	let busiestHours =[]
	console.log(result)
	for(let item of result){
		if (busiestHours.filter(e => e.type === item._id.type).length > 0) {
			index = busiestHours.findIndex(x => x.type === item._id.type);
			let new_hour =	{
				hour: item._id.hour,
				counter: item.counter
			};
			busiestHours[index].hours.push(new_hour);
		}else{
			let new_type = {
				type: item._id.type,
				hours: [
					{
						hour: item._id.hour,
						counter: item.counter
					}
				]
			};
			busiestHours.push(new_type)		
		}
	}
	console.log(busiestHours)
	let data = busiestHours.map(function(e) {
		return e.hours;
	});
	let labels = busiestHours.map(function(e) {
		return e.type;
	});
	console.log(data, labels)
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
	console.log(display_data)
	return display_data;
}

function manipulateDateForDayGraph(result) {
	let busiestDays =[]

	for(let item of result){
		if (busiestDays.filter(e => e.type === item._id.type).length > 0) {
			index = busiestDays.findIndex(x => x.type === item._id.type);
			new_day =	{
				day: item._id.day,
				counter: item.counter
			};
			busiestDays[index].days.push(new_day);
		}else{
			let new_type = {
				type: item._id.type,
				days: [
					{
						day: item._id.day,
						counter: item.counter
					}
				]
			};
			busiestDays.push(new_type)		
		}
	}
	let data = busiestDays.map(function(e) {
		return e.days;
	});

	let activity_labels = busiestDays.map(function(e) {
		return e.type;
	});
	let labels = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
	display_data = []
	for(j = 0; j < data.length; j++) {
		let days = [];
		for(i = 1; i <= 7; i++) {
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

function pieChart(results){
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
		maintainAspectRatio: false,
		legend: {
			display: true,
			position: 'bottom'
		},
		responsive: true,
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

function getEcoScoreForYear() {
	const url = 'http://localhost:3000/api/locations/get_eco_score_for_a_year';
    let xhr = new XMLHttpRequest;
    xhr.open('GET', url, true)

    xhr.onload = function () {

        if (this.status === 200)
        {
			ecoScoreChart(JSON.parse(this.responseText));
		}else {
            console.log('error');
        }
    }

    xhr.send()
}


function ecoScoreChart(results) {
	let month_names = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "June",
        "July",
        "Aug",
        "Sept",
        "Oct",
        "Nov",
        "Dec"
      ];
	const ctx = document.getElementById("eco_score_year_graph").getContext("2d");
	chart = new Chart(ctx, {
	  type: "line",
	  options: {
		title: {
		  display: true,
		  position: "top",
		  fontSize: 20,
		  text: "Annual user's eco-score"
		},
		legend: {
		  display: false
	  },
	  tooltips: {
		  callbacks: {
			 label: function(tooltipItem) {
					return tooltipItem.yLabel;
			 }
		  }
	  },
		responsive: true
	  },
	  data: {
		datasets: results,
		labels: month_names
	  }
	});
  }