var express = require("express"),
    upload_on_server = express(),
    http = require("http").Server(upload_on_server).listen(80),
    upload = require("express-fileupload");
upload_on_server.use(upload())

console.log("Server Started")
upload_on_server.get("/",function(req,res){
    res.sendFile(__dirname+"/upload.html");

})
upload_on_server.post("/",function(req,res){
    if(req.files){
         var file = req.files.filename,
             filename = file.name;
         file.mv("./upload"+filename,function(err){
             if(err){
                 console.log(err);
                 res.send("Error occured");
             }else{
                 res.send("Completed");
             }
         })
    }
})