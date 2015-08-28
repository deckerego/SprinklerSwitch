import os,sys
sys.path.insert(1, os.path.join(sys.path[0], '..'))
from forecast import Forecast

forecast = Forecast(39.5119795, -82.1713632)
forecast.update()

for temp in forecast.temperature():
    print temp

for precip in forecast.precipitation():
    print precip

for wind in forecast.wind():
    print wind
