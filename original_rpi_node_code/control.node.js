/*

testing squeezebox control 

*/
var SqueezeServer = require('squeezenode');
var Spotify = require("./node_modules/squeezenode/spotify");
var Pandora = require("./node_modules/squeezenode/pandora");

var $ = require("jquery");

var squeeze = new SqueezeServer('http://192.168.1.84', 9000);
//subscribe for the 'register' event to ensure player registration is complete

var serverIp = "http://192.168.1.84";
var serverPort = "9000";

var playerId = '00:04:20:16:50:9a';
var playerName = 'Squeezebox Receiver';
var playerIp  = '192.168.1.7';
var playerPort = '32947';

var stations = {
	johnnyCash : "http://192.168.1.84:9000/anyurl?p0=playlist&p1=play&p2=pandora%3A%2F%2F1035147119032804720.mp3&p3=Johnny%20Cash%20Radio&player=00%3A04%3A20%3A16%3A50%3A9a&_dc=1385761499216",
	barryWhite : "http://192.168.1.84:9000/anyurl?p0=playlist&p1=play&p2=pandora%3A%2F%2F737931108657145200.mp3&p3=Barry%20White%20Radio&player=00%3A04%3A20%3A16%3A50%3A9a&_dc=1385761556715",
	hallAndOates : "http://192.168.1.84:9000/anyurl?p0=playlist&p1=play&p2=pandora%3A%2F%2F1716360375633978736.mp3&p3=Hall%20%26%20Oates%20Radio&player=00%3A04%3A20%3A16%3A50%3A9a&_dc=1385762362569",
	johnColtrane : "http://192.168.1.84:9000/anyurl?p0=playlist&p1=play&p2=pandora%3A%2F%2F533879432922277232.mp3&p3=John%20Coltrane%20Radio&player=00%3A04%3A20%3A16%3A50%3A9a&_dc=1385762430441",
}



//http://192.168.1.84:9000/anyurl?p0=playlist&p1=play&p2=pandora%3A%2F%2F1545411000691860848.mp3&p3=Beach%20House%20Radio&player=00%3A04%3A20%3A16%3A50%3A9a&_dc=1385761290406

//http://192.168.1.84:9000/anyurl?p0=playlist&p1=play&p2=pandora%3A%2F%2F1035147119032804720.mp3&p3=Johnny%20Cash%20Radio&player=00%3A04%3A20%3A16%3A50%3A9a&_dc=1385761499216

//http://192.168.1.84:9000/anyurl?p0=playlist&p1=play&p2=pandora%3A%2F%2F1035147119032804720.mp3&p3=Johnny%20Cash%20Radio&player=00%3A04%3A20%3A16%3A50%3A9a&_dc=1385761499216


//http://192.168.1.84:9000/anyurl?p0=playlist&p1=play&p2=pandora%3A%2F%2F737931108657145200.mp3&p3=Barry%20White%20Radio&player=00%3A04%3A20%3A16%3A50%3A9a&_dc=1385761556715

//http://192.168.1.84:9000/playlist.html?ajaxRequest=1&player=00:04:20:16:50:9a&uid=1385761290000


/*

id: 1
method: "slim.request"
params: [00:04:20:16:50:9a, [button, jump_fwd]]
0: "00:04:20:16:50:9a"
1: [button, jump_fwd]
0: "button"
1: "jump_fwd"

*/

squeeze.on('register', function(){
    //you're ready to use the api, eg.
    squeeze.getPlayers( function(reply) {
    	console.log("\nplayers:")
        console.dir(reply);
    });

    squeeze.getSyncGroups(function(reply){
    	console.log("\ngroups:")
    	console.log(JSON.stringify(reply, null, ' '));
    });


	$.ajax({
		url : stations.barryWhite,
		success : function(data, status, jqXHR){
			console.log("success!");
			console.log(status);
			console.log(JSON.stringify(data));
		},
		error : function (jqXHR, textStatus, error){
			console.log("Error");
			console.log(textStatus);
			console.log(error);
		}
	});




});
