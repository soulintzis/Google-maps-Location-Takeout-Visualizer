curr_date();

function curr_date() {
    let from = document.getElementById("from_date");
    let until = document.getElementById("until_date");
    let today = new Date();
    from.value = today.toISOString().substr(0, 10);
    until.value = today.toISOString().substr(0, 10);

}