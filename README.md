![HTML5 Speedtest Logo](https://github.com/adolfintel/speedtest/blob/master/.logo/Readme-Logo.png?raw=true)

# HTML5 Speedtest

No Flash, No Java, No Websocket, No Bullshit.

This is a very lightweight Speedtest implemented in Javascript, using XMLHttpRequest and Web Workers.

## Try it
[Take a Speedtest](http://speedtest.fdossena.com)

## Compatibility
All modern browsers are supported: IE11, latest Edge, latest Chrome, latest Firefox, latest Safari.  
Works with mobile versions too.

## Features
* Download
* Upload
* Ping
* Jitter
* IP Address, ISP, distance from server (optional)
* Telemetry (optional)
* Results sharing (optional)
* Multiple Points of Test (optional)

![Screenshot](https://speedtest.fdossena.com/mpot_v5.gif)


## Server requirements
* A reasonably fast web server with Apache 2 (nginx, IIS also supported)
* PHP 5.4 (other backends also available)
* MySQL database to store test results (optional, PostgreSQL and SQLite also supported)
* A fast! internet connection

<<<<<<< HEAD
## Quick installation videos
* [Debian 9.0 with Apache](https://fdossena.com/?p=speedtest/quickstart_deb.frag)
* [Windows Server 2016 with IIS](https://fdossena.com/?p=speedtest/quickstart_win.frag)
* [Ubuntu (External)](https://freedif.org/how-to-install-selfhosted-speedtest)

Also, here's an [example config on Ubuntu 16 LTS](https://github.com/adolfintel/speedtest/issues/50)

## How to use in your site
* See the examples
* [Read the wiki](https://github.com/adolfintel/speedtest/wiki)
* Read doc.md

## Docker + Docker Compose

The project includes a basic `docker-compose.yml` for development.  To run, execute the following:

```
$ docker-compose build

$ docker-compose up
```


Speedtest will be available at [http://0.0.0.0:8888/](http://0.0.0.0:8888/).  You can try out all of the examples via their associated urls (i.e. `http://0.0.0.0:8888/example1.html`).

To run via Docker directly:

```
$ docker build -t adolfintel/speedtest:latest .

$ docker run -d --name  speedtest -p 0.0.0.0:80:80 adolfintel/speedtest:latest
```

## Multiple test servers
Please see the ```mpot``` branch

=======
## Installation videos
* [Quick start installation guide for Ubuntu Server 19.04](https://fdossena.com/?p=speedtest/quickstart_v5_ubuntu.frag)

## Docker
Please see the `docker` branch

>>>>>>> master
## Node.js backend
A Node.js implementation is available in the `node` branch, maintained by [dunklesToast](https://github.com/dunklesToast).

## Donate
[![Donate with Liberapay](https://liberapay.com/assets/widgets/donate.svg)](https://liberapay.com/fdossena/donate)  
[Donate with PayPal](https://www.paypal.me/sineisochronic)  

## License
Copyright (C) 2016-2019 Federico Dossena

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Lesser General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU Lesser General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/lgpl>.

