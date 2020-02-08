// var myPieChart = new Chart(ctx, {
//     type: 'pie',
//     data: data,
//     options: options
// });
// parseDataForEcoScore();

pieChart();


async function pieChart(){
	let results = await getEcoScore();
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
// barChartRecorded();
// async function barChartRecorded(){
// 	let results= await parseRecordedActivities();
// 	var data = results.map(function(e) {
// 		return e.counter;
// 	});
// 	var labels = results.map(function(e) {
// 		return e.type;
// 	 });
// 	const ctx=document.getElementById('graphs').getContext('2d');
// 	let barChartRecorded=new Chart(ctx,{
// 		type:'bar',
// 		options: {
// 			scales: {
// 				yAxes: [{
// 					ticks: {
// 						beginAtZero: true
// 					}
// 				}]
// 			},
// 			title: {
// 				display: true,
// 				position: 'top',
// 				fontSize: 16,
// 				text: 'Number of Records per Activity'
// 			},
// 			legend: {
// 				display: true,
// 				position: 'bottom',
// 			}
// 		},
// 		data:{
// 			datasets: [{
// 				label: [labels],
// 				data: data,
// 				backgroundColor: '#009973',
// 				bordercolorColor: '#000',
// 				borderWidth: 2
// 			}],
// 			labels: labels
// 		}
// 	});
// }

// hourGraph();
// async function hourGraph(){
// 	let results= await getBussiestHour();

// 	const ctx=document.getElementById('graphs').getContext('2d');
// 	let barChartRecorded=new Chart(ctx,{
// 		type:'bar',
// 		options: {
// 			scales: {
// 				scales:{
// 					xAxes: [{
// 						stacked: true
// 					}],
// 					yAxes: [{
// 						stacked: true,
// 						ticks: {
// 							beginAtZero: true
// 						}
// 					}],
// 				}
// 			},
// 			title: {
// 				display: true,
// 				position: 'top',
// 				fontSize: 16,
// 				text: 'Number of Records per Activity'
// 			},
// 			legend: {
// 				display: true,
// 				position: 'bottom',
// 			}
// 		},
// 		data:{
// 			datasets: 	manipulateDateForHourGraph(results),
// 			labels: getHours()
// 		}
// 	});
// }
dayGraph();

async function dayGraph(){
	let results= await getBussiestDay();
	let result = manipulateDateForDayGraph(results);
	const ctx=document.getElementById('graphs').getContext('2d');
	let barChartRecorded=new Chart(ctx,{
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

async function getBussiestHour(){
	const activities = await getActivities();
	let typesOfActivities =[]
	let activity = {
		type: String,
		hours: [{
			hour: Number,
			counter: Number
		}]
	}
	for(let item of activities){
		for(let act of item){
			let timestamp = act.timestampMs;
			let date = new Date(timestamp);
			let hour = date.getHours();
			for(let final_obj of act.activity){
				if (!(
					final_obj.type === "STILL" ||
					final_obj.type === "TILTING" ||
					final_obj.type === "UNKNOWN" ||
					final_obj.type === 'EXITING_VEHICLE'
				) && final_obj.confidence >= 65) {
						if (typesOfActivities.filter(e => e.type === final_obj.type).length > 0) {
							index = typesOfActivities.findIndex(x => x.type === final_obj.type);
							if(typesOfActivities[index].hours.filter(e => e.hour === hour).length > 0) {
								hour_index = typesOfActivities[index].hours.findIndex(x => x.hour === hour);
								typesOfActivities[index].hours[hour_index].counter += 1;
							}else{
								index = typesOfActivities.findIndex(x => x.type === final_obj.type);
								new_hour =	{
									hour: hour,
									counter: 1
								}
								typesOfActivities[index].hours.push(new_hour);
							}
						} else {
							activity = {
								type: final_obj.type,
								hours: [
									{
										hour: hour,
										counter: 1
									}
								]
							}
							typesOfActivities.push(activity);
						}
						break;
				}else {
					continue;
				}
			}			
		}
	}
	return typesOfActivities;
}

getBussiestDay()

async function getBussiestDay(){
	const activities = await getActivities();
	let typesOfActivities =[]
	let activity = {
		type: String,
		days: [{
			day: String,
			counter: Number
		}]
	}
	for(let item of activities){
		for(let act of item){
			let timestamp = act.timestampMs;
			let date = new Date(timestamp);
			let day = date.getDay();
			for(let final_obj of act.activity){
				if (!(
					final_obj.type === "STILL" ||
					final_obj.type === "TILTING" ||
					final_obj.type === "UNKNOWN" ||
					final_obj.type === 'EXITING_VEHICLE'
				) && final_obj.confidence >= 65) {
						if (typesOfActivities.filter(e => e.type === final_obj.type).length > 0) {
							index = typesOfActivities.findIndex(x => x.type === final_obj.type);
							if(typesOfActivities[index].days.filter(e => e.day === day).length > 0) {
								day_index = typesOfActivities[index].days.findIndex(x => x.day === day);
								typesOfActivities[index].days[day_index].counter += 1;
							}else{
								index = typesOfActivities.findIndex(x => x.type === final_obj.type);
								new_day =	{
									day: day,
									counter: 1
								}
								typesOfActivities[index].days.push(new_day);
							}
						} else {
							activity = {
								type: final_obj.type,
								days: [
									{
										day: day,
										counter: 1
									}
								]
							}
							typesOfActivities.push(activity);
						}
						break;
				}else {
					continue;
				}
			}			
		}
	}
	return typesOfActivities;
}

async function parseRecordedActivities(){
	const activities = await getActivities();
	let typesOfActivities =[]
	activity = {
		type: String,
		counter: Number
	}
	for(let item of activities){
		for(let act of item){
			for(let final_obj of act.activity){
				if (!(
					final_obj.type === "STILL" ||
					final_obj.type === "TILTING" ||
					final_obj.type === "UNKNOWN" ||
					final_obj.type === 'EXITING_VEHICLE'
				) && final_obj.confidence >= 65) {
						if (typesOfActivities.filter(e => e.type === final_obj.type).length > 0) {
							index = typesOfActivities.findIndex(x => x.type === final_obj.type);
							typesOfActivities[index].counter += 1;
							console.log(final_obj.confidence)
						} else {
							activity = {
								type: final_obj.type,
								counter: 1
							}
							typesOfActivities.push(activity);
						}
						break;
				}else {
					continue;
				}
			}			
		}
	}
	return typesOfActivities;
}

async function getActivities() {
	const data = await getAllActivities();
	let activities = [];
	for (let item of data) {
		if (item.activity.length !== 0) {
			activities.push(item.activity);
		} else {
			continue;
		}
	}
	return activities;
}

// async function parseActivitiesForEcoScore() {
// 	let activities = await getActivities();
// 	console.log(activities)
// 	let eco_counter = 0,
// 		non_eco_counter = 0;
// 	for (let item of activities) {
// 		for (let activity of item) {
// 			for (let final_obj of activity.activity) {
// 				console.log(final_obj)
// 				if (
// 					(final_obj.type === "WALKING" ||
// 					final_obj.type === "ON_FOOT" ||
// 					final_obj.type === "RUNNING" ||
// 					final_obj.type === "ON_BICYCLE") &&
// 					final_obj.confidence > 65
// 				) {
// 					eco_counter = eco_counter + 1;
// 					break;
// 				} else if (
// 					(final_obj.type === "IN_ROAD_VEHICLE" ||
// 						final_obj.type === "EXITING_VEHICLE" ||
// 						final_obj.type === "IN_RAIL_VEHICLE" ||
// 						final_obj.type === "IN_VEHICLE") &&
// 					final_obj.confidence > 65
// 				) {
// 					non_eco_counter = non_eco_counter + 1;
// 					break;
// 				} else if (
// 					final_obj.type === "STILL" ||
// 					final_obj.type === "TILTING" ||
// 					final_obj.type === "UNKNOWN"
// 				) {
// 					continue;
// 				}
// 			}
// 		}
// 	}

// 	console.log(eco_counter, non_eco_counter);
// 	return {
// 		eco_counter,
// 		non_eco_counter
// 	};
// }


async function getCurrentMonthActivities() {
	const user = await getUser();
	const user_id = user.user_id;
	const response = await fetch(
		"http://localhost:3000/api/locations/current_month/" + user_id
	);
	return await response.json();
}

async function getAllActivities() {
	const user = await getUser();
	const user_id = user.user_id;
	const response = await fetch(
		"http://localhost:3000/api/locations/" + user_id
	);
	return await response.json();
}

async function getEcoScore() {  
	const user = await getUser();
	const user_id = user.user_id;
	const response = await fetch(
		"http://localhost:3000/api/locations/get_eco_score/" + user_id
	);
	return await response.json();
}

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

async function getUser() {
	const response = await fetch("http://localhost:3000/api/current_user");
	return await response.json();
}