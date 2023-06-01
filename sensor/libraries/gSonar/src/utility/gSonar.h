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
  Temperature -> celsius (c)
  Speed       -> millimeters per microsecond (mm/us)
*/

#ifndef G_SONAR_H_
#define G_SONAR_H_

#include "Arduino.h"
#include "../definitions.h"

class gSonar{

	public: 
		gSonar();
		virtual void begin() = 0;
		virtual unsigned long raw() = 0;
		float read(uint8_t unit = UNIT_DISTANCE_CM);
		float filterRead(uint8_t unit = UNIT_DISTANCE_CM);
		void  airTemperature(float);
		float airTemperature();
		void  soundSpeed(float);
		float soundSpeed();
		void  gain(float);
		float gain();

	protected: 
		uint16_t _data;          //Raw output data from the sensor
		unsigned long _lastTime; //Last time since the sensor was updated
		float    _gain;          //Gain of the filter
	
	private:
		uint8_t  _temperature;   //Temperature of the air
		float    _distance;      //Filtered data
		float    _speed;         //Speed of the sound in the air
		
};

#include "gSonar.cpp"
#endif