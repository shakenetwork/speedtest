/*
	HTML5 Speedtest v4.7.2 MPOT - Server selector
	by Federico Dossena
	https://github.com/adolfintel/speedtest/
	GNU LGPLv3 License
*/

//pings the specified URL, then calls the function result. Result will receive a parameter which is either the time it took to ping the URL, or -1 if something went wrong.
var PING_TIMEOUT = 1000;
var USE_PING_TIMEOUT = true; //will be disabled on unsupported browsers
if (/MSIE.(\d+\.\d+)/i.test(navigator.userAgent)) {
	//IE11 doesn't support XHR timeout
	USE_PING_TIMEOUT = false;
}
function ping(url, result) {
	var xhr = new XMLHttpRequest();
	var t = new Date().getTime();
	xhr.onload = function() {
		if (xhr.responseText.length == 0) {
			//we expect an empty response
			var instspd = new Date().getTime() - t; //rough timing estimate
			try {
				//try to get more accurate timing using performance API
				var p = performance.getEntriesByName(url);
				p=p[p.length-1];
				var d = p.responseStart - p.requestStart;
				if (d <= 0) d = p.duration;
				if (d > 0 && d < instspd) instspd = d;
			} catch (e) {}
			result(instspd);
		} else result(-1);
	}.bind(this);
	xhr.onerror = function() {
		result(-1);
	}.bind(this);
	xhr.open("GET", url);
	if (USE_PING_TIMEOUT) {
		try {
			xhr.timeout = PING_TIMEOUT;
			xhr.ontimeout = xhr.onerror;
		} catch (e) {}
	}
	xhr.send();
}

//this function repeatedly pings a server to get a good estimate of the ping. When it's done, it calls the done function without parameters. At the end of the execution, the server will have a new parameter called pingT, which is either the best ping we got from the server or -1 if something went wrong.
var PINGS = 3, //up to 3 pings are performed, unless the server is down...
	SLOW_THRESHOLD = 500; //...or one of the pings is above this threshold
function checkServer(server, done) {
	var i = 0;
	server.pingT = -1;
	if (server.server.indexOf(location.protocol) == -1) done();
	else {
		var nextPing = function() {
			if (i++ == PINGS) {
				done();
				return;
			}
			ping(
				server.server + server.pingURL,
				function(t) {
					if (t >= 0) {
						if (t < server.pingT || server.pingT == -1) server.pingT = t;
						if (t < SLOW_THRESHOLD) nextPing();
						else done();
					} else done();
				}.bind(this)
			);
		}.bind(this);
		nextPing();
	}
}

/*this function goes through a list of servers, each with this format:
{
	name: "User friendly name",
	server:"http://yourBackend.com/",     <---- make sure there's a / at the end!
	dlURL:"garbage.php"    <----- path to garbage.php or its replacement on the server
	ulURL:"empty.php"    <----- path to empty.php or its replacement on the server
	pingURL:"empty.php"    <----- path to empty.php or its replacement on the server. This is used to ping the server by this selector
	getIpURL:"getIP.php"    <----- path to getIP.php or its replacement on the server
}
For each server, the ping is measured, then the server with the function result is called with the best server, or null if all the servers were down.
*/
function selectServer(serverList, result) {
	var i = 0;
	var done = function() {
		var bestServer = null;
		for (var i = 0; i < serverList.length; i++) {
			if (serverList[i].pingT != -1 && (bestServer == null || serverList[i].pingT < bestServer.pingT)) bestServer = serverList[i];
		}
		result(bestServer);
	}.bind(this);
	var nextServer = function() {
		if (i == serverList.length) {
			done();
			return;
		}
		checkServer(serverList[i++], nextServer);
	}.bind(this);
	nextServer();
}

/* 
this function is a faster version of selectServer that tests multiple servers concurrently. Useful for large server lists	
*/
var CONCURRENCY = 4; //4 seems to be the safest value
function fastSelectServer(serverList, result) {
	var serverLists = [];
	for (var i = 0; i < CONCURRENCY; i++) {
		serverLists[i] = [];
	}
	for (var i = 0; i < serverList.length; i++) {
		serverLists[i % CONCURRENCY].push(serverList[i]);
	}
	var completed = 0;
	var bestServer = null;
	for (var i = 0; i < CONCURRENCY; i++) {
		selectServer(
			serverLists[i],
			function(server) {
				if (server != null) {
					if (bestServer == null || server.pingT < bestServer.pingT) bestServer = server;
				}
				completed++;
				if (completed == CONCURRENCY) result(bestServer);
			}.bind(this)
		);
	}
}
