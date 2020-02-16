let dayG = null, userG = null, activityG = null, hourG = null, monthG = null, yearG = null;

window.onload = function() {
  getActivitiesDistribution();
  getRecordDistributionPerUser();
  getRecordDistributionPerDay();
  getRecordDistributionPerHour();
  getRecordDistributionPerMonth();
  getRecordDistributionPerYear();
};

function refreshGraphs() {
  getActivitiesDistribution();
  getRecordDistributionPerUser();
  getRecordDistributionPerDay();
  getRecordDistributionPerHour();
  getRecordDistributionPerMonth();
  getRecordDistributionPerYear();
}


function deleteData(){
    const url = "http://localhost:3000/admin_api/delete_data";
    let xhr = new XMLHttpRequest();
    xhr.open("DELETE", url, true);
  
    xhr.onload = function() {
      if (this.status === 200) {

      } else {
        console.log("error");
      }
    };
  
    xhr.send();
}
// function exportToJsonFile() {
//   const url = "http://localhost:3000/admin_api/download";
//   let xhr = new XMLHttpRequest();
//   xhr.open("EXPORT",url,true);
//   xhr.onload = function(){
//   let dataStr = JSON.stringify(fileName);
//   let dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);

//   let exportFileDefaultName = 'data.json';

//   let linkElement = document.createElement('a');
//   linkElement.setAttribute('href', dataUri);
//   linkElement.setAttribute('download', exportFileDefaultName);
//   linkElement.click();
// }
// }
function getActivitiesDistribution() {
  // document.getElementById("loading-img").style.display = "block";
  // from = getDateFrom();
  // until = getDateUntil();
  const url = "http://localhost:3000/admin_api/records_per_type";
  let xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);

  xhr.onload = function() {
    if (this.status === 200) {
      activityChart(JSON.parse(this.responseText));
    } else {
      console.log("error");
    }
  };

  xhr.send();
}

function getRecordDistributionPerUser() {
  // document.getElementById("loading-img").style.display = "block";
  // from = getDateFrom();
  // until = getDateUntil();
  const url = "http://localhost:3000/admin_api/records_per_user";
  let xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);
  xhr.onload = function() {
    if (this.status === 200) {
      userChart(JSON.parse(this.responseText));
      // dayGraph(JSON.parse(this.responseText));
      // document.getElementById("loading-img").style.display = "none";
    } else {
      console.log("error");
    }
  };
  xhr.send();
}

function getRecordDistributionPerMonth() {
  // document.getElementById("loading-img").style.display = "block";
  // from = getDateFrom();
  // until = getDateUntil();
  const url = "http://localhost:3000/admin_api/records_per_month";
  let xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);

  xhr.onload = function() {
    if (this.status === 200) {
      monthChart(JSON.parse(this.responseText));
      // document.getElementById("loading-img").style.display = "none";
    } else {
      console.log("error");
    }
  };

  xhr.send();
}

function getRecordDistributionPerDay() {
  // document.getElementById("loading-img").style.display = "block";
  // from = getDateFrom();
  // until = getDateUntil();
  const url = "http://localhost:3000/admin_api/records_per_day";
  let xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);

  xhr.onload = function() {
    if (this.status === 200) {
      dayChart(JSON.parse(this.responseText));
      // document.getElementById("loading-img").style.display = "none";
    } else {
      console.log("error");
    }
  };

  xhr.send();
}

function getRecordDistributionPerHour() {
  // document.getElementById("loading-img").style.display = "block";
  // from = getDateFrom();
  // until = getDateUntil();
  const url = "http://localhost:3000/admin_api/records_per_hour";
  let xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);

  xhr.onload = function() {
    if (this.status === 200) {
      hourChart(JSON.parse(this.responseText));
      // document.getElementById("loading-img").style.display = "none";
    } else {
      console.log("error");
    }
  };

  xhr.send();
}

function getRecordDistributionPerYear() {
  // document.getElementById("loading-img").style.display = "block";
  // from = getDateFrom();
  // until = getDateUntil();
  const url = "http://localhost:3000/admin_api/records_per_year";
  let xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);

  xhr.onload = function() {
    if (this.status === 200) {
      yearChart(JSON.parse(this.responseText));
      // document.getElementById("loading-img").style.display = "none";
    } else {
      console.log("error");
    }
  };

  xhr.send();
}

function userChart(results) {
  let names = [],
    counters = [],
    colors = [];
  for (let item of results) {
    names.push(item._id);
    counters.push(item.counter);
    colors.push(getRandomColor());
    console.log(names, counters, colors);
  }
  if(userG !== null){ 
		userG.destroy();
	}
  const ctx = document.getElementById("userGraph").getContext("2d");
  userG = new Chart(ctx, {
    type: "doughnut",
    options: {
      title: {
        display: true,
        position: "top",
        fontSize: 20,
        text: "Number of records per User"
      },
      legend: {
        display: true,
        position: "bottom",
        fontSize: 20
      },
      responsive: true,
      maintainAspectRatio: true
    },
    data: {
      datasets: [
        {
          label: names,
          data: counters,
          backgroundColor: colors,
          borderColor: colors,
          borderWidth: 1,
          position: top
        }
      ],
      labels: names
    }
  });
}

function activityChart(results) {
  let activity = [],
    counters = [],
    colors = [];
  for (let item of results) {
    activity.push(item._id);
    counters.push(item.counter);
    colors.push(getRandomColor());
  }
  if(activityG !== null){ 
		activityG.destroy();
	}
  const ctx = document.getElementById("activityGraph").getContext("2d");
  activityG = new Chart(ctx, {
    type: "doughnut",
    options: {
      title: {
        display: true,
        position: "top",
        fontSize: 20,
        text: "Number of records per Activity"
      },
      legend: {
        display: true,
        position: "bottom",
        fontSize: 20
      },
      responsive: true
    },
    data: {
      datasets: [
        {
          label: activity,
          data: counters,
          backgroundColor: colors,
          borderColor: colors,
          borderWidth: 1,
          position: top
        }
      ],
      labels: activity
    }
  });
}

function monthChart(results) {
  let month = [],
  counter = [];
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
  for (let item of results) {
    month.push(item._id);
    counter.push(item.counter);
  }
  if(monthG !== null){ 
		monthG.destroy();
  }
  for(let i=0; i<month.length; i++){
    for(let y=i; y<month.length; y++){
      if(month[y]<month[i]){
        let temp = month[y]
        month[y] = month[i];
        month[i] = temp;
        temp = counter[y];
        counter[y] = counter[i];
        counter[i] = temp
      }
    }
  }
  let months=[] , records = [];
  for(let i =1;i<=12; i++){
    if(month.includes(i)){
      months.push(month_names[i-1])
      records.push(counter[i-1]);
    }else{
      months.push(month_names[i-1])
      records.push(0);
    }
  }
  const ctx = document.getElementById("monthGraph").getContext("2d");
  monthG = new Chart(ctx, {
    type: "line",
    options: {
      title: {
        display: true,
        position: "top",
        fontSize: 20,
        text: "Number of records per Month"
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
      datasets: [
        {
          data: records,
          borderColor: "#007acc",
          borderWidth: 2,
          position: top
        }
      ],
      labels: month_names
    }
  });
}


function dayChart(results) {
  let day = [],
  counter = [];
  for (let item of results) {
    day.push(item._id);
    counter.push(item.counter);
  }
  if(dayG !== null){ 
		dayG.destroy();
  }
  let day_names = [
    "Sun",
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat"    
  ];
  for (let item of results) {
    day.push(item._id);
    counter.push(item.counter);
  }
  if(dayG !== null){ 
		dayG.destroy();
  }
  for(let i=0; i<day.length; i++){
    for(let y=i; y<day.length; y++){
      if(day[y]<day[i]){
        let temp = day[y]
        day[y] = day[i];
        day[i] = temp;
        temp = counter[y];
        counter[y] = counter[i];
        counter[i] = temp
      }
    }
  }
  let days=[] , records = [];
  for(let i =1;i<=7; i++){
    if(day.includes(i)){
      days.push(day_names[i-1])
      records.push(counter[i-1]);
    }else{
      days.push(day_names[i-1])
      records.push(0);
    }
  }
  const ctx = document.getElementById("dayGraph").getContext("2d");
  dayG = new Chart(ctx, {
    type: "line",
    options: {
      title: {
        display: true,
        position: "top",
        fontSize: 20,
        text: "Number of records per Day"
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
      datasets: [
        {
          data: counter,
          borderColor: "#007acc",
          borderWidth: 2,
          position: top
        }
      ],
      labels: day_names
    }
  });
}

function hourChart(results) {
  let hour = [],
  counter = [];
  let hours_names=getHours();
  for (let item of results) {
    hour.push(item._id);
    counter.push(item.counter);
  }
  if(hourG !== null){ 
		hourG.destroy();
  }
  for(let i=0; i<hour.length; i++){
    for(let y=i; y<hour.length; y++){
      if(hour[y]<hour[i]){
        let temp = hour[y]
        hour[y] = hour[i];
        hour[i] = temp;
        temp = counter[y];
        counter[y] = counter[i];
        counter[i] = temp
      }
    }
  }
  let hours=[] , records = [];
  for(let i =1;i<=24; i++){
    if(hour.includes(i)){
      hours.push(hours_names[i-1])
      records.push(counter[i-1]);
    }else{
      hours.push(hours_names[i-1])
      records.push(0);
    }
  }
  const ctx = document.getElementById("hourGraph").getContext("2d");
  hourG = new Chart(ctx, {
    type: "line",
    options: {
      title: {
        display: true,
        position: "top",
        fontSize: 20,
        text: "Number of records per Hour"
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
      datasets: [
        {
          data: counter,
          borderColor: "#007acc",
          borderWidth: 2,
          position: top
        }
      ],
      labels: hours_names
    }
  });
}

function yearChart(results) {
  let year = [],
  counter = [];
  let years_names=[];
  let years=[] , records = [];
  for (let item of results) {
    year.push(item._id);
    counter.push(item.counter);
  }
  if(yearG !== null){ 
		yearG.destroy();
  }

for(let i=0; i<year.length; i++){
  for(let y=i; y<year.length; y++){
    if(year[y]<year[i]){
      let temp = year[y]
      year[y] = year[i];
      year[i] = temp;
      temp = counter[y];
      counter[y] = counter[i];
      counter[i] = temp
    }
  }
}
const ctx = document.getElementById("yearGraph").getContext("2d");
  yearG = new Chart(ctx, {
    type: "line",
    options: {
      title: {
        display: true,
        position: "top",
        fontSize: 20,
        text: "Number of records per Year"
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
      datasets: [
        {
          data:counter,
          borderColor: "#007acc",
          borderWidth: 2,
          position: top
        }
      ],
      labels:year
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

function getRandomColor() {
	var letters = '0123456789ABCDEF';
	var color = '#';
	for (var i = 0; i < 6; i++) {
	  color += letters[Math.floor(Math.random() * 16)];
	}
	return color;
}
