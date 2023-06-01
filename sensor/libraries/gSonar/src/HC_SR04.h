#ifndef G_SONAR_HC_SR04_H_
#define G_SONAR_HC_SR04_H_

#include "Arduino.h"
#include "utility/gSonar.h"

#define HC_SR04_DEFAULT_GAIN 0.485
#define HC_SR04_SAFE_TIME    50

class HC_SR04 : public gSonar{

    public:
        HC_SR04(uint8_t, uint8_t);
        void begin();
        unsigned long raw();
    
    private:
        uint8_t _echo;
        uint8_t _triger;
};
#include "HC_SR04.cpp"
#endif