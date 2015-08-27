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

    def __load_precipitation(self, tree):
        cursor = self.db_conn.cursor()

        if self.db_destroy:
            logging.warn("Dropping table precipitation")
            cursor.execute("DROP TABLE IF EXISTS [precipitation]")

        logging.debug("Creating table precipitation if it doesn't exist")
        cursor.execute("CREATE TABLE IF NOT EXISTS [precipitation] (starttime text PRIMARY KEY, endtime text, precipitation real)")

        for precipitation in tree.getroot().iter(tag="precipitation"):
            table = precipitation.attrib['time-layout']
            precip_type = precipitation.attrib['type']
            sequence = -1

            if precip_type == "liquid":
                for value in precipitation.iter(tag="value"):
                    sequence += 1

                    cursor.execute("SELECT starttime, endtime FROM [%s] where sequence=?" % table, (sequence,))
                    starttime, endtime = cursor.fetchone()

                    logging.debug("Inserting record %s with %s in precipitation" % (starttime, value.text))
                    cursor.execute("INSERT OR REPLACE INTO [precipitation] VALUES (?, ?, ?)", (starttime, endtime, value.text))
                self.db_conn.commit()

    def update(self):
        layouts = {}
        cursor = self.db_conn.cursor()
        resp = urllib.urlopen(self.url)
        tree = ElementTree.parse(resp)

        self.__load_timetables(tree)
        self.__load_precipitation(tree)

    def read(self):
        cursor = self.db_conn.cursor()
        for row in cursor.execute("SELECT * FROM [precipitation]"):
            print row
