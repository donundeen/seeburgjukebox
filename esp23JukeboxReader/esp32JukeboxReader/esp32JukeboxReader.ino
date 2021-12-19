
/*
AUTHOR: Steve Bennett  
DATE: May 6 2013
PURPOSE: Read the pulse stream from a Seeburg 3WA "Wall-O-Matic 200" and decode it.
DESCRIPTION: 2nd DRAFT. WORK IN PROGRESS!! 
  The Seeburg 3WA produces two streams of pulses. (NOTE: Actually not pulses but switch closures. 
                                                   An external circuit (TM stevetronics 2013) is needed to convert these 
                                                   switch closures to 5V logic. Batteries not included.)
  
  This Arduimo sketch consists of two WHILE loops. The first loop counts the alphabet pulse train
  and the second WHILE loop counts the numeric pulse train. Pulses are 1/25 seconds spaced 1/25 seconds apart.
  There is a 1/5 second pause between the two pulse trains.
  The external circuit that provides the 5V logic (TM stevetronics 2013) is HIGH when no pulses are arriving and pulses are LOWs.
*/




/*
 * Required libraries to install in the arduino IDE (use the Library Manager to find and install):
 * https://github.com/Hieromon/PageBuilder : PageBuilder
 * https://github.com/bblanchon/ArduinoJson : ArduinoJson
 * https://github.com/CNMAT/OSC : OSC
 * AutoConnect: https://hieromon.github.io/AutoConnect/index.html : instructions on how to install are here: 
 * follow the instructions under "Install the AutoConnect" if you can't just find it in the Library Manager
 */

// this is all the OSC libraries
#include <SLIPEncodedSerial.h>
#include <OSCData.h>
#include <OSCBundle.h>
#include <OSCBoards.h>
#include <OSCTiming.h>
#include <OSCMessage.h>
#include <OSCMatch.h>

// these the libraries for connecting to WiFi
// based on docs here: https://hieromon.github.io/AutoConnect/gettingstarted.html 
#include <WiFi.h>
#include <AutoConnect.h>
#include <WebServer.h>

/* 
 *  WIFI_MODE_ON set to true to send osc data over WIFI.
 *  When this is true: 
 *  -- if the arduino can't connect to wifi, it will create its own AP, named esp32_ap (pw 12345678)
 *  -- you'll need to connect to that SSID via your phone, and use the interface that pops up on your phone 
 *     to configure the SSID and PW of the router you want to connect to
 *  When WIFI_MODE_ON = false, you need the arduino connected to the laptop, 
 *  and it will send data over serial USB
 */
const boolean WIFI_MODE_ON = true;

/* if we aren't using the auto-configuration process, 
    and we want to hard-code the router's SSID and password here.
    Also set HARDCODE_SSID = true
*/
const boolean HARDCODE_SSID = true;

// remember you can't connect to 5G networks with the arduino. 

const char *WIFI_SSID = "JJandJsKewlPad";
const char *WIFI_PASSWORD = "WeL0veLettuce";
//const char *WIFI_SSID = "PILGRIMAGE_25";
//const char *WIFI_PASSWORD = "";
//const char * UDPReceiverIP = "10.0.0.164"; // ip where UDP messages are going
const char *UDPReceiverIP = "10.0.0.174"; // ip where UDP messages are going
//const char *UDPReceiverIP = "192.168.8.168"; // ip where UDP messages are going

const int UDPPort = 9002; // the UDP port that Max is listening on

bool wifi_connected =false;

/*
 * Sometimes we need to delete the SSIDs that are stored in the config of the arduino.
 * Set this value to TRUE and rerun the arduino, to remove all the stored SSIDs 
 * (aka clear the configuration storage). 
 * Then set it badk to false to start saving new SSID/Passwords
 * 
 */
const boolean DELETE_SSIDS = false;

String thisperifitid = "";
String thisarduinomac = "";
String thishumanname = "";
String thisarduinoip = "";


//create UDP instance
WiFiUDP udp;

// wifi autoconnect code
WebServer Server;
AutoConnect      Portal(Server);
AutoConnectConfig  config;

OSCErrorCode error;
static boolean doConnect = false;



// 
// the opto-isolator is connected to pin 8.
//int opto = 8;
int opto = 27;
int led = 13;

int rled = 4;           // the pin that the LED is attached to
int gled = 14;           // the pin that the LED is attached to
int bled = 15;           // the pin that the LED is attached to
/*
int rled = 5;           // the pin that the LED is attached to
int gled = 7;           // the pin that the LED is attached to
int bled = 6;           // the pin that the LED is attached to
*/

//int readingDelay = 4;
//int readingDelay = 10;
int readingDelay = 4;

void setup() {    
  Serial.begin(9600); 
  Serial.println("starting");
//  pinMode(opto, INPUT); //initialize the digital pin as an input from the opto-isolator.
  pinMode(opto, INPUT_PULLUP); //initialize the digital pin as an input from the opto-isolator.
  digitalWrite(opto, HIGH); //turns on the internal pull up resistor.
  pinMode(led, OUTPUT);

  pinMode(rled, OUTPUT);
  pinMode(gled, OUTPUT);
  pinMode(bled, OUTPUT);
   
  digitalWrite(rled, HIGH);
  digitalWrite(gled, HIGH);
  digitalWrite(bled, HIGH);

  rgbRand();

  delay(1000);


  Serial.print("ESP Board MAC Address:  ");
  Serial.println(WiFi.macAddress());

  thisarduinomac = WiFi.macAddress();

  if(WIFI_MODE_ON){
    if(!DELETE_SSIDS){

      // wifi config business

      if(HARDCODE_SSID){
        Serial.println("connecting to hardcoded SSID");
        Serial.println(WIFI_SSID);
        Serial.println(WIFI_PASSWORD);
        
        WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
        while (WiFi.status() != WL_CONNECTED) {
          // wifi status codes: https://realglitch.com/2018/07/arduino-wifi-status-codes/
          delay(1000);
          Serial.print(".");
          Serial.print(WiFi.status());
          Serial.print(WL_CONNECTED);
        }
      }else{
        Server.on("/", rootPage);
        Serial.println("done with Server.on");  
        config.portalTimeout = 15000;  // It will time out in 15 seconds
        Portal.config(config);
        Portal.begin();
      }
    }else{
      deleteAllCredentials();
    }
  }
  
  rgbOff();  
}





int midPause = 40;
int donePause = 200;
int longZeroPause = 100;
boolean hasLongZero = false;

int prevVal = -1;
int valueTotal = 0;
int numFirstZeros = 0;
int numFirstOnes = 0;
int numSecondZeros = 0;
int numSecondOnes = 0;

String letterlist1[5] = {"A","C","E","G","J"};
String letterlist2[5] = {"B","D","F","H","K"};

String mode = "waiting"; // waiting, first, second, 
// The loop routine runs over and over again forever:
void loop() {
  
  //Serial.println("looping");

  int val = digitalRead(opto); // read the input pin

  if(val != prevVal){
/*
    Serial.print(prevVal);
    Serial.print(":");
    Serial.println(valueTotal);
*/
    if(mode != "waiting"){
      rgbRand();
    }else{

      if(!HARDCODE_SSID){
        Portal.handleClient();
      }
      configUdp();  
      rgbOff();
    }
    if(prevVal == 0){
      // change to 1, aka "off"
      if(mode == "first"){
        numFirstZeros++;
      }
      if(mode == "second"){
        numSecondZeros++;        
      }
      if (valueTotal > longZeroPause){
        hasLongZero = true;
      }
    }
    if(prevVal == 1){
      // change to 0, aka "on"
      if(mode == "first"){
        numFirstOnes++;
      }
      if(mode == "second"){
        numSecondOnes++;        
      }
      // was the prevous value hangind on 1 for a little while 
      // (marks switch to second set of pulses)
      if(mode == "first" && valueTotal > midPause){
//        Serial.println("mode to second");
        mode = "second";
      }
      if(mode == "waiting"){
//        Serial.println("mode to first");
        mode = "first";
      }
    }
    valueTotal = 0;
  }
  if(val == 1 && mode == "second" && valueTotal > donePause){
    // done, show pulse values.
    
    Serial.print(numFirstZeros);
//    Serial.print("/");
//    Serial.print(numFirstOnes);
    Serial.print(":");
    Serial.print(numSecondZeros);
  //  Serial.print("/");
  //  Serial.print(numSecondOnes);
    Serial.print(":");
    Serial.print(hasLongZero);
    Serial.println();

    int letterIndex= numSecondZeros - 1;
    int numberIndex = numFirstZeros;
    int number = -1;
    String letter = "Z";
    if(hasLongZero){
      numberIndex--;
    }
    if(numberIndex >= 12){
      letter = letterlist2[letterIndex];
      number = numberIndex - 11;
    }else{
      letter = letterlist1[letterIndex];
      number = numberIndex - 1;      
    }
    Serial.println("********************");
    Serial.print(letter);
    Serial.println(number);
    Serial.println("********************");

    sendOSCUDP(letter, number);    
    numFirstZeros = 0;
    numFirstOnes = 0;
    numSecondZeros = 0;
    numSecondOnes = 0;
    hasLongZero = false;    
    mode = "waiting";
    rgbOff();  

  }

  if(mode != "waiting"){
    valueTotal++;
  }
  prevVal = val;
  delay(readingDelay);
  return;
} 



void rgbOff(){
  digitalWrite(rled, LOW);
  digitalWrite(gled, LOW);
  digitalWrite(bled, LOW);
}

void rgbRand(){
  int randR = (int)random(0, 2);
  int randG = (int)random(0, 2);
  int randB = (int)random(0, 2);
  digitalWrite(rled, randR);
  digitalWrite(gled, randG);
  digitalWrite(bled, randB);
}



void rootPage() {
  char content[] = "Hello, world";
  Server.send(200, "text/plain", content);
}


void deleteAllCredentials(void) {
  Serial.println("deleting all stored SSID credentials");
  AutoConnectCredential credential2;
  boolean result;
  
  result = credential2.del((const char*)"GuestNet");
  Serial.println(result);

  station_config_t config2;
  uint8_t ent = credential2.entries();
  Serial.print("Num SSIDS: ");
  Serial.println(ent);

  while (ent--) {
    credential2.load((int8_t)0, &config2);
    Serial.println((const char*)&config2.ssid[0]);
    result = credential2.del((const char*)&config2.ssid[0]);
    Serial.println(result);
  }
}



// sending data over OSC/UDP.
void sendOSCUDP(String letter, int number){
  /* egs
   *  '/perifit/1', valueInt1, valueInt2, device.name);
   *  28:ec:9a:14:2b:b3 l 180
      28:ec:9a:14:2b:b3 u 1391
   *  
   */
  configUdp();
   
 if(WiFi.status() == WL_CONNECTED){   
  //send hello world to server
  char ipbuffer[20];
  thisarduinoip.toCharArray(ipbuffer, 20);
  OSCMessage oscmsg("/jukebox/1");  
//  oscmsg.add(letter).add(number).add(ipbuffer);
  char letterPtr[6];

  letter.toCharArray(letterPtr,2); 
  oscmsg.add(letterPtr).add(number);//.add(ipbuffer);
  Serial.print("sending data ");
  Serial.print(letter);
  Serial.println(number);
  Serial.println(ipbuffer);
  Serial.println(UDPReceiverIP);
  Serial.println(UDPPort);
  udp.beginPacket(UDPReceiverIP, UDPPort);
//  udp.write(buffer, msg.length()+1);
  oscmsg.send(udp);
  udp.endPacket();
  oscmsg.empty();
 }else{
  Serial.println("not sending udp, not connected");
 }

  
}

/*
 * connecting to UDP port on laptop runnin Max
 */
void configUdp(){
  if(WIFI_MODE_ON){
    if(!wifi_connected && WiFi.status() == WL_CONNECTED){
      Serial.println("HTTP server:" + WiFi.localIP().toString());
      thisarduinoip = WiFi.localIP().toString();
      Serial.println("SSID:" + WiFi.SSID());
      wifi_connected = true;
      udp.begin(UDPPort);
    }
    if(WiFi.status() != WL_CONNECTED){
      Serial.println("wifi not connected");
      wifi_connected = false;
    }
  }
}
