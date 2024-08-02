#!/bin/bash

if [[ ! -x /bin/node ]]; then
    echo "Node.JS is not installed - exiting!"
    exit -1
fi

echo "Installing SprinklerSwitch"
curl -o- https://github.com/deckerego/SprinklerSwitch/releases/latest/download/SprinklerSwitch.tar.xz
sudo tar xvJf SprinklerSwitch.tar.xz -C /
sudo update-rc.d sprinkler defaults
cd /opt/sprinker
npm install
