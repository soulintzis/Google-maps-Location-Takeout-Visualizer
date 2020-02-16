getMinTimestamp();
getMaxTimestamp();

async function getMinTimestamp() {
    const url = 'http://localhost:3000/api/min_date';
    let xhr = new XMLHttpRequest;
    xhr.open('GET', url, true)

    xhr.onload = function () {

        if (this.status === 200)
        {
            let data = JSON.parse(this.response)
            output = '';
            output += '<span>' + data + '</span>';
            document.getElementById('timestamp_from').innerHTML = output;
        }else {
            output = '';
            output += '<span>' + 'NaN' + '</span>';
            document.getElementById('timestamp_from').innerHTML = output;
        }
    }

    xhr.send()
}

async function getMaxTimestamp() {
    const url = 'http://localhost:3000/api/max_date';
    let xhr = new XMLHttpRequest;
    xhr.open('GET', url, true)

    xhr.onload = function () {

        if (this.status === 200)
        {
            let data = JSON.parse(this.response)
            output = '';
            output += '<span>' + data + '</span>';
            document.getElementById('timestamp_until').innerHTML = output;
        }else {
            console.log('error')
        }
    }

    xhr.send()
}
getLeaderBoard()
async function getLeaderBoard() {
    const url = 'http://localhost:3000/api/leaderboard';
    let xhr = new XMLHttpRequest;
    xhr.open('GET', url, true)

    xhr.onload = function () {

        if (this.status === 200)
        {
            let data = JSON.parse(this.response)
            console.log(data);
            output = '<table>' +
                        '<tr>' +
                            '<th>' + 'Ranking' + '</th>' +
                            '<th>' + 'Short Username' + '</th>'+
                            '<th>' + 'Eco-score' + '</th>'
                        '</tr>';
            for(let i = 1; i <= data.length; i++) {
                    output +=  '<tr>' +
                                    '<td>' + i + '. ' + '</td>' 
                                + '<td>' + data[i-1].username.substr(0, 5) + '...' + '</td>' 
                                + '<td>' + data[i-1].eco_score  + '</td>' 
                                + '</tr>';
                    if(i > 3) {
                        break;
                    }
            }
            output += '</table>'
            console.log(output)
            document.getElementById('leaderBoard').innerHTML = output;
        }else {
            console.log('error')
        }
    }

    xhr.send()
}