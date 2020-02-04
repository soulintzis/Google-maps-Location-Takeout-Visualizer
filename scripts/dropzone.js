const dropFileForm = document.getElementById("dropFileForm");
const fileLabelText = document.getElementById("fileLabelText");
const uploadStatus = document.getElementById("uploadStatus");
const fileInput = document.getElementById("fileInput");
let droppedFiles;

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
    if(typeof(droppedFiles) != "undefined"){
      file = droppedFiles[0];
      changeStatus("Uploading...");
      var formData = new FormData();
        formData.append(fileInput.name, file, file.name);

        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function(data) {
          console.log(this.readyState)
            if(this.readyState == 4 && this.status == 200){
                changeStatus("The file uploaded successfully...");
            }
        };
        xhr.open(dropFileForm.method, dropFileForm.action, true);
        xhr.send(formData);
    }
}

function changeStatus(text) {
  uploadStatus.innerText = text;
}
