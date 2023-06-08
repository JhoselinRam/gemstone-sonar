#include "libraries/gSonar/src/HC_SR04.h"
#include "Servo.h"
#include "math.h"

#define RENDER_ON 49
#define RENDER_OFF 48
#define BUFFER_DISTANCE 2
#define BUFFER_ANGLE 3

uint8_t buffer[6] = {'$', '#', 0, 0, '&', '?'};
HC_SR04 sonar(6,7);
Servo servo;
uint8_t message;
float angle;
float delta;

//--------------- Setup --------------------

void setup(){
  pinMode(LED_BUILTIN, OUTPUT);
  Serial.begin(115200);
  sonar.begin();
  servo.attach(3);

  message = RENDER_OFF;
  angle = 0.0;
  delta = 1.0;
  servo.write(angle);
}

//------------------------------------------
//---------------- Loop --------------------

void loop(){
  readFromRender();
  writeToRender();
}

//-------------------------------------------
//------------ Aux Functions ----------------


void readFromRender(){
  if(Serial.available() > 0){
    message = Serial.read();

    if(message == RENDER_ON){
      digitalWrite(LED_BUILTIN, HIGH);
    }

    if(message == RENDER_OFF){
      digitalWrite(LED_BUILTIN, LOW);
    }
  }
}

//-------------------------------------------


void writeToRender(){
  if(message != RENDER_ON) return;

  servo.write(round(angle));
  buffer[BUFFER_ANGLE] = round(floatMap(angle, 0, 180, 0, 255));
  
  Serial.write(buffer, 6);

  angle += delta;
  if(angle > 180){
    delta *= -1;
    angle = 180 + delta;
  }   
  if(angle < 0){
    delta *= -1;
    angle = delta;
  }   

  delay(50);
}

//-------------------------------------------
//-------------------------------------------

float floatMap(float value, float from_0, float from_1, float to_0, float to_1){
  float m = (to_1 - to_0) / (from_1 - from_0);
  float b = (to_0*from_1 - to_1*from_0) / (from_1 - from_0);

  return m*value + b;
}

//-------------------------------------------