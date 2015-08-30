#!/usr/bin/env python
# -*- coding: utf-8 -*-

import os
import sys
import logging

logging.basicConfig(level=logging.WARN, format='%(levelname)-8s %(message)s')
logger = logging.getLogger('sprinkerswitch')

os.chdir(os.path.dirname(__file__))
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), ".")))

import gpio
import json
import time
import datetime
from HIH6130 import Temperature
from config import configuration
from bottle import Bottle, HTTPResponse, static_file, get, put, request, response, template

instance_name = configuration.get('instance_name')

temperature = Temperature()

application = Bottle()
application.install(temperature)

last_area_detected = None

@application.route('/favicon.ico')
def send_favicon():
	return static_file('favicon.ico', root='views/images')

@application.route('/js/<filename:path>')
def send_js(filename):
	return static_file(filename, root='views/js')

@application.route('/css/<filename:path>')
def send_css(filename):
	return static_file(filename, root='views/css')

@application.get('/')
def dashboard():
	return template('index', webcam_url=configuration.get('webcam_url'))

@application.get('/environment')
def get_environment(temperature):
	humidity, celsius, status = temperature.get_conditions()
	fahrenheit_val = ((celsius * 9) / 5) + 32 if celsius else "null"
	celsius_val = celsius if celsius else "null"
	humidity_val = humidity if humidity else "null"
	status_val = status if status else "null"
	return '{ "relative_humidity": %s, "celsius": %s, "fahrenheit": %s, "status": %s }' % (humidity_val, celsius_val, fahrenheit_val, status_val)

@application.get('/forecast/temperature')
def get_temperature(forecast):
	

@application.get('/switch/<button:int>')
def get_switch_status(button):
	return '{ "enabled": %s }' % ("true" if gpio.is_enabled(button) else "false")

@application.put('/switch/<button:int>')
def set_switch_status(button):
	if request.json['enabled']:
		gpio.enable(button)
		logging.info("Switch %d ON" % button)
	else:
		gpio.disable(button)
		logging.info("Switch %d OFF" % button)
	return get_switch_status(button)
