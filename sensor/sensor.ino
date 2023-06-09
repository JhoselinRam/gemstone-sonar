#include "libraries/gSonar/src/HC_SR04.h"
#include "Servo.h"
#include "math.h"

//Sync caracters
#define SYNC_START_0 36  // '$'
#define SYNC_START_1 35  // '#'
#define SYNC_END_0   38  // '&'
#define SYNC_END_1   37  // '%'

//Incoming buffer structure
#define START_0   0
#define START_1   1
#define DIRECTIVE 2
#define PAYLOAD   3
#define END_0     6
#define END_1     7

//Outgoing buffer structure
#define BUFFER_DISTANCE 2
#define BUFFER_ANGLE 3

//Directives
#define ENABLE    69 // 'E'
#define DELTA     68 // 'D'
#define AUTO      65 // 'A'
#define ANGLE     71 // 'G'

//General definitions
#define TRUE 1
#define DELTA_MIN 0.0
#define DELTA_MAX 10.0
#define ASCII_OFFSET 48






uint8_t buffer[6] = {SYNC_START_0, SYNC_START_1, 0, 0, SYNC_END_0, SYNC_END_1};
HC_SR04 sonar(6,7);
Servo servo;
uint8_t message[8] = {SYNC_START_0, SYNC_START_1, 0, 0, 0, 0, SYNC_END_0, SYNC_END_1};
bool enable;
bool automatic;
float angle;
float delta;
bool aux = false;
//--------------- Setup --------------------

void setup(){
  pinMode(LED_BUILTIN, OUTPUT);
  Serial.begin(115200);
  sonar.begin();
  servo.attach(3);

  enable = false;
  automatic = false;
  angle = 0.0;
  delta = 1.0;
  servo.write(angle);
}

//------------------------------------------
//---------------- Loop --------------------

void loop(){
  getMessage();
  sendData();
}









//-------------------------------------------
//------------- Get Message -----------------


void getMessage(){
  //Expected buffer size is 6 bytes
  if(Serial.available() != 6) return;

  //Reads the incomimg data
  for(int i=0; i<6; i++){
    message[i] = Serial.read();
  }

  //Return if not synced
  if(!isSynced()) return;
  
  //Apply changes by directive
  switch(message[DIRECTIVE]){
    case ENABLE:
      directiveEnable();
      break;

    case DELTA:
      directiveDelta();
      break;

    case AUTO:
      directiveAuto();
      break;

    case ANGLE:
      directiveAngle();
      break;
  }

}

//-------------------------------------------
//------------- Is Synced -------------------

bool isSynced(){
  if(message[START_0] == SYNC_START_0 ||
    message[START_1] == SYNC_START_1 ||
    message[END_0] == SYNC_END_0 ||
    message[END_1] == SYNC_END_1){
    aux = !aux;
    aux ? digitalWrite(LED_BUILTIN, HIGH) : digitalWrite(LED_BUILTIN, LOW);
    return true;
    } 

  //if not synced flush the buffer
  while(Serial.available())
    Serial.read();

  return false;
}

//-------------------------------------------
//-------------------------------------------

void directiveEnable(){
  enable = getPayload() == TRUE;
}

//-------------------------------------------
//-------------------------------------------

void directiveDelta(){
  delta = floatMap(getPayload(), 0, 255, DELTA_MIN, DELTA_MAX);
}

//-------------------------------------------
//-------------------------------------------

void directiveAngle(){
  angle = floatMap(getPayload(), 0, 255, 0, 180);
  servo.write(angle);
}

//-------------------------------------------
//-------------------------------------------

void directiveAuto(){
  automatic = getPayload() == TRUE;
}

//-------------------------------------------
//-------------------------------------------


void sendData(){
  if(!enable) return;
  if(automatic) autoMove();

  buffer[BUFFER_ANGLE] = round(floatMap(angle, 0, 180, 0, 255));
  Serial.write(buffer, 6);

  delay(50);
}

//-------------------------------------------
//-------------------------------------------

void autoMove(){
  angle += delta;

  if(angle > 180){
    delta *= -1;
    angle = 180 + delta;
  }   

  if(angle < 0){
    delta *= -1;
    angle = delta;
  }

  servo.write(round(angle));
}

//-------------------------------------------
//-------------------------------------------

float floatMap(float value, float from_0, float from_1, float to_0, float to_1){
  float m = (to_1 - to_0) / (from_1 - from_0);
  float b = (to_0*from_1 - to_1*from_0) / (from_1 - from_0);

  return m*value + b;
}

//-------------------------------------------
//-------------------------------------------

uint8_t getPayload(){
  int payload_0 = int(message[PAYLOAD]) - ASCII_OFFSET;
  int payload_1 = int(message[PAYLOAD + 1]) - ASCII_OFFSET;
  int payload_2 = int(message[PAYLOAD + 2]) - ASCII_OFFSET;
  int payload = 100*payload_0 + 10*payload_1 + payload_2;
  return clamp(payload, 0, 255);
}

//-------------------------------------------
//-------------------------------------------

int clamp(int value, int min, int max){
  return value < min ? min : (value > max ? max : value);
}

//-------------------------------------------
//-------------------------------------------