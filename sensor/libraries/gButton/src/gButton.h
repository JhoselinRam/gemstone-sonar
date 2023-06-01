/*
	gButton class

	Author: Jhoselin Adrian Ramirez Montes
	Version: 1.0.0
	Contact: jhoselin.ramirez92@gmail.com

	Description: This class provides an easy way to work with buttons and other momentary
	contact switches. It implements various functionalities like detecting when the button
	is press, released, a toggle and even double or multiple clicks.
	
	It makes no use of the delay() function and implements a debounce filter.
	It can be used with the internal pin pull-up without extra configuration, simplifying
	the wiring or, if preferred, can use an external resistor (10kOhm is suggested).

	All times are in milliseconds.
*/

#ifndef G_BUTTON_H_
#define G_BUTTON_H_

#include "Arduino.h"

//------- Constant definitions --------

//Button State
#define BUTTON_LAST_STATE     0 
#define BUTTON_CURRENT_STATE  1
#define BUTTON_HAS_CHANGE     2
#define BUTTON_TOGGLE         3
#define BUTTON_TOGGLE_UP      4
#define BUTTON_HAS_MUTI_CLICK 5
#define BUTTON_USE_PULLUP     6

//Default Configurations
#define BUTTON_DEBOUNCE_TIME  50
#define BUTTON_TIME_OUT       300

//-------------------------------------

class gButton{
	public:
		gButton(uint8_t pinNumber, bool pullUp = true);
		void begin();
		bool down();	
		bool up();
		bool sustained();
		bool change();
		bool toggle();
		bool toggleUp();
		bool multiClick(uint8_t = 2);
		bool multiClickUp(uint8_t = 2);
		void debounceTime(uint16_t debounceTime);
		uint16_t debounceTime();
		void timeOut(uint16_t timeOut);
		uint16_t timeOut();

	private:
		uint8_t _pin;                 //Pin on the Arduino board in which the button will be connected to
		uint16_t _debounceTime;        //Time that takes the button to bounce
		uint8_t _state;               //State of the button
		uint8_t _upCount;             //Counts the multiple clicks
		uint8_t _downCount;           //Counts the multiple releases
		unsigned long _lastTime;      //Time since the button was updated
		unsigned long _lastDownTime;  //Time since the button was down
		unsigned long _lastUpTime;    //Time since the button was up
		uint16_t _timeOut;            //Time between each click
		
		void _update();										//Utility function, used to update the button state
		void _downCounter(unsigned long); //Utility function, used to keep the _downCount value
		void _upCounter(unsigned long);   //Utility function, used to keep the _upCount value
		void _set(uint8_t, bool);         //Utility function, used to set a specific state property
		bool _get(uint8_t);               //Utility function, used to get a specific state property

};

#endif