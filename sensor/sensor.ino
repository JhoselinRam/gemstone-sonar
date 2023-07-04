#include "libraries/gSonar/src/HC_SR04.h"
#include "Servo.h"
#include "math.h"

//Sync caracters
#define SYNC_START_0 36  // '$'
#define SYNC_START_1 35  // '#'
#define SYNC_END_0   38  // '&'
#define SYNC_END_1   37  // '%'

//Incoming buffer structure
#define IN_BUFFER_SIZE 8
#define START_0   0
#define START_1   1
#define DIRECTIVE 2
#define PAYLOAD   3
#define END_0     6
#define END_1     7

//Outgoing buffer structure
#define OUT_BUFFER_SIZE 7
#define BUFFER_DISTANCE 3
#define BUFFER_ANGLE 4

//Directives
#define ENABLE    69 // 'E'
#define DELTA     68 // 'D'
#define DELTA_0   48 // '0'
#define DELTA_1   49 // '1'
#define AUTO      65 // 'A'
#define ANGLE     71 // 'G'
#define FROM      70 // 'F'
#define TO        84 // 'T'
#define DISTANCE  67 // 'C'
#define DATA      90 // 'Z'

//General definitions
#define TRUE 1
#define DELTA_MIN 0
#define DELTA_MAX 10
#define DEFAULT_DELTA 1
#define ANGLE_MIN 30  // Total view: 120 deg
#define ANGLE_MAX 150
#define ASCII_OFFSET 48
#define DISTANCE_MAX 50 // 50cm
#define INIT_DELAY   50 // 50ms






uint8_t buffer[OUT_BUFFER_SIZE] = {SYNC_START_0, SYNC_START_1, 0, 0, 0, SYNC_END_0, SYNC_END_1};
HC_SR04 sonar(7,6);
Servo servo;
uint8_t message[IN_BUFFER_SIZE] = {0, 0, 0, 0, 0, 0, 0, 0};
bool enable;
bool automatic;
float angle;
float delta;
uint8_t minAngle;
uint8_t maxAngle;
uint8_t maxDistance;

//--------------- Setup --------------------

void setup(){
  pinMode(LED_BUILTIN, OUTPUT);
  Serial.begin(115200);
  sonar.begin();
  servo.attach(3);

  //Set variables default value
  enable = false;
  automatic = false;
  angle = ANGLE_MIN;
  delta = DEFAULT_DELTA;
  minAngle = ANGLE_MIN;
  maxAngle = ANGLE_MAX;
  maxDistance = DISTANCE_MAX;

  // Align the servo to the default value
  servo.write(angle);

  // Send the defalt values to the render, this trigger the 'ready' serial state
  // The 'DISTANCE' position is used to send the initial data
  delay(INIT_DELAY);
  
  buffer[DIRECTIVE] = FROM;
  buffer[BUFFER_DISTANCE] = minAngle;
  Serial.write(buffer, OUT_BUFFER_SIZE);
  delay(INIT_DELAY);

  buffer[DIRECTIVE] = TO;
  buffer[BUFFER_DISTANCE] = maxAngle;
  Serial.write(buffer, OUT_BUFFER_SIZE);
  delay(INIT_DELAY);

  buffer[DIRECTIVE] = DELTA_0;
  buffer[BUFFER_DISTANCE] = DELTA_MIN;
  Serial.write(buffer, OUT_BUFFER_SIZE);
  delay(INIT_DELAY);

  buffer[DIRECTIVE] = DELTA_1;
  buffer[BUFFER_DISTANCE] = DELTA_MAX;
  Serial.write(buffer, OUT_BUFFER_SIZE);
  delay(INIT_DELAY);

  buffer[DIRECTIVE] = ENABLE;
  buffer[BUFFER_DISTANCE] = enable;
  Serial.write(buffer, OUT_BUFFER_SIZE);
  delay(INIT_DELAY);

  buffer[DIRECTIVE] = AUTO;
  buffer[BUFFER_DISTANCE] = automatic;
  Serial.write(buffer, OUT_BUFFER_SIZE);
  delay(INIT_DELAY);

  buffer[DIRECTIVE] = DELTA;
  buffer[BUFFER_DISTANCE] = map(delta, DELTA_MIN, DELTA_MAX, 0, 255);
  Serial.write(buffer, OUT_BUFFER_SIZE);
  delay(INIT_DELAY);

  buffer[DIRECTIVE] = ANGLE;
  buffer[BUFFER_DISTANCE] = map(angle, minAngle, maxAngle, 0, 255);
  Serial.write(buffer, OUT_BUFFER_SIZE);
  delay(INIT_DELAY);

  buffer[DIRECTIVE] = DISTANCE;
  buffer[BUFFER_DISTANCE] = maxDistance;
  Serial.write(buffer, OUT_BUFFER_SIZE);
  delay(INIT_DELAY);

  //Finally set the directive to data, this value will no longer change
  buffer[DIRECTIVE] = DATA;
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
  if(Serial.available() == 0) return;

  uint8_t bytesRead = Serial.readBytesUntil(SYNC_END_1, message, IN_BUFFER_SIZE);
  
  if(!isInSync()) return;

  executeDirective();
}

//-------------------------------------------
//-------------------------------------------

bool isInSync(){
  if(message[START_0] != SYNC_START_0 ||
  message[START_1] != SYNC_START_1 ||
  message[END_0] != SYNC_END_0) return false;

  return true;
}

//-------------------------------------------
//-------------------------------------------

void executeDirective(){
  switch(message[DIRECTIVE]){
    case ENABLE:
      directiveEnable();
      break;

    case AUTO:
      directiveAuto();
      break;

    case ANGLE:
      directiveAngle();
      break;

    case DELTA:
      directiveDelta();
      break;
      
    case FROM:
      directiveFrom();
      break;

    case TO:
      directiveTo();
      break;

    case DISTANCE:
      directiveDistance();
      break;

  }
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

  if(delta != 0)
    delta *= abs(delta)/delta;
}

//-------------------------------------------
//-------------------------------------------

void directiveAngle(){
  angle = floatMap(getPayload(), 0, 255, minAngle, maxAngle);
  servo.write(angle);
}

//-------------------------------------------
//-------------------------------------------

void directiveAuto(){
  automatic = getPayload() == TRUE;
}

//-------------------------------------------
//-------------------------------------------

void directiveFrom(){
  minAngle = clamp(getPayload(), 0, maxAngle);
}

//-------------------------------------------
//-------------------------------------------

void directiveTo(){
  maxAngle = clamp(getPayload(), minAngle, 180);
}

//-------------------------------------------
//-------------------------------------------

void directiveDistance(){
  maxDistance = getPayload();
}

//-------------------------------------------
//-------------------------------------------

void sendData(){
  if(!enable) return;
  if(automatic) autoMove();

  float data = sonar.filterRead(UNIT_DISTANCE_CM);
  data = clamp(data, 0, maxDistance);

  buffer[BUFFER_ANGLE] = round(floatMap(angle, minAngle, maxAngle, 0, 255));
  buffer[BUFFER_DISTANCE] = round(floatMap(data, 0, maxDistance, 0, 255));

  Serial.write(buffer, OUT_BUFFER_SIZE);

  delay(50);
}

//-------------------------------------------
//-------------------------------------------

void autoMove(){
  angle += delta;

  if(angle > maxAngle){
    delta *= -1;
    angle = maxAngle + delta;
  }   

  if(angle < minAngle){
    delta *= -1;
    angle = minAngle + delta;
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