// placeholder for the work i'll do getting node and arduino to talk:
// https://github.com/voodootikigod/node-serialport
//
var fs = require("fs");


var dgram = require("dgram");
var osc = require('osc-min');

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


var displayResult = function(result) {
  console.log("in displayResult");
    console.log(JSON.stringify(result, null, 2));
};



var files = fs.readdirSync("/dev");
var portname = false;
files.forEach(function(filename){
  if(filename.match(/^cu\.usbserial/)){
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


var fullMessage = "";
var waitingOnNumber = false;


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
  ninaSimone : "http://192.168.1.84:9000/anyurl?p0=playlist&p1=play&p2=pandora%3A%2F%2F605824876774172016.mp3&p3=Nina%20Simone%20Radio&player=00%3A04%3A20%3A16%3A50%3A9a&_dc=1395597677113",
  fleetwoodMac : "http://192.168.1.84:9000/anyurl?p0=playlist&p1=play&p2=pandora%3A%2F%2F1795956650888668528.mp3&p3=Fleetwood%20Mac%20Radio&player=00%3A04%3A20%3A16%3A50%3A9a&_dc=1395597628901",
  joeBataan : "http://192.168.1.84:9000/anyurl?p0=playlist&p1=play&p2=pandora%3A%2F%2F606106300211275120.mp3&p3=Joe%20Bataan%20Radio&player=00%3A04%3A20%3A16%3A50%3A9a&_dc=1395597710843",
  africanJazz : "http://192.168.1.84:9000/anyurl?p0=playlist&p1=play&p2=pandora%3A%2F%2F1805561447598007664.mp3&p3=African%20Jazz%20Radio&player=00%3A04%3A20%3A16%3A50%3A9a&_dc=1395597754457",
  theShins : "http://192.168.1.84:9000/anyurl?p0=playlist&p1=play&p2=pandora%3A%2F%2F815323009127032176.mp3&p3=The%20Shins%20Radio&player=00%3A04%3A20%3A16%3A50%3A9a&_dc=1395597806327",
  santigold : "http://192.168.1.84:9000/anyurl?p0=playlist&p1=play&p2=pandora%3A%2F%2F1000558063770936688.mp3&p3=Santigold%20Radio&player=00%3A04%3A20%3A16%3A50%3A9a&_dc=1395598123787",
  jimmySmith : "http://192.168.1.84:9000/anyurl?p0=playlist&p1=play&p2=pandora%3A%2F%2F606013387183760752.mp3&p3=Jimmy%20Smith%20Radio&player=00%3A04%3A20%3A16%3A50%3A9a&_dc=1395598149974",
  echoAndTheBunnymen : "http://192.168.1.84:9000/anyurl?p0=playlist&p1=play&p2=pandora%3A%2F%2F546305129791890800.mp3&p3=Echo%20%26%20The%20Bunnymen%20Radio&player=00%3A04%3A20%3A16%3A50%3A9a&_dc=1395598173173",
  morrisey : "http://192.168.1.84:9000/anyurl?p0=playlist&p1=play&p2=pandora%3A%2F%2F404801152982984048.mp3&p3=Morrissey%20Radio&player=00%3A04%3A20%3A16%3A50%3A9a&_dc=1395598282280",
  archieShepp : "http://192.168.1.84:9000/anyurl?p0=playlist&p1=play&p2=pandora%3A%2F%2F533958060888565104.mp3&p3=Archie%20Shepp%20Radio&player=00%3A04%3A20%3A16%3A50%3A9a&_dc=1395598321547",
  benWebster : "http://192.168.1.84:9000/anyurl?p0=playlist&p1=play&p2=pandora%3A%2F%2F31550915659441520.mp3&p3=Ben%20Webster%20Radio&player=00%3A04%3A20%3A16%3A50%3A9a&_dc=1395598791936",
  arcadeFire : "http://192.168.1.84:9000/anyurl?p0=playlist&p1=play&p2=pandora%3A%2F%2F149606157738583408.mp3&p3=Arcade%20Fire%20Radio&player=00%3A04%3A20%3A16%3A50%3A9a&_dc=1395598820439",
  rem : "http://192.168.1.84:9000/anyurl?p0=playlist&p1=play&p2=pandora%3A%2F%2F19852094760035696.mp3&p3=R.E.M.%20Radio&player=00%3A04%3A20%3A16%3A50%3A9a&_dc=1395598842685",
  radiohead : "http://192.168.1.84:9000/anyurl?p0=playlist&p1=play&p2=pandora%3A%2F%2F42310225347749232.mp3&p3=Radiohead%20Radio&player=00%3A04%3A20%3A16%3A50%3A9a&_dc=1395598862672",
  spiritualized : "http://192.168.1.84:9000/anyurl?p0=playlist&p1=play&p2=pandora%3A%2F%2F42188673478305136.mp3&p3=Spiritualized%20Radio&player=00%3A04%3A20%3A16%3A50%3A9a&_dc=1395598881985",
  albertAyler : "http://192.168.1.84:9000/anyurl?p0=playlist&p1=play&p2=pandora%3A%2F%2F533956153923085680.mp3&p3=Albert%20Ayler%20Radio&player=00%3A04%3A20%3A16%3A50%3A9a&_dc=1395598410270",
  chetBaker : "http://192.168.1.84:9000/anyurl?p0=playlist&p1=play&p2=pandora%3A%2F%2F42166245159085424.mp3&p3=Chet%20Baker%20Radio&player=00%3A04%3A20%3A16%3A50%3A9a&_dc=1395598896589",
  neutralMilkHotel : "http://192.168.1.84:9000/anyurl?p0=playlist&p1=play&p2=pandora%3A%2F%2F42161439090681200.mp3&p3=Neutral%20Milk%20Hotel%20Radio&player=00%3A04%3A20%3A16%3A50%3A9a&_dc=1395598913005",
  tvOnTheRadio : "http://192.168.1.84:9000/anyurl?p0=playlist&p1=play&p2=pandora%3A%2F%2F44314089584338288.mp3&p3=TV%20On%20The%20Radio%20Radio&player=00%3A04%3A20%3A16%3A50%3A9a&_dc=1395598932834",
  bigJayMcNeely : "http://192.168.1.84:9000/anyurl?p0=playlist&p1=play&p2=pandora%3A%2F%2F31551040213493104.mp3&p3=Big%20Jay%20McNeely%20Radio&player=00%3A04%3A20%3A16%3A50%3A9a&_dc=1395598953561",
  gustavMahler : "http://192.168.1.84:9000/anyurl?p0=playlist&p1=play&p2=pandora%3A%2F%2F1035154510671521136.mp3&p3=Gustav%20Mahler%20Radio&player=00%3A04%3A20%3A16%3A50%3A9a&_dc=1395598468053",
  mozart : "http://192.168.1.84:9000/anyurl?p0=playlist&p1=play&p2=pandora%3A%2F%2F1368650225760609648.mp3&p3=Wolfgang%20Amadeus%20Mozart%20Radio&player=00%3A04%3A20%3A16%3A50%3A9a&_dc=1395598502696",
  theCure : "http://192.168.1.84:9000/anyurl?p0=playlist&p1=play&p2=pandora%3A%2F%2F1101632736033514864.mp3&p3=The%20Cure%20Radio&player=00%3A04%3A20%3A16%3A50%3A9a&_dc=1395598521045",
  tearsForFears : "http://192.168.1.84:9000/anyurl?p0=playlist&p1=play&p2=pandora%3A%2F%2F546898097271743856.mp3&p3=Tears%20For%20Fears%20Radio&player=00%3A04%3A20%3A16%3A50%3A9a&_dc=1395598540416",
  newOrder : "http://192.168.1.84:9000/anyurl?p0=playlist&p1=play&p2=pandora%3A%2F%2F417715672965457264.mp3&p3=New%20Order%20Radio&player=00%3A04%3A20%3A16%3A50%3A9a&_dc=1395598570733",
  kanyeWest : "http://192.168.1.84:9000/anyurl?p0=playlist&p1=play&p2=pandora%3A%2F%2F729968763276371312.mp3&p3=Kanye%20West%20Radio&player=00%3A04%3A20%3A16%3A50%3A9a&_dc=1395598606207",
  gilEvans : "http://192.168.1.84:9000/anyurl?p0=playlist&p1=play&p2=pandora%3A%2F%2F19852142004675952.mp3&p3=Gil%20Evans%20Radio&player=00%3A04%3A20%3A16%3A50%3A9a&_dc=1395598971671",
  nextSong : "",
}


var updatedSeries = false;
var inDoNewState = false;
var doNewState = function(index, series, initial){
  inDoNewState = true;
  if(updatedSeries){
    series= updatedSeries;
    updatedSeries = false;
  }
  if(series.length == 0){
    inDoNewState = false;
    return;
  }

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
    setTimeout(function(){doNewState(index, series, false);}, 20000);
  });
  inDoNewState = false;
};



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
});


function processMessage(command){
	console.log("going to process command : " + command);
  switch(command){
    case "A1":
      updatedSeries = [];
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
      break;
    case "A2":
      updatedSeries = [];
      $.ajax({
        url : stations.johnnyCash,
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

      break;
    case "A3":
      updatedSeries = [];
      $.ajax({
        url : stations.hallAndOates,
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

      break;
    case "A4":
      updatedSeries = [];
      $.ajax({
        url : stations.johnColtrane,
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

      break;
    case "A5":
      updatedSeries = [];
      $.ajax({
        url : stations.ninaSimone,
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

      break;
    case "A6":
      updatedSeries = [];
      $.ajax({
        url : stations.joeBataan,
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

      break;
    case "A7":
      updatedSeries = [];
      $.ajax({
        url : stations.africanJazz,
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

      break;
    case "A8":
      updatedSeries = [];
      $.ajax({
        url : stations.theShins,
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

      break;
    case "A9":
      updatedSeries = [];

      $.ajax({
        url : stations.arcadeFire,
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

      break;
    case "A10":
      updatedSeries = [];
      $.ajax({
        url : stations.nextSong,
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

      break;
    case "B1":
      updatedSeries = [];
      $.ajax({
        url : stations.echoAndTheBunnymen,
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

      break;
    case "B2":
      updatedSeries = [];
      $.ajax({
        url : stations.morrisey,
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

      break;
    case "B3":
      updatedSeries = [];
      $.ajax({
        url : stations.archieShepp,
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

      break;
    case "B4":
      updatedSeries = [];
      $.ajax({
        url : stations.benWebster,
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

      break;
    case "B5":
      updatedSeries = [];
    
      $.ajax({
        url : stations.santigold,
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

      break;
    case "B6":
      updatedSeries = [];
      $.ajax({
        url : stations.jimmySmith,
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

      break;


    case "B7":
      updatedSeries = [];
      $.ajax({
        url : stations.rem,
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

      break;
    case "B8":
      updatedSeries = [];
      $.ajax({
        url : stations.radiohead,
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

      break;
    case "B9":
      updatedSeries = [];
      $.ajax({
        url : stations.spiritualized,
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

      break;
    case "B10":
      updatedSeries = [];
      $.ajax({
        url : stations.albertAyler,
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

      break;
    case "C1":
      updatedSeries = [];
      $.ajax({
        url : stations.chetBaker,
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

      break;
    case "C2":
      updatedSeries = [];
      $.ajax({
        url : stations.neutralMilkHotel,
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

      break;
    case "C3":
      updatedSeries = [];
      $.ajax({
        url : stations.tvOnTheRadio,
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

      break;
    case "C4":
      updatedSeries = [];
      $.ajax({
        url : stations.bigJayMcNeely,
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

      break;
    case "C5":
      updatedSeries = [];
      $.ajax({
        url : stations.gustavMahler,
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

      break;
    case "C6":
      updatedSeries = [];
      $.ajax({
        url : stations.mozart,
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

      break;
    case "C7":
      updatedSeries = [];
      $.ajax({
        url : stations.theCure,
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

      break;
    case "C8":
      updatedSeries = [];
      $.ajax({
        url : stations.tearsForFears,
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

      break;
    case "C9":
      updatedSeries = [];
      $.ajax({
        url : stations.newOrder,
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

      break;
    case "C10":
      updatedSeries = [];
      $.ajax({
        url : stations.kanyeWest,
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

      break;
    case "D1":
      updatedSeries = [];
      $.ajax({
        url : stations.gilEvans,
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

      break;
    case "D2":
      updatedSeries = [];
      $.ajax({
        url : stations.fleetwoodMac,
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

      break;
    case "D3":
      var rgbSeries = [
        ["rgb", 150, 0 , 150],
        ["rgb", 50, 0, 150],
        ["rgb", 150, 0 ,50],
        ["rgb", 50, 0 ,50]
      ];
      if(inDoNewState){
        updatedSeries = rgbSeries;
      }else{
        doNewState(0, rgbSeries, true);
      }
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