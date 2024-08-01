#!/bin/bash

# Ensure node is installed
-x /bin/node

echo "Installing SprinklerSwitch"
curl -o- https://github.com/deckerego/Macropad_4chord_MIDI/releases/download/latest/SprinklerSwitch.tar.xz
sudo tar xvJf SprinklerSwitch.tar.xz -C /
sudo update-rc.d sprinkler defaults
cd /opt/sprinker
npm install
