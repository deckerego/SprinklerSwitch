#!/bin/bash

echo "Installing NVM if required"
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm install 20
NODE_BIN=$(nvm which 20)
NODE_HOME=$(echo "$NODE_BIN" | sed 's/\/bin\/node//g')

echo "Installing SprinklerSwitch"
curl -o- https://github.com/deckerego/Macropad_4chord_MIDI/releases/download/latest/SprinklerSwitch.tar.xz
sudo tar xvJf SprinklerSwitch.tar.xz -C /
sudo update-rc.d sprinkler defaults
cd /opt/sprinker
npm install

echo "Building config file"
echo "NODE_HOME=$NODE_HOME" > /etc/default/sprinkler
echo "LATITUDE=0.0" >> /etc/default/sprinkler
echo "LONGITUDE=0.0" >> /etc/default/sprinkler
