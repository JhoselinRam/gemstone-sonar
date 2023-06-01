#ifndef G_SONAR_DEFINITIONS_H_
#define G_SONAR_DEFINITIONS_H_

//------------ Macros ------------

//Temperature
#define celcius2fahrenheit(c) (((c)*9.0/5)+32)
#define celcius2kelvin(c) ((c)+273.15)        
#define fahrenheit2celcius(f) (((f)-32)*5.0/9)
#define fahrenheit2kelvin(f) celcius2kelvin(fahrenheit2celcius(f))
#define kelvin2celcius(k) ((k)-273.15)        
#define kelvin2fahrenheit(k) celcius2fahrenheit(kelvin2celcius(k))        

//---------------------------------

//Default values
#define SONAR_DEFAULT_AIR_TEMPERATURE 20.0
#define SONAR_DEFAULT_SOUND_SPEED  0.34342

//Distance units
#define UNIT_DISTANCE_MM 0
#define UNIT_DISTANCE_CM 1
#define UNIT_DISTANCE_IN 2

#endif