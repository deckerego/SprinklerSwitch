import time

WIRING_PI = True
try:
	import wiringpi
except ImportError:
	WIRING_PI = False

button_pin = {
	0: 27
}

def enable(button):
	if not WIRING_PI:
		return False

	pin = button_pin[button]

	io = wiringpi.GPIO(wiringpi.GPIO.WPI_MODE_SYS)
	io.pinMode(pin, io.OUTPUT)
	io.digitalWrite(pin, io.HIGH)

	return True

def disable(button):
	if not WIRING_PI:
		return False

	pin = button_pin[button]

	io = wiringpi.GPIO(wiringpi.GPIO.WPI_MODE_SYS)
	io.pinMode(pin, io.OUTPUT)
	io.digitalWrite(pin, io.LOW)

	return True

def is_enabled(button):
	if not WIRING_PI:
		return False

	pin = button_pin[button]

	io = wiringpi.GPIO(wiringpi.GPIO.WPI_MODE_SYS)
	state = io.digitalRead(pin)

	return state == 1
