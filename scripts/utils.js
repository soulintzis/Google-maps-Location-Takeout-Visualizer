let width = window.matchMedia("(max-width: 600px)");



window.onload = function() {
	curr_date();
};

function openNav() {
  if(width.matches) {
    document.getElementById("mySidebar").style.width = "40vw";
    document.getElementById("nav_btn").style.display = "none";

  }else{
    document.getElementById("mySidebar").style.width = "20vw";
    document.getElementById("nav_btn").style.display = "none";
  }
}

function closeNav() {
  document.getElementById("mySidebar").style.width = "0";
  document.getElementById("main").style.marginLeft= "0";
  document.getElementById("nav_btn").style.display = "block";
}

function curr_date() {
  let from = document.getElementById("from_date");
  let until = document.getElementById("until_date");
  let today = new Date();
  until.value = today.toISOString().substr(0, 10);
today.setFullYear(today.getFullYear() - 1);
from.value = today.toISOString().substr(0, 10);
}