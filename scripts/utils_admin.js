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