let width = window.matchMedia("(max-width: 600px)");

function openNav() {
  if(width.matches) {
    document.getElementById("mySidebar").style.width = "40vw";
    document.getElementById("nav_btn").style.display = "none";

  }else{
    document.getElementById("mySidebar").style.width = "20vw";
    document.getElementById("nav_btn").style.display = "none";
  }
  //document.getElementById("main").style.marginLeft = "40vw";
}

function closeNav() {
  document.getElementById("mySidebar").style.width = "0";
  document.getElementById("main").style.marginLeft= "0";
  document.getElementById("nav_btn").style.display = "block";
}