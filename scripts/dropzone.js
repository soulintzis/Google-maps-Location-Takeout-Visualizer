// (function() {
//     let dropzone = document.getElementById('dropzone');

//     function upload(file){
//         const xhr = new XMLHttpRequest();
              
        
//         // xhr.onload = function () { 
//         //     let data = this.responseText;
//         // }
//         xhr.open("post", "/upload", true);
//         xhr.setRequestHeader("Content-Type", "multipart/form-data");
//         xhr.send(new FormData(file));
//     };

//     dropzone.ondrop = function(e) {
//         e.preventDefault();
//         this.className = 'dropzone';
//         if(e.dataTransfer.files.length !== 1){
//             alert("Please upload one file at a time")
//         }else{
//             upload(e.dataTransfer.files);
//         }
//     };
//     dropzone.ondragover = function() {
//         this.className = 'dropzone dragover';
//         return false;
//     };

//     dropzone.ondragleave = function() {
//         this.className = 'dropzone';
//         return false;
//     };
// }());

var dropFileForm = document.getElementById("dropFileForm");
var fileLabelText = document.getElementById("fileLabelText");
var uploadStatus = document.getElementById("uploadStatus");
var fileInput = document.getElementById("fileInput");
var droppedFiles;

function overrideDefault(event) {
  event.preventDefault();
  event.stopPropagation();
}

function fileHover() {
  dropFileForm.classList.add("fileHover");
}

function fileHoverEnd() {
  dropFileForm.classList.remove("fileHover");
}

function addFiles(event) {
  droppedFiles = event.target.files || event.dataTransfer.files;
  showFiles(droppedFiles);
}

function showFiles(files) {
    fileLabelText.innerText = files[0].name;
}

function uploadFiles(event) {
    event.preventDefault();
    var formData = new FormData();

    file = droppedFiles[0];
    formData.append(fileInput.name, file, file.name);

    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function(data) {
        //handle server response and change status of
        //upload process via changeStatus(text)
        console.log(xhr.response);
    };
    xhr.open(dropFileForm.method, dropFileForm.action, true);
    xhr.send(formData);
}

function changeStatus(text) {
  uploadStatus.innerText = text;
}