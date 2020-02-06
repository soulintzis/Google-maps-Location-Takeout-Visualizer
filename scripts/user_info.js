getMinTimestamp();
getMaxTimestamp();

async function getUser() {
	const response = await fetch("http://localhost:3000/api/current_user");
	return await response.json();
}

async function getMinTimestamp() {
    const user = await getUser();
	const user_id = user.user_id;
    const url = 'http://localhost:3000/api/location/min_timestamp/' + user_id;
    let xhr = new XMLHttpRequest;
    xhr.open('GET', url, true)

    xhr.onload = function () {

        if (this.status === 200)
        {
            let data = JSON.parse(this.response)
            let from = new Date(data[0].timestampMs).toLocaleDateString("en-US")
            output = '';
            output += '<span>' + from + '</span>';
            document.getElementById('timestamp_from').innerHTML = output;
        }else {
            console.log('error')
        }
    }

    xhr.send()
}

async function getMaxTimestamp() {
    const user = await getUser();
	const user_id = user.user_id;
    const url = 'http://localhost:3000/api/location/max_timestamp/' + user_id;
    let xhr = new XMLHttpRequest;
    xhr.open('GET', url, true)

    xhr.onload = function () {

        if (this.status === 200)
        {
            let data = JSON.parse(this.response)
            let until = new Date(data[0].timestampMs).toLocaleDateString("en-US")
            output = '';
            output += '<span>' + until + '</span>';
            document.getElementById('timestamp_until').innerHTML = output;
        }else {
            console.log('error')
        }
    }

    xhr.send()
}