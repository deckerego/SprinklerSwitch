#!/usr/bin/env python
# -*- coding: utf-8 -*-

import os
from routes import application
from bottle import run

if __name__ == "__main__":
	port = int(os.environ.get("PORT", 9004))
	run(application, reloader = False, host = 'localhost', port = port)
	application.close()
