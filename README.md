# Request-Stream

Request-Stream is a stream implementing a JSON request and response protocol

	npm install request-stream

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
