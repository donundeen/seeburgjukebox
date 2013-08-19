// placeholder for the work i'll do getting node and arduino to talk:
// https://github.com/voodootikigod/node-serialport
//
var portname = "/dev/cu.usbmodem1411";




var serialport = require("serialport");
var SerialPort  = serialport.SerialPort;
var serialPort = new SerialPort(portname, {
  baudrate: 9600,
  parser: serialport.parsers.readline("\n") 
});


var fullMessage = "";
var waitingOnNumber = false;


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
	    	processMessage(fullMessage);
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