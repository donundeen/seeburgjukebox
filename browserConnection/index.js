// see https://socket.io/
import { Server } from "socket.io";


import { createRequire } from "module";
const require = createRequire(import.meta.url);
const config = require("../mac_osascript_udp/config.json");

const { exec } = require("child_process");


var PORT = config.osc.port;
var HOST = config.osc.host;

var hsldata = {"on":true,"hue":43690,"bri":254,"sat":254,"transitiontime":10};


const io = new Server({cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }});


var broadcastRoomName = "1880broadcast";


io.on("connection", (socket) => {
	console.log(socket.id);
	socket.join(broadcastRoomName);
    socket.on("private message", (msg) => {
    	console.log("got message " + msg );
    	socket.emit("tell you", "thanks for that");
//      socket.to(anotherSocketId).emit("private message", socket.id, msg);
    });	
    socket.on("hsb", (msg) => {
        console.log("hsb " + msg );
        if(msg == "off"){
            allLightsOff();
        }else{
            setLightsHSB (msg);
        }       
    });     
  // ...
});

io.listen(9003);




function allLightsOff(){
    setLightOff(1);
    setLightOff(2);
}

function setLightsHSB(lightvalue){
    // set color on the philips hue lights
    console.log("setLights " + lightvalue);
    var split = lightvalue.split(",");
    if(split.length != 4){
        console.log("bad value " + lightvalue + "  need hue,saturation,brightness,transitiontime");
        return;
    }
    var hue = parseInt(split[0]);
    var sat = parseInt(split[1]);
    var bri = parseInt(split[2]);
    var trans = parseInt(split[3]);
    setHSB(1, hue, sat, bri, trans);
    setHSB(2, hue, sat, bri, trans);

}



//// HUE CONTROL FUNCTIONS

function setLightOff(bulb){
    hsldata.on = false;
    var jsonstring = JSON.stringify(hsldata);
    console.log(jsonstring);    
    execute('PUT', 'http://'+config.hue.bridge+'/api/'+config.hue.hash+'/lights/'+bulb+'/state',"'"+jsonstring+"'");
}


function setHSB(bulb,hcolor,satn,brt,tran) {
    // hcolor: 0-10000
    // brt : 0-200
    // satn: 0-250
    hsldata.on = true;
    hsldata.hue = hcolor;
    hsldata.bri = brt;
    hsldata.sat = satn;
    hsldata.transitiontime = tran;

    var jsonstring = JSON.stringify(hsldata);
    console.log(jsonstring);
    
    execute('PUT', 'http://'+config.hue.bridge+'/api/'+config.hue.hash+'/lights/'+bulb+'/state',"'"+jsonstring+"'");
}



function execute($method,$url,$message, callback){

//outlet(0,"curl", "--request",$method,"--data",$message,$url);
    if($message){
        var command = "curl --request "+$method + " --data " + $message + " " + $url ;
    }else{
        var command = "curl --request "+$method + " " + $url ;

    }
    console.log(command);
    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
        }
        console.log(`stdout: ${stdout}`);
        if(callback){
            callback(stdout);
        }
    });

}

