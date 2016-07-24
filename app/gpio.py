import time
import logging

logger = logging.getLogger('garagesec')
logger.setLevel(20)

WIRING_PI = True
try:
	import wiringpi
except ImportError:
	WIRING_PI = False
	logger.error("Cannot initialize GPIO - Library Not Installed?")

wiringpi.wiringPiSetupSys()

button_pin = {
	0: 27
}

def enable(button):
	if not WIRING_PI:
		logger.warn("Enabled but no GPIO initialized")
		return False

	pin = button_pin[button]

	wiringpi.pinMode(pin, 1)
	wiringpi.digitalWrite(pin, 1)

	return True

def disable(button):
	if not WIRING_PI:
		logger.warn("Disabled but no GPIO initialized")
		return False

	pin = button_pin[button]

	wiringpi.pinMode(pin, 1)
	wiringpi.digitalWrite(pin, 0)

	return True

def is_enabled(button):
	if not WIRING_PI:
		return False

	pin = button_pin[button]

	wiringpi.pinMode(pin, 1)
	state = wiringpi.digitalRead(pin)

	return state == 1
