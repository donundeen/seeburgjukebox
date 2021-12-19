import { createRequire } from "module";
const require = createRequire(import.meta.url);

const { exec } = require("child_process");


var bridge="10.0.0.86";

var hash="cVsUzWhazmEPapBUyHES40Zwe5Te8yF1xc94wKBk";

var bulb= 1;

var brt= 200;
var satn= 250;
var hcolor= 10000;
var bulb=1;

var brtmax = 254;
var satmax = 254;
var huemax = 65535;



var hsldata = {"on":true,"hue":43690,"bri":254,"sat":254,"transitiontime":10};


/*
hue
hue, in range 0 - 65535.
bri
brightness, in range 0 - 254. 0 is not off.
sat
saturation, in range 0 - 254
*/
// truy this tool: https://hslpicker.com/#fa0000
var newhue = Math.floor(huemax * .66);

//getCurrentState();

/*
sexy purple/blue
        "hue": 46497,
        "sat": 251,
	    "bri": 212,
*/


setHSB(1, 46497, 212, 251, 10);
setHSB(2, 46497, 212, 251, 10);

/*
setLightsOff(1);
setLightsOff(2);
*/

function setLightsOff(bulb){
	hsldata.on = false;

	var jsonstring = JSON.stringify(hsldata);
	console.log(jsonstring);
    
	execute('PUT', 'http://'+bridge+'/api/'+hash+'/lights/'+bulb+'/state',"'"+jsonstring+"'");

}


function setHSB(bulb,hcolor,brt,satn,tran) {
	// hcolor: 0-10000
	// brt : 0-200
	// satn: 0-250
	console.log(hsldata);

	hsldata.hue = hcolor;
	hsldata.bri = brt;
	hsldata.sat = satn;
	hsldata.transitiontime = tran;

	var jsonstring = JSON.stringify(hsldata);
	console.log(jsonstring);
    
	execute('PUT', 'http://'+bridge+'/api/'+hash+'/lights/'+bulb+'/state',"'"+jsonstring+"'");

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

function getCurrentState(){
	execute('GET', 'http://'+bridge+'/api/'+hash, false, function(result){
		var resjson = JSON.parse(result);
		console.log(JSON.stringify(resjson, null, "  "));
	});

}