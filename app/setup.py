#!/usr/bin/env python

from setuptools import setup
import os

setup(
    name='SprinklerSwitch',
    version='0.1',
    description='Use a Raspberry Pi to switch on/off a home irrigation system based on public weather data.',
    author='DeckerEgo',
    author_email='deckerego@gmail.com',
    url='https://github.com/deckerego/SprinklerSwitch',
    packages=[''],
    long_description=open('../README.md').read(),
    data_files=[
        ('views',    [os.path.join('views', 'index.tpl')]),
        ('views/js', [os.path.join('views/js', 'mjpeg_viewer.js')]),
        ('views/css',[os.path.join('views/css', 'styles.css')])
    ],
    classifiers=[
    	"License :: OSI Approved :: Mozilla Public License 2.0 (MPL 2.0)",
    	"Programming Language :: Python",
    	"Development Status :: 3 - Alpha",
        "Intended Audience :: End Users/Desktop",
    	"Topic :: Home Automation"
    ],
    keywords='motion security surveillance garage remote raspberrypi',
    requires=[
        'bottle (==0.10.11)',
        'wiringpi (>=1.0.5)',
        'sleekxmpp (>=1.0)'
    ],
	)
