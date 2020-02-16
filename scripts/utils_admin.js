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
  const url = "http://localhost:3000/admin_api/export_to_json";
    let xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
  
    xhr.onload = function() {
      if (this.status === 200) {
        console.log("Data exported successfully")
      } else {
        console.log("error");
      }
    };
    xhr.send();
}
e