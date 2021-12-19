// index.js

//var osascript = require('node-osascript');

//import {osascript} from 'node-osascript';

import pkg from 'node-osascript';
const osascript = pkg;
 
/*
osascript.execute('display dialog "What should I do?" buttons {"Go home", "Work", "Nothing"}\nset DlogResult to result\n return result', function(err, result, raw){
  if (err) return console.error(err)
  console.log(result, raw)
});
*/

// osascript -e 'tell application "Spotify" to play track  "spotify:playlist:7k8J5jxHduvlJWazJkz8jD"'

var PORT = 9002;
var HOST = '127.0.0.1';


import { Server } from 'node-osc';

var oscServer = new Server(PORT, '0.0.0.0', () => {
  console.log('OSC Server is listening');
});

oscServer.on('message', function (msg) {
  console.log(`Message: ${msg}`);
  console.log(msg);
  var letter = msg[1];
  var number = msg[2];
  var command = letter+number;
  console.log("command " + command);
  runCommand(command);
//  oscServer.close();
});

function runCommand(command){
	var scriptline = "tell application \"Spotify\" to play track  \"spotify:playlist:7k8J5jxHduvlJWazJkz8jD\"";

	console.log(scriptline);
	osascript.execute(scriptline, function(err, result, raw){
  		if (err) return console.error(err)
  		console.log(result, raw)
	});
}
