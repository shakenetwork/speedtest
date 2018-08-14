# HTML5 Speedtest - Multiple Points of Test

__Work in progress!__

This branch isn't stable yet, don't use it in production.  
Documentation isn't done yet.

## Multiple Points of Test
This branch allows usage of multiple test servers instead of just 1. The client runs a server selector, which pings a list of test servers and chooses the one with the best ping.

## Frontend server
This is the server that hosts the UI, the JS files, and optionally the telemetry

## Test backends
These are the servers to which the clients can connect and actually do the test. They don't host the UI, only the PHP files required for the test.

