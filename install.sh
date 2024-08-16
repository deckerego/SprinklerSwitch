#!/bin/sh

cp -a etc/cron.d/sprinklerswitch /etc/cron.d
chown root:root /etc/cron.d/sprinklerswitch
[ ! -f /etc/default/sprinklerswitch ] && cp -a etc/default/sprinklerswitch /etc/default
cp -a etc/init.d/sprinklerswitch /etc/init.d
[ ! -f /etc/sprinklerswitch/config.json ] && cp -a etc/sprinklerswitch /etc
update-rc.d sprinklerswitch defaults

mkdir -p /opt/sprinklerswitch
cp package-lock.json package.json sprinkler.js /opt/sprinklerswitch
chown -R pi:pi /opt/sprinklerswitch
cd /opt/sprinklerswitch
npm ci

service sprinklerswitch start
