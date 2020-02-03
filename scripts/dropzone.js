(function() {
    let dropzone = document.getElementById('dropzone');

    function upload(file){
        const xhr = new XMLHttpRequest();
              
        
        // xhr.onload = function () { 
        //     let data = this.responseText;
        // }
        xhr.open("post", "/upload", true);
        xhr.setRequestHeader("Content-Type", "multipart/form-data");
        xhr.send(new FormData(file));
    };

    dropzone.ondrop = function(e) {
        e.preventDefault();
        this.className = 'dropzone';
        if(e.dataTransfer.files.length !== 1){
            alert("Please upload one file at a time")
        }else{
            upload(e.dataTransfer.files);
        }
    };
    dropzone.ondragover = function() {
        this.className = 'dropzone dragover';
        return false;
    };

    dropzone.ondragleave = function() {
        this.className = 'dropzone';
        return false;
    };
}());