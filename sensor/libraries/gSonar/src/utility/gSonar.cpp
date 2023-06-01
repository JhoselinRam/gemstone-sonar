/*
	gSonar library

	Author: Jhoselin Adrian Ramirez Montes
	Version:1.0.0
	Contact: jhoselin.ramirez92@gmail.com

	Description: This class provides an easy way to operate contactless ultrasonic distance
	sensors, such as hc-sr04 and hc-sr05. It include reads in centimeters, millimeters and inches, 
  implements temperature compensation and a filter to smooth the data, you can get the unfiltered
  raw data as well.

	Supported sensors:
	HC-SR04

  Units used internally:
  Time        -> microseconds (ms)
  Distance    -> millimeters (mm)
  Temperature -> celsius degrees (c)
  Velocity    -> millimeters per microsecond (mm/us)
*/


#include "Arduino.h"
#include "gSonar.h"
#include "../definitions.h"

//-------------- Constructor ------------------

/*
Set the initial values of the base clase gSonar.

Returns: No return.
*/
gSonar::gSonar(){
	_temperature = SONAR_DEFAULT_AIR_TEMPERATURE;
	_speed = SONAR_DEFAULT_SOUND_SPEED;
	_distance = 0;
}

//---------------------------------------------
//----------------- Read ----------------------

/*
Performs a single read from the sensor and returns the distance measured in the 
specified unit.

read( unit )

unit(optional): A number representing the unit to be used 
The allowed values are: 
UNIT_DISTANCE_MM : millimeters.
UNIT_DISTANCE_CM : centimeters. 
UNIT_DISTANCE_IN : inches. 
Default : UNIT_DISTANCE_CM

Returns: A floating point number representing the distance measured.
*/
float gSonar::read(uint8_t unit){
	//Reads the raw data from the sensor
	unsigned long data = raw(); // us
	float distance = _speed*data/2; //mm
	
	//RetuSPEED the result in the specified unit
	switch (unit){
		case UNIT_DISTANCE_MM:
			return distance;
		
		case UNIT_DISTANCE_CM:
			return distance * 0.1;

		case UNIT_DISTANCE_IN:
			return distance * 0.03937;
		
		default:
			return distance;
	}
}

//---------------------------------------------
//------------- Filter Read -------------------

/*
Performs a single read from the sensor and returns the filtered 
distance in the specified unit.

filterRead( unit )

unit(optional): A number representing the unit to be used 
The allowed values are: 
UNIT_DISTANCE_MM : millimeters.
UNIT_DISTANCE_CM : centimeters. 
UNIT_DISTANCE_IN : inches. 
Default : UNIT_DISTANCE_CM

Returns: A floating point number representing the distance measured.

Note: For the filter to work properly, this method needs to be called 
constantly with little time between call.

This method is suitable if you are going to constantly measure the distance,
to avoid an obstacle, for example.
But if you're planning to measure the distance only when certain condition is meet,
like a button pulse, it is best to use the read() method.
*/
float gSonar::filterRead(uint8_t unit){
	//Reads the raw data from the sensor
	unsigned long data = raw(); // us
	float rawDistance = _speed*data/2; //mm

	//ApplySPEED filter
	_distance += _gain*(rawDistance - _distance);
	
	//Returns the result in the specified unit
	switch (unit){
		case UNIT_DISTANCE_MM:
			return _distance;
		
		case UNIT_DISTANCE_CM:
			return _distance * 0.1;

		case UNIT_DISTANCE_IN:
			return _distance * 0.03937;
		
		default:
			return _distance;
	}
}

//---------------------------------------------
//------------ Air Temperature ----------------

/*
Changes the value of the air temperature, this value is used to calculate the velocity
of sound in air. So changing this values will also change the velocity value.

airTemperature( temperature )

temperature: A floating point number representing the air temperature 
in Celsius degrees

Returns: No return.
*/
void gSonar::airTemperature(float temperature){
	_temperature = temperature;

	//Updates the velocity
	_speed = (331.3+0.606*_temperature)/1000.0;  //Velocity in mm/us
}



/*
Gets the value of the air temperature in Celsius degrees.

airTemperature()

Returns: A floating point number representing the temperature of air.
*/
float gSonar::airTemperature(){	
			return _temperature;
}

//---------------------------------------------
//--------------- Sound Speed -----------------

/*
Changes the value of the speed of sound, this 
method will NOT change the value of air temperature

soundSpeed( speed )

speed: A floating point number representing the speed of
sound in m/s.

Returns: No return.
*/
void gSonar::soundSpeed(float speed){
	_speed = speed / 1000.0;
}



/*
Gets the speed of sound in m/s

soundSpeed()

Returns: A floating point number representing the given speed of sound.
*/
float gSonar::soundSpeed(){
	return _speed * 1000.0;
}

//---------------------------------------------
//----------------- Gain ----------------------

/*
Set the filter gain

gain( gain )

gain: A floating point number representing the gain
of the noise filter.

To work properly, this must be a number between
0 and 1.

Returns: No return.
*/
void gSonar::gain(float gain){
	_gain = gain;
}



/*
Get the filter gain

gain()

Returns: A floating point number representing the 
gain of the noise filter.
*/
float gSonar::gain(){
	return _gain;
}



//---------------------------------------------