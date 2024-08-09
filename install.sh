#!/bin/sh

cp -a etc/cron.d/sprinkler /etc/cron.d
cp -a etc/default/sprinkler /etc/default
cp -a etc/init.d/sprinkler /etc/init.d
update-rc.d sprinkler defaults

mkdir -p /opt/sprinkler
cp package-lock.json package.json sprinkler.js /opt/sprinkler
chown -R pi:pi /opt/sprinkler

service sprinkler start
