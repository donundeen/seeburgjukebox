
int rled = 8;           // the pin that the LED is attached to
int gled = 7;           // the pin that the LED is attached to
int bled = 6;           // the pin that the LED is attached to


void setup() {
  // put your setup code here, to run once:
  pinMode(rled, OUTPUT);
  pinMode(gled, OUTPUT);
  pinMode(bled, OUTPUT);

}

void loop() {
  // put your main code here, to run repeatedly:
  digitalWrite(rled, HIGH);
  digitalWrite(gled, LOW);
  digitalWrite(bled, LOW);
  delay(1000);

  digitalWrite(rled, LOW);
  digitalWrite(gled, HIGH);
  digitalWrite(bled, LOW);
  delay(1000);

  digitalWrite(rled, LOW);
  digitalWrite(gled, LOW);
  digitalWrite(bled, HIGH);
  delay(1000);
  digitalWrite(rled, LOW);
  digitalWrite(gled, HIGH);
  digitalWrite(bled, HIGH);
  delay(1000);
  digitalWrite(rled, HIGH);
  digitalWrite(gled, LOW);
  digitalWrite(bled, HIGH);
  delay(1000);
  digitalWrite(rled, HIGH);
  digitalWrite(gled, HIGH);
  digitalWrite(bled, LOW);
  delay(1000);

  digitalWrite(rled, HIGH);
  digitalWrite(gled, HIGH);
  digitalWrite(bled, HIGH);
  delay(1000);

  digitalWrite(rled, LOW);
  digitalWrite(gled, LOW);
  digitalWrite(bled, LOW);
  delay(1000);

}
