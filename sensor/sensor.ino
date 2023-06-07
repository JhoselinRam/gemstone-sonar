#include "libraries/gButton/src/gButton.h";
#include "libraries/gSonar/src/HC_SR04.h";

#define RENDER_ON 49
#define RENDER_OFF 48

uint8_t buffer[6] = {'$', '#', 0, 0, '&', '?'};
gButton button(3);
HC_SR04 sonar(6,7);
uint8_t message;

void setup(){
  pinMode(LED_BUILTIN, OUTPUT);
  Serial.begin(115200);
  button.begin();
  sonar.begin();

  message = RENDER_OFF;
}

void loop(){
  if(Serial.available() > 0){
    message = Serial.read();

    if(message == RENDER_ON){
      digitalWrite(LED_BUILTIN, HIGH);
    }

    if(message == RENDER_OFF){
      digitalWrite(LED_BUILTIN, LOW);
    }
  }

  if(message == RENDER_ON){
    Serial.write(buffer, 6);
    buffer[2]++;
  }

  delay(50);
}