
char incomingByte;      // a variable to read incoming serial data into

String message = "";

void setup() {
  // initialize serial communication:
  Serial.begin(9600);


}

void loop() {
  // see if there's incoming serial data:
  if (Serial.available() > 0) {
    incomingByte = Serial.read();
    
    if(incomingByte == 13){
      // here's where we got the message: send it to MAX!
      Serial.println(message);
      message = "";
    }else{
     if(incomingByte != 10){
        message += incomingByte;
     } 
    }
  }
}

/*
ASCII CODES:
A 65
B 66
C 67
D 68
E 69
F 70
G 71
H 72
J 74
K 75

x 120

0 48
1 49
2 50
3 51
4 52
5 53
6 54 
7 55
8 56
9 57

Carriage Return : 13
New line : 10

egs:
A1  x :  65 49 13 10  120 13 10

*/
