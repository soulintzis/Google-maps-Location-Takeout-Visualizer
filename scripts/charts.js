var myPieChart = new Chart(ctx, {
    type: 'pie',
    data: data,
    options: options
});


function getData(userID) {
    const url = 'localhost:3000/api/locations/' + userID;
    let xhr = new XMLHttpRequest;
    xhr.open('GET', url, true)

    xhr.onload = function () {

    if (this.status === 200) 
    {
        let data = JSON.parse(this.response)
        console.log(data);
        // console.log(JSON.parse(this.responseText));
        console.log("Hello");
    }else {
        console.log('error')
      }
    }

    xhr.send();
}
