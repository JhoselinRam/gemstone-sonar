#include "libraries/gButton/src/gButton.h";
#include "libraries/gSonar/src/HC_SR04.h";

uint8_t buffer[6] = {'$', '#', 0, 0, '\r', '\n'};
gButton button(3);
HC_SR04 sonar(6,7);

void setup(){
  Serial.begin(115200);
  button.begin();
  sonar.begin();
}

void loop(){
  if(button.down()){
    Serial.write(buffer, 6);
  }
}