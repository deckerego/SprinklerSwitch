import urllib
import dateutil.parser #dateutil.parser.parse(text)
from xml.etree import ElementTree
import sqlite3
import logging
import base64
from config import configuration

logger = logging.getLogger('temperature')
noaa_url = "http://graphical.weather.gov/xml/sample_products/browser_interface/ndfdXMLclient.php?lat=%s&lon=%s&product=time-series&Unit=e"

class Forecast(object):
    name = 'forecast'
    keyword = 'forecast'

    def __init__(self):
        lat = configuration.get('latitude')
        lon = configuration.get('longitude')
        self.url = noaa_url % (lat, lon)
        self.timespans = {}
        self.temperatures = []
        self.dewpoints = []
        self.precipitations = []
        self.winds = []
        self.clouds = []

    # This is invoked when installed as a Bottle plugin
    def setup(self, app):
        self.routes = app

        for other in app.plugins:
            if not isinstance(other, Forecast):
                continue
            if other.keyword == self.keyword:
                raise PluginError("Found another instance of Forecast running!")

    # This is invoked within Bottle as part of each route when installed
    def apply(self, callback, route):
        args = inspect.getargspec(callback)[0]
        if self.keyword not in args:
            return callback

        def wrapper(*args, **kwargs):
            kwargs[self.keyword] = self
            rv = callback(*args, **kwargs)
            return rv
        return wrapper

    # De-installation from Bottle as a plugin
    def close(self):
        logger.info("Closing Forecast")

    def start(self):
        logger.info("Opening Forecast")

    def __load_timeseries(self, tree):
        for layout in tree.getroot().iter(tag="time-layout"):
            key = layout.find("layout-key").text
            start_times = map(lambda time: time.text, layout.iter(tag="start-valid-time"))
            end_times = map(lambda time: time.text, layout.iter(tag="end-valid-time"))
            self.timespans[key] = zip(start_times, end_times) if any(end_times) else start_times

    def __load_liquid_precipitation(self, tree):
        for precipitation in tree.getroot().iter(tag="precipitation"):
            time_layout = precipitation.attrib['time-layout']
            precip_type = precipitation.attrib['type']

            if precip_type == "liquid":
                times = iter(self.timespans[time_layout])
                for value in precipitation.iter(tag="value"):
                    starttime, endtime = times.next()
                    self.precipitations.append((starttime, value.text))

    def __load_hourly_temperature(self, tree):
        for temperature in tree.getroot().iter(tag="temperature"):
            time_layout = temperature.attrib['time-layout']
            temp_type = temperature.attrib['type']

            if temp_type == "hourly":
                times = iter(self.timespans[time_layout])
                for value in temperature.iter(tag="value"):
                    self.temperatures.append((times.next(), value.text))

            elif temp_type == "dew point":
                times = iter(self.timespans[time_layout])
                for value in temperature.iter(tag="value"):
                    self.dewpoints.append((times.next(), value.text))

    def __load_hourly_wind(self, tree):
        for speed in tree.getroot().iter(tag="wind-speed"):
            time_layout = speed.attrib['time-layout']
            wind_type = speed.attrib['type']

            if wind_type == "sustained":
                times = iter(self.timespans[time_layout])
                for value in speed.iter(tag="value"):
                    self.winds.append((times.next(), value.text))

        for direction in tree.getroot().iter(tag="direction"):
            table = direction.attrib['time-layout']
            wind_type = direction.attrib['type']

            if wind_type == "wind":
                sequence = -1
                for value in direction.iter(tag="value"):
                    sequence += 1
                    starttime, speed = self.winds[sequence]
                    self.winds[sequence] = (starttime, speed, value.text)

    def __load_hourly_cloudcover(self, tree):
        for cover in tree.getroot().iter(tag="cloud-amount"):
            time_layout = cover.attrib['time-layout']
            cloud_type = cover.attrib['type']

            if cloud_type == "total":
                times = iter(self.timespans[time_layout])
                for value in cover.iter(tag="value"):
                    self.clouds.append((times.next(), value.text))

    def update(self):
        resp = urllib.urlopen(self.url)
        tree = ElementTree.parse(resp)

        self.__load_timeseries(tree)
        self.__load_liquid_precipitation(tree)
        self.__load_hourly_temperature(tree)
        self.__load_hourly_wind(tree)
        self.__load_hourly_cloudcover(tree)

    def temperature(self):
        return self.temperatures

    def dewpoint(self):
        return self.dewpoints

    def precipitation(self):
        return self.precipitations

    def wind(self):
        return self.winds

    def cloudcover(self):
        return self.clouds

class PluginError(Exception):
    pass

Plugin = Forecast
