# HTML5 Speedtest - Multiple Points of Test

> by Federico Dossena  
> Version 4.7.2 MPOT
> [https://github.com/adolfintel/speedtest/tree/mpot](https://github.com/adolfintel/speedtest/tree/mpot)

## Introduction
This version of the HTML5 Speedtest project allows multiple test servers, with the client choosing the one with the best ping when performing the test.  
This is an advanced feature, so you must already be familiar with the [regular version of the speedtest](https://github.com/adolfintel/speedtest/) to use this.

The client side requirements for running the MPOT version are the same as the regular version.  
A browser that supports XHR Level 2, Web Workers and CORS should be able to run the test. IE11 and newer browsers all support these features.

## Installation
We have to distinguish between 2 types of servers:
* Frontend server: This is the server that hosts the test UI, the JS files, and optionally the telemetry and results stuff. There is only 1 of these and it's the server that your clients will first connect to. This web server doesn't need a fast CPU or internet connection, since it's only transferring a few kilobytes of data to run the test.
* Test backends: These are the servers that are used to perform the test. There can be 1 or more of these, and they only host the PHP files to run the test (or the replacements if you're not using PHP). These web servers must be as fast as possible. At least 100mbps of bandwidth is recommended.

PHP 5.4 or newer is required on all servers. OpenSSL and its PHP module must be installed on the backends. Some type of database (mysql/sqlite/postgresql) must be installed on the frontend server to use the telemetry. FreeType2 and its PHP module must be installed on the frontend to use results sharing.

### Download the latest version of the MPOT branch
The download contains 2 folders named `Frontend` and `Test backends`.

### Frontend server
To install the frontend for the speedtest, copy these files from the `Frontend` folder to your frontend server:
* `speedtest_worker.js`
* `server_selector.js`
* one of the examples
* the `telemetry` and `results` folders if you want to use telemetry

### Backend servers
Each backend server for the speedtest needs the following files from the `Test backends` folder:
* empty.php
* garbage.php
* getIP.php

Alternatively, if you're not using PHP, you'll need your replacements here.

### Configuring the frontend for your backend servers
The examples already contain everything you need to get started. All you have to do is remove the demo servers and replace them with your backends.

___Important___:
* You can't mix HTTP with HTTPS: if the frontend uses HTTP, you can only connect to HTTP backends; if the frontend uses HTTPS, you can only connect to HTTPS backends; you can't have some HTTP backends and some HTTPS backends
* If you're using HTTPS, all servers must have valid certificates or the browser will refuse to connect
* If your frontend supports both HTTP and HTTPS, declare your backends twice, once with HTTP and once with HTTPS

The examples contain a list of servers expressed as a JS object array called `SPEEDTEST_SERVERS`.  
The first thing to do is remove the demo servers (you'll see that there are 4 of them, 2 HTTP and 2 HTTPS) and put your own servers.

The list looks like this:
```js
var SPEEDTEST_SERVERS=[
	{...server1...},
	{...server2...},
	...
	{...serverN...}
];
```
Be very careful with the commas.

Each element in the list must have the following elements:
* `name`: a string with a user friendly name for this server. Example: `Milano, IT`
* `server`: the full URL to your server, ___with a / at the end___. Example: `http://backend1.myspeedtest.net/`
* `dlURL`: the path on your server where the download test can be performed. Default: `garbage.php`
* `ulURL`: the path on your server where the upload test can be performed. Default: `empty.php`
* `pingURL`: the path on your server where the ping test can be performed. Default: `empty.php`. This is also used by the server selector to check the ping to your server.
* `getIpURL`: the path on your server where the IP and optionally ISP info can be retrieved. Default: `getIP.php`

None of these parameters can be omitted in any of the servers or the test.

Example:
```js
{
	name:"Milano, IT",
	server:"http://backend1.myspeedtest.net/",
	dlURL:"garbage.php",
	ulURL:"empty.php",
	pingURL:"empty.php",
	getIpURL:"getIP.php"
}
```

## Advanced usage
Consider this section as an extension of the Advanced usage section in the regular speedtest documentation.  
Here we'll focus mostly on how the server selector can be used if you want to make a custom frontend instead of adapting one of the examples.

### Server selector
First, import the server selector.
```html
<script type="text/javascript" src="server_selector.min.js"></script>
```

Then, declare your list of servers like in the previous section:
```js
var SPEEDTEST_SERVERS=[
	{
		name:"Backend 1",
		server:"http://backend1.myspeedtest.net/",
		dlURL:"garbage.php",
		ulURL:"empty.php",
		pingURL:"empty.php",
		getIpURL:"getIP.php"
	},
	{
		name:"Backend 2",
		server:"http://backend2.myspeedtest.net/",
		dlURL:"garbage.php",
		ulURL:"empty.php",
		pingURL:"empty.php",
		getIpURL:"getIP.php"
	}
];
```

Now call the server selector and prepare the speedtest:
```js
var speedtestSettings={
	//optional: add additional speedtest settings here
};
fastSelectServer(SPEEDTEST_SERVERS,function(server){
	if(server!=null){ //found a server
		//configure speedtest to use the specified server
		speedtestSettings.url_dl=server.server+server.dlURL;
		speedtestSettings.url_ul=server.server+server.ulURL;
		speedtestSettings.url_ping=server.server+server.pingURL;
		speedtestSettings.url_getIp=server.server+server.getIpURL;
		speedtestSettings.telemetry_extra=JSON.stringify({server:server.name}); //add server name as extra data in the telemetry
		//update the UI
	}else{ //all servers were unreachable
		//show an error
	}
});
```
The callback function is called with a `server` parameter. This parameter is either one of the servers in your list or `null` if all of them were down.

___Note___: the function `selectServer` can also be used, but `fastSelectServer` is generally better because it's parallel.

Finally, start the speedtest (possibly in response to the user pressing a start button):
```js
w.postMessage('start '+JSON.stringify(speedtestSettings));
```
Where w is the speedtest worker, already configured as explained in the documentation for the regular version of the speedtest.

### New parameters for the speedtest worker
In addition to all the test parameters of the regular version, the MPOT version has 1 additional advanced setting that should not be changed (yet).

* ___xhr_ul_sendPostRequestBeforeStartingTest___: if set to true, an empty POST request is sent before starting the upload test. This works around some bugs related to CORS headers in some browsers, but the upload test will take slightly longer to start.
	* Default: `true`

## Setting up telemetry and results sharing
Telemetry and results sharing works the same as in the regular version. The only thing to know is that all data is stored on your frontend server.  
The examples also store the name of the backend server used for each test in the `extra` field of each entry in the database.

Like the regular version, the supported databases are mysql, postgresql and sqlite. To setup telemetry and results sharing, you must edit `telemetry/telemetry_settings.php` with your database settings.

You can find more info about this in the documentation for the regular version of the speedtest.

## Usage with other backends or without PHP
Like the regular version, PHP is not mandatory for the backends, other backends can be written. Everything explained in the documentation for the regular version of the speedtest still applies, but in addition to that, it's mandatory for this version that the following CORS headers are sent by all the replacements:
```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST
```

The URLs for the replacements go in the `dlURL`, `ulURL`, `pingURL` and `getIpURL` fields in the list of test servers.

## Contributing
Just like the regular version, this is an open source project and you are free to make changes.

If you make changes to the speedtest worker or the server selector, these are the commands to rebuild the minified versions using [UglifyJS](https://github.com/mishoo/UglifyJS2):
```
uglifyjs -c -o speedtest_worker.min.js -- speedtest_worker.js
uglifyjs -c -o server_selector.min.js -- server_selector.js
```

