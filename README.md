# request-stream

Request-Stream is a stream implementing a json request and response protocol

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

Since the server is a tcp server we just need to create a tcp socket and pipe our request to that.

``` js
var socket = net.connect(9000);
var r = rs();

socket.pipe(r).pipe(socket);

r.request('echo me please', function(err, reply) {
	console.log(err, reply);
});
```

Since `r` is just a stream we can pipe it to any kind of transport (even WebSockets using [shoe](https://github.com/substack/shoe)).