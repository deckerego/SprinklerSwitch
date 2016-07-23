import time

WIRING_PI = True
try:
	import wiringpi
	wiringpi.wiringPiSetupSys()
except ImportError:
	WIRING_PI = False

button_pin = {
	0: 27
}

def enable(button):
	if not WIRING_PI:
		return False

	pin = button_pin[button]

	wiringpi.pinMode(pin, 1)
	wiringpi.digitalWrite(pin, 1)

	return True

def disable(button):
	if not WIRING_PI:
		return False

	pin = button_pin[button]

	wiringpi.pinMode(pin, 1)
	wiringpi.digitalWrite(pin, 0)

	return True

def is_enabled(button):
	if not WIRING_PI:
		return False

	pin = button_pin[button]

	state = wiringpi.digitalRead(pin)

	return state == 1
