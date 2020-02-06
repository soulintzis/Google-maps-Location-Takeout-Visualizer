// var myPieChart = new Chart(ctx, {
//     type: 'pie',
//     data: data,
//     options: options
// });
// parseDataForEcoScore();

var ctx = document.getElementById('eco-score').getContext('2d');
var pieChart = new Chart(ctx, {
	type: 'pie',
    data: {
		datasets: [{
			data: [eco_counter,non_eco_counter]
		}],
		labels:["Eco Behavior","Non Eco Behavior"]
	}
});

parseActivitiesForEcoScore();

async function getActivities() {
	const data = await getCurrentMonthActivities();
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

async function parseActivitiesForEcoScore() {
	let activities = await getActivities();
	let eco_counter = 0,
		non_eco_counter = 0;
	for (let item of activities) {
		for (let activity of item) {
			for (let final_obj of activity.activity) {
				console.log(final_obj)
				if (
					(final_obj.type === "WALKING" ||
					final_obj.type === "ON_FOOT" ||
					final_obj.type === "RUNNING" ||
					final_obj.type === "ON_BICYCLE") &&
					final_obj.confidence > 65
				) {
					eco_counter = eco_counter + 1;
					break;
				} else if (
					(final_obj.type === "IN_ROAD_VEHICLE" ||
						final_obj.type === "EXITING_VEHICLE" ||
						final_obj.type === "IN_RAIL_VEHICLE" ||
						final_obj.type === "IN_VEHICLE") &&
					final_obj.confidence > 65
				) {
					non_eco_counter = non_eco_counter + 1;
					break;
				} else if (
					final_obj.type === "STILL" ||
					final_obj.type === "TILTING" ||
					final_obj.type === "UNKNOWN"
				) {
					continue;
				}
			}
		}
	}

	console.log(eco_counter, non_eco_counter);
	return {
		eco_counter,
		non_eco_counter
	};
}


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