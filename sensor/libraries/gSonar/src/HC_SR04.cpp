#include "Arduino.h"
#include "HC_SR04.h"

//-------------- Constructor ------------------

/*
Set the initial values of the HC_SR04 class

Returns: no return.
*/
HC_SR04::HC_SR04(uint8_t triger, uint8_t echo){
    _triger = triger;
    _echo = echo;
    _lastTime = 0;
    _data = 0;
    _gain = HC_SR04_DEFAULT_GAIN;
}

//---------------------------------------------
//----------------- Begin ---------------------

/*
Set the Arduino pins with the correct configuration

Returns: no return.
*/
void HC_SR04::begin(){
    pinMode(_triger, OUTPUT);
    pinMode(_echo, INPUT);
    digitalWrite(_triger, LOW);
}

//---------------------------------------------
//------------------ Raw ----------------------

/*
Reads the sensor and return the raw data.

raw()

Returns: A number representing the time measure
by the sensor in microseconds.
*/
unsigned long HC_SR04::raw(){
    unsigned long currentTime = millis();

    if(currentTime - _lastTime > HC_SR04_SAFE_TIME){
        digitalWrite(_triger, HIGH);
        delayMicroseconds(10);
        digitalWrite(_triger, LOW);

        _data = pulseIn(_echo, HIGH);
        _lastTime = currentTime;
    }

    return _data;
}

//---------------------------------------------