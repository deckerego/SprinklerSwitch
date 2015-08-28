import urllib
import dateutil.parser #dateutil.parser.parse(text)
from xml.etree import ElementTree
import sqlite3
import logging
import base64

class Forecast(object):
    def __init__(self, lat, lon):
        self.url = "http://graphical.weather.gov/xml/sample_products/browser_interface/ndfdXMLclient.php?lat=%s&lon=%s&product=time-series&Unit=e" % (lat, lon)
        self.db_destroy = False
        self.db_name = base64.b64encode("%s,%s" % (lat, lon))
        self.db_conn = sqlite3.connect("%s.db" % self.db_name)

    def __del__(self):
        self.db_conn.close()

    def __load_timetables(self, tree):
        cursor = self.db_conn.cursor()

        for time in tree.getroot().iter(tag="time-layout"):
            table = None
            sequence = -1

            for child in time.getchildren():
                if child.tag == "layout-key":
                    table = child.text

                    logging.info("Re-creating table %s" % table)
                    cursor.execute("DROP TABLE IF EXISTS [%s]" % table)
                    cursor.execute("CREATE TABLE [%s] (sequence integer PRIMARY KEY, starttime text, endtime text)" % table)

                elif child.tag == "start-valid-time":
                    sequence += 1

                    logging.debug("Inserting (Replacing) record %s in %s" % (sequence, table))
                    cursor.execute("INSERT OR REPLACE INTO [%s] VALUES (?, ?, null)" % table, (sequence, child.text))

                elif child.tag == "end-valid-time":
                    logging.debug("Updating record %s with %s in %s" % (sequence, child.text, table))
                    cursor.execute("UPDATE [%s] SET endtime=? where sequence=?" % table, (child.text, sequence))

            self.db_conn.commit()

    def __load_liquid_precipitation(self, tree):
        cursor = self.db_conn.cursor()

        if self.db_destroy:
            logging.warn("Dropping table precipitation")
            cursor.execute("DROP TABLE IF EXISTS [precipitation]")

        logging.debug("Creating table precipitation if it doesn't exist")
        cursor.execute("CREATE TABLE IF NOT EXISTS [precipitation] (starttime text PRIMARY KEY, endtime text, precipitation real)")

        for precipitation in tree.getroot().iter(tag="precipitation"):
            table = precipitation.attrib['time-layout']
            precip_type = precipitation.attrib['type']

            if precip_type == "liquid":
                sequence = -1
                for value in precipitation.iter(tag="value"):
                    sequence += 1

                    cursor.execute("SELECT starttime, endtime FROM [%s] where sequence=?" % table, (sequence,))
                    starttime, endtime = cursor.fetchone()

                    logging.debug("Inserting record %s with %s in precipitation_liquid" % (starttime, value.text))
                    cursor.execute("INSERT OR REPLACE INTO [precipitation_liquid] VALUES (?, ?, ?)", (starttime, endtime, value.text))
                self.db_conn.commit()

    def __load_liquid_precipitation(self, tree):
        cursor = self.db_conn.cursor()

        if self.db_destroy:
            logging.warn("Dropping table precipitation")
            cursor.execute("DROP TABLE IF EXISTS [precipitation_liquid]")

        logging.debug("Creating table precipitation if it doesn't exist")
        cursor.execute("CREATE TABLE IF NOT EXISTS [precipitation_liquid] (starttime text PRIMARY KEY, endtime text, precipitation real)")

        for precipitation in tree.getroot().iter(tag="precipitation"):
            table = precipitation.attrib['time-layout']
            precip_type = precipitation.attrib['type']

            if precip_type == "liquid":
                sequence = -1
                for value in precipitation.iter(tag="value"):
                    sequence += 1

                    cursor.execute("SELECT starttime, endtime FROM [%s] where sequence=?" % table, (sequence,))
                    starttime, endtime = cursor.fetchone()

                    logging.debug("Inserting liquid %s with %s in precipitation_liquid" % (starttime, value.text))
                    cursor.execute("INSERT OR REPLACE INTO [precipitation_liquid] VALUES (?, ?, ?)", (starttime, endtime, value.text))
                self.db_conn.commit()

    def __load_hourly_temperature(self, tree):
        cursor = self.db_conn.cursor()

        if self.db_destroy:
            logging.warn("Dropping table temperature_hourly")
            cursor.execute("DROP TABLE IF EXISTS [temperature_hourly]")

        logging.debug("Creating table temperature_hourly if it doesn't exist")
        cursor.execute("CREATE TABLE IF NOT EXISTS [temperature_hourly] (starttime text PRIMARY KEY, temperature integer, dewpoint integer)")

        for precipitation in tree.getroot().iter(tag="temperature"):
            table = precipitation.attrib['time-layout']
            temp_type = precipitation.attrib['type']

            if temp_type == "hourly":
                sequence = -1
                for value in precipitation.iter(tag="value"):
                    sequence += 1

                    cursor.execute("SELECT starttime FROM [%s] where sequence=?" % table, (sequence,))
                    starttime = cursor.fetchone()[0]

                    logging.debug("Inserting temp %s with %s in temperature_hourly" % (starttime, value.text))
                    cursor.execute("INSERT OR REPLACE INTO [temperature_hourly] VALUES (?, ?, null)", (starttime, value.text))
                self.db_conn.commit()

            elif temp_type == "dew point":
                sequence = -1
                for value in precipitation.iter(tag="value"):
                    sequence += 1

                    cursor.execute("SELECT starttime FROM [%s] where sequence=?" % table, (sequence,))
                    starttime = cursor.fetchone()[0]

                    logging.debug("Updating dewpoint %s with %s in temperature_hourly" % (starttime, value.text))
                    cursor.execute("UPDATE [temperature_hourly] SET dewpoint=? WHERE starttime=?", (value.text, starttime))
                self.db_conn.commit()

    def __load_hourly_wind(self, tree):
        cursor = self.db_conn.cursor()

        if self.db_destroy:
            logging.warn("Dropping table wind_hourly")
            cursor.execute("DROP TABLE IF EXISTS [wind_hourly]")

        logging.debug("Creating table wind_hourly if it doesn't exist")
        cursor.execute("CREATE TABLE IF NOT EXISTS [wind_hourly] (starttime text PRIMARY KEY, speed integer, direction integer)")

        for precipitation in tree.getroot().iter(tag="wind-speed"):
            table = precipitation.attrib['time-layout']
            wind_type = precipitation.attrib['type']

            if wind_type == "sustained":
                sequence = -1
                for value in precipitation.iter(tag="value"):
                    sequence += 1

                    cursor.execute("SELECT starttime FROM [%s] where sequence=?" % table, (sequence,))
                    starttime = cursor.fetchone()[0]

                    logging.debug("Inserting speed %s with %s in wind_hourly" % (starttime, value.text))
                    cursor.execute("INSERT OR REPLACE INTO [wind_hourly] VALUES (?, ?, null)", (starttime, value.text))
                self.db_conn.commit()

        for precipitation in tree.getroot().iter(tag="direction"):
            table = precipitation.attrib['time-layout']
            wind_type = precipitation.attrib['type']

            if wind_type == "wind":
                sequence = -1
                for value in precipitation.iter(tag="value"):
                    sequence += 1

                    cursor.execute("SELECT starttime FROM [%s] where sequence=?" % table, (sequence,))
                    starttime = cursor.fetchone()[0]

                    logging.debug("Updating direction %s with %s in wind_hourly" % (starttime, value.text))
                    cursor.execute("UPDATE [wind_hourly] SET direction=? WHERE starttime=?", (value.text, starttime))
                self.db_conn.commit()

    def update(self):
        layouts = {}
        cursor = self.db_conn.cursor()
        resp = urllib.urlopen(self.url)
        tree = ElementTree.parse(resp)

        self.__load_timetables(tree)
        self.__load_liquid_precipitation(tree)
        self.__load_hourly_temperature(tree)
        self.__load_hourly_wind(tree)

    def temperature(self):
        cursor = self.db_conn.cursor()
        cursor.execute("SELECT * FROM [temperature_hourly]")
        return cursor.fetchall()

    def precipitation(self):
        cursor = self.db_conn.cursor()
        cursor.execute("SELECT * FROM [precipitation_liquid]")
        return cursor.fetchall()

    def wind(self):
        cursor = self.db_conn.cursor()
        cursor.execute("SELECT * FROM [wind_hourly]")
        return cursor.fetchall()
