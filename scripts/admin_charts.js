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

function getRandomColor() {
	var letters = '0123456789ABCDEF';
	var color = '#';
	for (var i = 0; i < 6; i++) {
	  color += letters[Math.floor(Math.random() * 16)];
	}
	return color;
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
      // document.getElementById("loading-img").style.display = "none";
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
  for (let item of results) {
    month.push(item._id);
    counter.push(item.counter);
  }
  if(monthG !== null){ 
		monthG.destroy();
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
          data: counter,
          borderColor: "#007acc",
          borderWidth: 2,
          position: top
        }
      ],
      labels: month
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
      labels: day
    }
  });
}

function hourChart(results) {
  let hour = [],
  counter = [];
  for (let item of results) {
    hour.push(item._id);
    counter.push(item.counter);
  }
  if(hourG !== null){ 
		hourG.destroy();
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
      labels: hour
    }
  });
}

function yearChart(results) {
  let year = [],
  counter = [];
  for (let item of results) {
    year.push(item._id);
    counter.push(item.counter);
  }
  if(yearG !== null){ 
		yearG.destroy();
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
          data: counter,
          borderColor: "#007acc",
          borderWidth: 2,
          position: top
        }
      ],
      labels: year
    }
  });
}