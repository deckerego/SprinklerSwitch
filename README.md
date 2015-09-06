# SprinklerSwitch
A web-enabled extension to your home lawn irrigation controller that intelligently enables or disables your sprinkler system.

A correctly tuned sprinkler system can actually save water if it intelligently shuts itself on and off based on current conditions and forecast weather. The Sprinkler Switch loads forecasted weather information from NOAA and parses previously recorded data to determine if the sprinkler system should run or not.

At least that's the goal.

Currently the system fetches the forecast data from NOAA, visualizes the data on a dashboard, and allows Raspberry Pi GPIO to switch the irrigation controller on or off as an expansion sensor module. This is available over a Web interface, allowing the irrigation system to be controlled remotely.


Installation
------------

1. Install the base packages with `sudo apt-get install python-distribute python-dev python-smbus libapache2-mod-proxy-html libapache2-mod-authnz-external monit`
2. Install the GPIO userspace tools at https://projects.drogon.net/raspberry-pi/wiringpi/download-and-install/
3. Install Node.JS as documented at https://learn.adafruit.com/node-embedded-development/installing-node-dot-js
4. Install Bower using `npm install -g bower`
5. Enable the Apache2 modules using `a2enmod authnz_external proxy_http`
6. Install PIP using `sudo easy_install pip`
7. Clone this repository or download the .ZIP, which will include the Bottle webapp and some admin configs/scripts
8. Install SprinklerSwitch's dependencies using pip install -r app/requirements.txt
9. Expose the GPIO port you connect the garage door opener to using the WiringPi GPIO Utility, e.g. `gpio export 27 out`. You may want to add this statement to `/etc/rc.local` so that it will be exported at startup.
10. Allow www-data to access the GPIO port by adding it to the gpio user group in /etc/group
11. Allow www-data to access to I2C by adding it to the i2c user group in /etc/group
12. Copy the files within the app/ directory into /srv/app
13. Change into the /srv/app/views directory and execute `bower install bootstrap`
14. Copy the service config files from config/etc into the appropriate /etc directory, altering them as needed.
15. Create a copy of app/config.sample as /srv/app/config.py, altering config.py to fit your preferences
16. Start up (or restart) Apache2
17. Ensure config/etc/init.d/sprinkler has been copied to /etc/init.d, then install it using `update-rc.d sprinkler defaults`
18. Start the webapp using `sudo service sprinkler start`
