# SprinklerSwitch

A service to manage your home lawn irrigation controller and intelligently enable or disable your sprinkler system.

Currently includes a Node.JS app that can be run as a cron entry in order to set a GPIO pin to high/low if there was
rain in the recent past or rain coming up soon. It is assumed that you have already wired a GPIO pin to a relay
or a MOSFET so you can switch on or off your irrigation system.

_Fair warning_: if you take a deeper look under the hood you may realize that the math makes no sense, and that I'm 
making wild assumptions about weather & soil conditions that often confuse causation and correlation. These are all
valid and good points! The rules engine that determines if the irrigation system should be enabled or disabled was largely
informed by about three months of data collection & subjective observations as summer became fall, so the science
is pretty slim. If you can improve on the logic, submit a pull request or create an issue with a suggested solution
(rather than just pointing out the obvious problems) and I will happily review it!

## Installing

Installing the sprinkler switch requires some hardware installation and installing the SprinklerSwitch scripts:

1. Build a relay or MOSFET switch (see the [Hackaday Project Page](https://hackaday.io/project/7566-sprinkler-switch) for details)
1. Install `apt-get install nodejs`
1. Get the latest version of SprinklerSwitch with `wget https://github.com/deckerego/SprinklerSwitch/releases/latest/download/SprinklerSwitch.zip`
1. Unzip the latest release into a new directory: `unzip SprinklerSwitch.zip -d SprinklerSwitch`
1. Switch to the unzipped directory  `cd SprinklerSwitch`
1. Run the installer script: `sudo sh ./install.sh`

## Configuring

Ensure you update `/etc/sprinklerswitch/config.json` to set your location using your latitude and longitude.

By default SprinklerSwitch uses the GPIO 23 pin on the Raspberry Pi to open/close the sprinkler sensor switch.
With the latest Raspian builds this maps to `gpio-535` but you can map this to any GPIO device you like by
updating `config.json`. Run `cat /sys/kernel/debug/gpio` to get a list of all GPIO pins and their device IDs.

## Testing Locally

Automated tests can be run with:
```
npm ci
npm test
```

You can test locally without setting GPIO pins using:
```
npm ci
npm start
```
