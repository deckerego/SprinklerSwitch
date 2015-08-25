import urllib
import dateutil.parser #dateutil.parser.parse(text)
from xml.etree import ElementTree
import sqlite3
import logging

class Forecast(object):
    def __init__(self, lat, lon):
        self.url = "http://graphical.weather.gov/xml/sample_products/browser_interface/ndfdXMLclient.php?lat=%s&lon=%s&product=time-series&Unit=e" % (lat, lon)
        self.db_destroy = False
        self.db_conn = sqlite3.connect('forecast.db')

    def __del__(self):
        self.db_conn.close()

    def update(self):
        resp = urllib.urlopen(self.url)
        tree = ElementTree.parse(resp)
        layouts = {}

        # Create initial timesequence data
        cursor = self.db_conn.cursor()
        for time in tree.getroot().iter(tag="time-layout"):
            table = None
            sequence = -1
            key = None

            for child in time.getchildren():
                if child.tag == "layout-key":
                    table = child.text
                    layouts[table] = {}

                    if self.db_destroy:
                        logging.warn("Dropping table %s" % table)
                        cursor.execute("DROP TABLE IF EXISTS [%s]" % table)

                    logging.debug("Creating table %s if it doesn't exist" % table)
                    cursor.execute("CREATE TABLE IF NOT EXISTS [%s] (starttime text PRIMARY KEY, endtime text, precipitation real)" % table)

                elif child.tag == "start-valid-time":
                    sequence += 1
                    key = child.text
                    layouts[table][sequence] = key

                    logging.debug("Inserting (Replacing) record %s in %s" % (key, table))
                    cursor.execute("INSERT OR REPLACE INTO [%s] VALUES (?, null, null)" % table, [(key),])

                elif child.tag == "end-valid-time":
                    logging.debug("Updating record %s with %s in %s" % (key, child.text, table))
                    cursor.execute("UPDATE [%s] SET endtime=? where starttime=?" % table, (child.text, key))
            self.db_conn.commit()

        # Update with precipitation data
        cursor = self.db_conn.cursor()
        for precipitation in tree.getroot().iter(tag="precipitation"):
            table = precipitation.attrib['time-layout']
            precip_type = precipitation.attrib['type']
            sequence = -1

            if precip_type == "liquid":
                for value in precipitation.iter(tag="value"):
                    sequence += 1
                    key = layouts[table][sequence]

                    logging.debug("Updating record %s with %s in %s" % (key, value.text, table))
                    cursor.execute("UPDATE [%s] SET precipitation=? where starttime=?" % table, (value.text, key))
                self.db_conn.commit()

    def read(self):
        cursor = self.db_conn.cursor()
        for row in cursor.execute("SELECT * FROM [k-p1h-n34-22]"):
            print row
