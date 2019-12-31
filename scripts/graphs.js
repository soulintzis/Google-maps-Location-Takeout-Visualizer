var ctx = document.getElementById('eco-score').getContext('2d');
var myPieChart = new Chart(ctx, {
    type: 'pie',
    data: data,
    options: options
});