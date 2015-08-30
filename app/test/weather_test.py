import os,sys
sys.path.insert(1, os.path.join(sys.path[0], '..'))
from noaa import Forecast

forecast = Forecast()
forecast.update()

print "\n*** Temperature ***"
for temp in forecast.temperature():
    print temp

print "\n*** Precipitation ***"
for precip in forecast.precipitation():
    print precip

print "\n*** Wind ***"
for wind in forecast.wind():
    print wind

print "\n*** Cloud Cover ***"
for cloudcover in forecast.cloudcover():
    print cloudcover
