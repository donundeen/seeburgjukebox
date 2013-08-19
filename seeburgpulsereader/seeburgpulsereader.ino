
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


// the opto-isolator is connected to pin 7.
int opto = 8;

void setup() {    
   Serial.begin(9600); 
   pinMode(opto, INPUT); //initialize the digital pin as an input from the opto-isolator.
   digitalWrite(opto, HIGH); //turns on the internal pull up resistor.
}

// The loop routine runs over and over again forever:
void loop() {
  int alphacnt = 0;  // counts the alphabet pulses
  int digitcnt = 0;  // counts the digit pulses.

 
  int buffer[4] = {1,1,1,1}; // buffer for reading input. If 4 reads in a row are all the same it is valid input.
  int buffndx = 0; 
  int pausecnt = 0; // counts the number of HIGHs read in.
  int maxpause = 15; // when pausecnt reaches maxpause we are at the pause between alpa and numeric or else we are at the end of transmission.
  int countpause = false;
  buffer[0] = 1;
  buffer[1] = 1;
  buffer[2] = 1;
  buffer[3] = 1;
  //Serial.print("loop");
  
  while( pausecnt < maxpause ) { // Begin the alphabet loop
   // Serial.print("while 1");
   
     buffer[buffndx] = digitalRead(opto); // read the input pin
     
     if(buffer[buffndx] != 1){
//       Serial.println(buffer[buffndx]);
       
     }
     delay(4); // space out the reads a little.
     buffndx++; 
     if (buffndx == 4) buffndx = 0; // rotate the buffer index.
     
     if ((buffer[0] == 0) && (buffer[1] == 0) && (buffer[2] == 0) && (buffer[3] == 0) ){ // we got valid input so proccess it. 
                                                                                         //NOTE: The input pin is normally HIGH. 
                                                                                         //The input pulses from the Seeburg are LOWs.       
        // SWB delay(4); // space out the reads a little.
        pausecnt = 0; // we got our pulse so restart the clock for the next one.
        alphacnt++; //increment the aphabet counter.          
//        Serial.print("alpha");
//        Serial.println(alphacnt);
        while(! ((buffer[0] == 1 ) && (buffer[1] == 1) && (buffer[2] == 1) && (buffer[3] == 1)) ) { //Loop until we get a valid HIGH
          buffer[buffndx] = digitalRead(opto); // read the input pin
          buffndx++; // rotate the buffer index
          if (buffndx == 4) buffndx = 0; // rotate the buffer index.
        }
        countpause = true; //we are receiving input so start counting pauses instead of looping forever.
        continue; // done with this polling itteration, on to the next one.
     }else{
      // Serial.print("else 1");
        if (countpause == true) pausecnt++; // else no valid input
     }
     
  } // end while

//Serial.println("aphafinal");
//Serial.println(alphacnt);

  // now repeat the same proccess as above for the numbers.
  
    pausecnt = 0;   // Reset the pausent counter. Ready for the next stream of pulses to arrive.
    countpause = false; // loop forever until a pulse is recieved.
    while( pausecnt < maxpause ) { // Begin the digit loop
     buffer[buffndx] = digitalRead(opto); // read the input pin
     delay(4);
     buffndx++; 
     if (buffndx == 4) buffndx = 0; // rotate the buffer index.
     
     if ((buffer[0] == 0) && (buffer[1] == 0) && (buffer[2] == 0) && (buffer[3] == 0) ){ // we got valid input so proccess it. NOTE: The input pin is normally HIGH. The input pulses from the Seeburg are LOWs.
        pausecnt = 0; // we got our pulse so restart the clock for the next one.
        digitcnt++; //increment the aphabet counter.         
        while(! ((buffer[0] == 1) && (buffer[1] == 1) && (buffer[2] == 1) && (buffer[3] == 1)) ) { //Loop until we get a valid HIGH
          buffer[buffndx] = digitalRead(opto); // read the input pin
          buffndx++; // rotate the buffer index
          if (buffndx == 4) buffndx = 0; // rotate the buffer index.
        }
       
        countpause = true; //we are receiving input so start counting pauses instead of looping forever.
        continue; // done with this polling itteration, on to the next one.
     }else{
        if (countpause == true) pausecnt++; // else no valid input// else no valid input
     }
     
  } // end while
  
 
  // finished polling for both pulse trains so print the pulses counted.
  int temp = alphacnt;
  alphacnt = digitcnt;
  digitcnt = temp;
  
    
  alphacnt = alphacnt * 2;
  
  if(digitcnt > 11){
    digitcnt = digitcnt - 10;
  }else{
    alphacnt = alphacnt - 1;
  }
  
  digitcnt = digitcnt - 1;
  
  
  String signal = "";
  
  
  if(alphacnt == 1) signal += "A";
  if(alphacnt == 2) signal += "B";
  if(alphacnt == 3) signal += "C";
  if(alphacnt == 4) signal += "D";
  if(alphacnt == 5) signal += "E";
  if(alphacnt == 6) signal += "F";
  if(alphacnt == 7) signal += "G";
  if(alphacnt == 8) signal += "H";
  if(alphacnt == 9) signal += "J";
  if(alphacnt == 10) signal += "K";
  /*
  if(alphacnt == 11) Serial.print("L");
  if(alphacnt == 12) Serial.print("M");
  if(alphacnt == 13) Serial.print("N");
  if(alphacnt == 15) Serial.print("P");
  if(alphacnt == 16) Serial.print("Q");
  if(alphacnt == 17) Serial.print("R");
  if(alphacnt == 18) Serial.print("S");
  if(alphacnt == 19) Serial.print("T");
  if(alphacnt == 20) Serial.print("U");
  if(alphacnt == 21) Serial.print("V");
  */
  signal += String(digitcnt);
  Serial.println(signal);
  
  
} 


