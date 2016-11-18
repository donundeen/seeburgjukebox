// placeholder for the work i'll do getting node and arduino to talk:
// https://github.com/voodootikigod/node-serialport
//
var fs = require("fs");

var Mopidy = require("mopidy");

var mopidy = new Mopidy({
    webSocketUrl : "ws://127.0.0.1:6680/mopidy/ws/",
    callingConvention : "by-position-or-name"
});

console.log("got mopidy");
console.log(mopidy);

var promise = mopidy.tracklist.add({'uri': "spotify:track:3EKx19nFwUt3uIyz9USG6e"});
promise.then(function(data){
    console.log("track added");
    console.log(data);
    mopidy.playback.play({}).then(function(data){
	console.log("playing");
	console.log(data);
    });
});

var displayResult = function(result) {
    console.log(JSON.stringify(result, null, 2));
};

var files = fs.readdirSync("/dev");
var portname = false;
files.forEach(function(filename){
  if(filename.match(/^ttyACM[0-9]/)){
    portname = "/dev/"+ filename;
    console.log("port is " + portname);
  }  
});

if(!portname){
  console.log("don't have an arduino to listen to!");
  process.exit(1);
}

var serialport = require("serialport");
var SerialPort  = serialport.SerialPort;
var serialPort = new SerialPort(portname, {
  baudrate: 9600,
  parser: serialport.parsers.readline("\n") 
});



  serialPort.on("open", function () {
    console.log('open');
    serialPort.on('data', function(data) {
    	data = data.toString().trim();
    	var done = false;
      if(data != ""){
  	 //   console.log('data received: ' + data);
  	    if(/^[A-K][0-9]+$/.test(data)){
  	    	fullMessage = data;
  	    	done = true;
  	    	waitingOnNumber = false;
  	    }else{
  	    	console.log("don't understand " + data);
  	    }
  	    if(done){
  	   // 	console.log("final signal" + fullMessage);
  	    	done = false;
  	    	processMessage(fullMessage.toUpperCase());
  		  } 
      }
    });  
    serialPort.write("ls\n", function(err, results) {
      console.log('err ' + err);
      console.log('results ' + results);
    });  
  });



function processMessage(command){
	console.log("going to process command : " + command);
  switch(command){
  case "A1":
      
      break;
    case "A2":
      break;
    case "A3":
      break;
    case "A4":
      break;
    case "A5":
      break;
    case "A6":
      break;
    case "A7":
      break;
    case "A8":
      break;
    case "A9":
      break;
    case "A10":
      break;
    case "B1":
      break;
    case "B2":
      break;
    case "B3":
      break;
    case "B4":
      break;
    case "B5":
      break;
    case "B6":
      break;
    case "B7":
      break;
    case "B8":
      break;
    case "B9":
      break;
    case "B10":
      break;
    case "C1":
      break;
    case "C2":
      break;
    case "C3":
      break;
    case "C4":
      break;
    case "C5":
      break;
    case "C6":
      break;
    case "C7":
      break;
    case "C8":
      break;
    case "C9":
      break;
    case "C10":
      break;
    case "D1":
      break;
    case "D2":
      break;
    case "D3":
      break;
    case "D4":
      break;
    case "D5":
      break;
    case "D6":
      break;
    case "D7":
      break;
    case "D8":
      break;
    case "D9":
      break;
    case "D10":

      break;
    case "E1":

      break;
    case "E2":

      break;
    case "E3":

      break;
    case "E4":

      break;
    case "E5":

      break;
    case "E6":

      break;
    case "E7":

      break;
    case "E8":

      break;
    case "E9":

      break;
    case "E10":

      break;
    case "F1":

      break;
    case "F2":

      break;
    case "F3":

      break;
    case "F4":

      break;
    case "F5":

      break;
    case "F6":

      break;
    case "F7":

      break;
    case "F8":

      break;
    case "F9":

      break;
    case "F10":

      break;
    case "G1":

      break;
    case "G2":

      break;
    case "G3":

      break;
    case "G4":

      break;
    case "G5":

      break;
    case "G6":

      break;
    case "G7":

      break;
    case "G8":

      break;
    case "G9":

      break;
    case "G10":

      break;
    case "H1":

      break;
    case "H2":

      break;
    case "H3":

      break;
    case "H4":

      break;
    case "H5":

      break;
    case "H6":

      break;
    case "H7":

      break;
    case "H8":

      break;
    case "H9":

      break;
    case "H10":

      break;
    case "J1":

      break;
    case "J2":

      break;
    case "J3":

      break;
    case "J4":

      break;
    case "J5":

      break;
    case "J6":

      break;
    case "J7":

      break;
    case "J8":

      break;
    case "J9":

      break;
    case "J10":

      break;
    case "K1":

      break;
    case "K2":

      break;
    case "K3":

      break;
    case "K4":

      break;
    case "K5":

      break;
    case "K6":

      break;
    case "K7":

      break;
    case "K8":

      break;
    case "K9":

      break;
    case "K10":

      break;


    default:
      console.log("don't know what to do with that command");


  }

}




/*
To get list of available ports (selectable from MAX?)
serialport.list(function (err, ports) {
  ports.forEach(function(port) {
    console.log(port.comName);
    console.log(port.pnpId);
    console.log(port.manufacturer);
  });
});

*/
