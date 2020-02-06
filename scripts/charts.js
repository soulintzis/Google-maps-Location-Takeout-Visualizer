
// var myPieChart = new Chart(ctx, {
//     type: 'pie',
//     data: data,
//     options: options
// });
parseData();

async function parseDataForEcoScore() {
    const data = await getData()
    let eco_counter = 0, non_eco_counter=0;
    for(let item of data) {
        for(let obj of item.activity) {
            for(let activity of obj.activity){
                if((activity.type === 'WALKING' || activity.type === 'ON_FOOT' || activity.type === 'RUNNING' || activity.type === 'ON_BICYCLE') && activity.confidence > 65){
                    eco_counter = eco_counter + 1; 
                    break;
                } else if((activity.type === 'IN_ROAD_VEHICLE' || activity.type === 'EXITING_VEHICLE' || activity.type === 'IN_RAIL_VEHICLE' || activity.type === 'IN_VEHICLE') && activity.confidence > 65) {
                    non_eco_counter = non_eco_counter + 1; 
                    break;
                } else if ( activity.type === 'STILL' || activity.type === 'TILTING' || activity.type === 'UNKNOWN') {
                    continue;
                }
            }    
        }
    }
    console.log(eco_counter);
    console.log(non_eco_counter);
    console.log(counter1);
    console.log(counter2);
}



async function getData() {
    const response = await fetch('http://localhost:3000/api/locations/' + '71f36dd99aa4d65c111a52587007d4f80b9fd2f531c903c3ecc5ea3c64ae5496')
    return await response.json();

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
}
// const response = await fetch('localhost:3000/api/locations/' + '71f36dd99aa4d65c111a52587007d4f80b9fd2f531c903c3ecc5ea3c64ae5496')
// const data = await response.text();
// console.log(data)