# Request-Stream

Request-Stream is a stream implementing a JSON request and response protocol

	npm install request-stream

## Summary

Request-Stream allows you to send a JSON request and wait for a reply over a stream

To listen and reply to requests you just need to listen to the `request` event

``` js
var r = rs();

fromStream.pipe(r).pipe(fromStream);

r.on('request', function(request, respond) {
	respond(null, request[0]+request[1]); // send a reply back to the requester
});
```

To send requests and wait for replies you call `r.request(message, callback)`

``` js
var rs = require('request-stream');
var r = rs();

toStream.pipe(r).pipe(toStream);

r.request([1,2], function(err, reply) {
	console.log(err, reply); // prints 3
});

r.request([2,3], function(err, reply) {
	console.log(err, reply); // prints 5
});

```

If you don't care about replying to requests you should probably use something like [emit-stream](https://github.com/substack/emit-stream) instead

## Example

Lets try to setup a simple server

``` js
var rs = require('request-stream');
var net = require('net');

net.createServer(function(socket) {
	var r = rs();

	socket.pipe(r).pipe(socket);

	r.on('request', function(request, respond) {
		respond(null, {echo:request});
	});
}).listen(9000);
```

To make a request to the server we need to create a socket to the server and pipe our request to that.

``` js
var socket = net.connect(9000);
var r = rs();

socket.pipe(r).pipe(socket);

r.request('echo me please', function(err, reply) {
	console.log(err, reply);  // prints {echo:'echo me please'}
});
r.request('echo me please again', function(err, reply) {
	console.log(err, reply); // prints {echo:'echo me please again'}
});
```

If we wanted to use `tls` instead of `tcp` we could just have implemented the above example using `tls` streams.
We could even use WebSockets using [shoe](https://github.com/substack/shoe).
