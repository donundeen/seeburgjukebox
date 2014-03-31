var dgram = require("dgram");
var osc = require('osc-min');

var huereq = require("node-hue-api");
console.log(huereq);

var hue = require("node-hue-api");

console.log(hue);

var lightState = require("node-hue-api").lightState;

var username = "newdeveloper";

var hostname = "192.168.1.57";


var displayResult = function(result) {
    console.log(JSON.stringify(result, null, 2));
};

var displayBridges = function(bridge) {
    console.log("Hue Bridges Found: " + JSON.stringify(bridge));
};

hue.locateBridges().then(displayBridges).done();

var api = new hue.HueApi(hostname, username);

api.connect().then(displayResult).done();

api.lights()
    .then(displayResult)
    .done();

var state;

var displayResult = function(result) {
	console.log("in displayResult");
    console.log(JSON.stringify(result, null, 2));
};

var rgbSeries = [
	["rgb", 150, 0 , 150],
	["rgb", 50, 0, 150],
	["rgb", 150, 0 ,50],
	["rgb", 50, 0 ,50]
];
var hslSeries = [
	["hsl", 0, 75 , 59],
	["hsl", 359, 75, 50],
	["hsl", 0, 75 ,50],
	["hsl", 359, 75 ,50]
];
var rgbIndex = 0;

var doNewState = function(index, series){
	index = index % series.length;
	var item = series[index];

	var newstate;
	if(item[0] == "rgb"){
		newstate = lightState.create().transition(15).rgb(item[1], item[2], item[3]);
	}if(item[0] == "hsl"){
		newstate = lightState.create().transition(15).hsl(item[1], item[2], item[3]);
	} 
	api.setLightState(2, newstate,
	function(err, newResult){
		if(err){
			console.log("error " + err);
		}
		console.log("in Then");
		index++;
		setTimeout(function(){doNewState(index, series);}, 20000);
	});
};



doNewState(0, rgbSeries);


console.log("done");




function hsl(args){

	//msg = msg.trim();

	console.log(args);

	var h = args[0].value;
	var s = args[1].value;
	var l = args[2].value;


	var state;

	console.log("going to set hsl " + h + " " + s + " " + l);

	state = lightState.create().on().hsl(h, s, l);


	api.setLightState(2, state)
  		.done();

}



function rgb(args){

	//msg = msg.trim();

	console.log(args);

	var r = args[0].value;
	var g = args[1].value;
	var b = args[2].value;


	var state;

	console.log("going to set rgb " + r + " " + g + " " + b);

	state = lightState.create().on().rgb(r, g, b);

	try{
		api.setLightState(1, state)
  			.done();
		api.setLightState(2, state)
  			.done();
		api.setLightState(3, state)
  			.done();
	}catch(e){
		console.log("error");
		console.log(e);
	}
}