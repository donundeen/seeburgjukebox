// Importing the http module
//const http = require("http")

import { createRequire } from "module";
const require = createRequire(import.meta.url);
const http = require("http");
  
var fs = require('fs');
  


// Creating server 
const server = http.createServer((req, res) => {
    // Sending the response
    // Use fs.readFile() method to read the file
    console.log(req.url);
    var filename = req.url.replace(/^\//,"");
    console.log(filename);

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");    

    fs.readFile(filename, 'utf8', function(err, data){
        // Display the file content
        console.log("error ? " + err);
        if(!err){
            res.write(data)
            res.end(); 
        }else{
            res.end();
        } 
    });

})
  
// Server listening to port 3000
server.listen((80), () => {
    console.log("Server is Running");
})