#include "libraries/gSonar/src/HC_SR04.h";
#include "Servo.h"

#define RENDER_ON 49
#define RENDER_OFF 48

uint8_t buffer[6] = {'$', '#', 0, 0, '&', '?'};
HC_SR04 sonar(6,7);
Servo servo;
uint8_t message;

void setup(){
  pinMode(LED_BUILTIN, OUTPUT);
  Serial.begin(115200);
  sonar.begin();
  servo.attach(3);

  message = RENDER_OFF;
  servo.write(0);
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
    buffer[3]++;
    servo.write(map(buffer[3], 0, 255, 0, 180));
    Serial.write(buffer, 6);
  }

  delay(50);
}