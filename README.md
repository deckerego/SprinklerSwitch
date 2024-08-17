# SprinklerSwitch

A service to manage your home lawn irrigation controller and intelligently enable or disable your sprinkler system.

Currently includes a Node.JS app that can be run as a cron entry in order to set a GPIO pin to high/low if there was
rain in the recent past or rain coming up soon. It is assumed that you have already wired a GPIO pin to a relay
or a MOSFET so you can switch on or off your irrigation system.

## Installing

Installing the sprinkler switch requires some hardware installation and installing the SprinklerSwitch scripts:

1. Build a relay or MOSFET switch (see the [Hackaday Project Page](https://hackaday.io/project/7566-sprinkler-switch) for details)
1. Install `apt-get install nodejs`
1. Get the latest version of SprinklerSwitch with `wget https://github.com/deckerego/SprinklerSwitch/archive/refs/heads/main.zip`
1. Unzip the latest release `unzip main.zip`
1. Switch to the unzipped directory  `cd  SprinklerSwitch-main`
1. Run the installer script `sudo ./install.sh`

## Testing Locally

You can test locally by setting the environment variable `DEBUG=true`, as in:
```
node DEBUG=true ./sprinkler.js
```