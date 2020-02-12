// getActivitiesDistribution();
// getRecordDistributionPerUser();
// getRecordDistributionPerDay();
// getRecordDistributionPerHour();
// getRecordDistributionPerMonth();
// getRecordDistributionPerYear();
function deleteData(){
  console.log("Deleted");
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
      console.log(this.responseText);
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
      console.log(this.responseText);
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
      // console.log(this.responseText);
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
      // console.log(this.responseText);
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
      // console.log(this.responseText);
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
      console.log(this.responseText);
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
    names.push(item.username);
    counters.push(item.num_of_docs);
    colors.push(getRandomColor());
    console.log(names, counters, colors);
  }
  const ctx = document.getElementById("graphs").getContext("2d");
  let chart = new Chart(ctx, {
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
      responsive: true
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
    activity.push(item.type);
    counters.push(item.counter);
    colors.push(getRandomColor());
  }
  const ctx = document.getElementById("graphs").getContext("2d");
  let chart = new Chart(ctx, {
    type: "pie",
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
    month.push(item.month_name);
    counter.push(item.count);
  }
  const ctx = document.getElementById("graphs").getContext("2d");
  let chart = new Chart(ctx, {
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
    day.push(item.day_name);
    counter.push(item.count);
  }
  const ctx = document.getElementById("graphs").getContext("2d");
  let chart = new Chart(ctx, {
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
      labels: day
    }
  });
}

function hourChart(results) {
  let hour = [],
  counter = [];
  for (let item of results) {
    hour.push(item.hour);
    counter.push(item.count);
  }
  const ctx = document.getElementById("graphs").getContext("2d");
  let chart = new Chart(ctx, {
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
      labels: hour
    }
  });
}

function yearChart(results) {
  let year = [],
  counter = [];
  for (let item of results) {
    year.push(item.year);
    counter.push(item.count);
  }
  const ctx = document.getElementById("graphs").getContext("2d");
  let chart = new Chart(ctx, {
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
      labels: year
    }
  });
}