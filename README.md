# SprinklerSwitch

A service to manage your home lawn irrigation controller and intelligently enable or disable your sprinkler system.

Currently includes a Node.JS app that can be run as a cron entry in order to set a GPIO pin to high/low if there was
rain in the recent past or rain coming up soon. It is assumed that you have already wired a GPIO pin to a relay
or a MOSFET so you can switch on or off your irrigation system.

## Installing

1. Build a relay or MOSFET switch
1. Install `apt-get install nodejs`
1. `sudo update-rc.d sprinkler defaults`

## Building

`dpkg-buildpackage -rfakeroot -uc -us`