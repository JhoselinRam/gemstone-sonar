#include "libraries/gButton/src/gButton.h";
#include "libraries/gSonar/src/HC_SR04.h";

uint8_t buffer[6] = {'$', '#', 0, 0, '&', '?'};
gButton button(3);
HC_SR04 sonar(6,7);
String message;

void setup(){
  pinMode(LED_BUILTIN, OUTPUT);
  Serial.begin(115200);
  button.begin();
  sonar.begin();
}

void loop(){
  if(Serial.available() > 0){
   // message = Serial.readString();
    
    //if(message == "end"){
      digitalWrite(LED_BUILTIN, HIGH);
    //}
  }
}