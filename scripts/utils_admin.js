function deleteData(){
    let conf = confirm("Are you sure this action is permanent!");
    if(conf === true) {
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
}

function exportData(){
  document.getElementById("loading-export").style.display = "block";
  const url = "http://localhost:3000/admin_api/export_to_json";
    let xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
  
    xhr.onload = function() {
      if (this.status === 200) {
        console.log("Data exported successfully")
        let data = this.response
        console.log(data)
        let output = '<a href="' + data + '" download="export_data.json"> Download Link</a> '
        document.getElementById("loading-export").style.display = "none";
        document.getElementById('download-link').innerHTML = output;
      } else {
        console.log("error");
      }
    };
    xhr.send();
}
