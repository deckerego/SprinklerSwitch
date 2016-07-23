# SprinklerSwitch
A web-enabled extension to your home lawn irrigation controller that intelligently enables or disables your sprinkler system.

A correctly tuned sprinkler system can actually save water if it intelligently shuts itself on and off based on current conditions and forecast weather. The Sprinkler Switch loads forecasted weather information from NOAA and parses previously recorded data to determine if the sprinkler system should run or not.

At least that's the goal.

Currently the system fetches the forecast data from NOAA, visualizes the data on a dashboard, and allows Raspberry Pi GPIO to switch the irrigation controller on or off as an expansion sensor module. This is available over a Web interface, allowing the irrigation system to be controlled remotely.


Security & OS Setup
-------------------

Ensure you install necessary updates and install a firewall (such as UFW) before proceeding. Rather than exposing motion and other services externally, we will be proxying them through Apache. This means the only ports you should need to open are port 80 (HTTP) and port 22 (SSH), especially since motion hasn't has as extensive vetting for security. As an example, you could setup a simple firewall as:
~~~~
sudo apt-get install ufw
sudo ufw allow 80
sudo ufw allow 22
sudo ufw enable
~~~~
Bear in mind GarageSec uses BASIC HTTP authentication and does not necessarily support SSL out of the box (although you could definitely add it), so man-in-the-middle interception of your password is super-de-duper possible.

Also - the latest version of Raspian (Jessie) doesn't bring up wireless interfaces on boot by default, even for the RPi 3. Which is odd. To fix this, make sure your wireless interfaces in `/etc/network/interfaces` are set to "auto," such as:
~~~~
auto wlan0
allow-hotplug wlan0
iface wlan0 inet manual
    wpa-conf /etc/wpa_supplicant/wpa_supplicant.conf
~~~~

It may be a good idea to create a crontab entry to delete old captured videos, e.g. `0 1 * * * find /home/motion -ctime +14 -delete`

To enable I2C communication for temperature and humidity monitoring, follow the I2C instructions from Adafruit available at https://learn.adafruit.com/adafruits-raspberry-pi-lesson-4-gpio-setup/configuring-i2c


Software Installation
---------------------

These installation instructions have been tested with the latest version of Raspian "Jessie" with device trees enabled (which I believe is the default)

1. Install the base packages with `sudo apt-get install wiringpi python-dev python-smbus apache2 libapache2-mod-proxy-html libapache2-mod-authnz-external nodejs-legacy npm monit`
2. Install Bower using `sudo npm install -g bower`
3. Enable the Apache2 modules using `sudo a2enmod authnz_external proxy_http`
4. Clone this repository or download https://github.com/deckerego/SprinklerSwitch/archive/master.zip which will include the Bottle webapp and some admin configs/scripts
5. Install SprinklerSwitch's dependencies using `sudo pip install -r app/requirements.txt`
6. Expose the GPIO port you connect the garage door opener to using the WiringPi GPIO Utility, e.g. `gpio export 27 out`. You may want to add this statement to `/etc/rc.local` so that it will be exported at startup.
7. Copy the files within the app/ directory into /srv/sprinkler
8. Change into the /srv/sprinkler/views directory and execute `bower install Chart.js bootstrap`
9. Copy the service config files from config/etc into the appropriate /etc directory, altering them as needed.
10. Create a copy of app/config.sample as /srv/app/config.py, altering config.py to fit your preferences
11. Enable the webapp with `sudo a2dissite 000-default`, followed by `sudo a2ensite sprinkler`, then start up (or restart) Apache2
12. Ensure config/etc/init.d/sprinkler has been copied to /etc/init.d, then install it using `sudo update-rc.d sprinkler defaults`
13. Start the webapp using `sudo service sprinkler start`
