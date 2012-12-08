# Conversation-Stream

Conversation-Stream allows you to have a JSON conversation over a stream.

	npm install conversation-stream

## Summary

To listen for messages you just need to listen to the `message` event

``` js
var cs = require('conversation-stream')
var conversation = cs();

fromStream.pipe(conversation).pipe(fromStream);

conversation.on('message', function(message, respond) {
	respond(null, {echo:message}); // send a reply back if you want to
});
```

To send messages you call `conversation.send(message)`
To send messages and wait for a reply you call `conversation.send(message, callback)`

``` js
var cs = require('conversation-stream');
var conversation = cs();

toStream.pipe(conversation).pipe(toStream);

conversation.send('hello', function(err, reply) {
	console.log(err, reply); // prints {echo:'hello'}
});

conversation.send('world', function(err, reply) {
	console.log(err, reply); // prints {echo:'world'}
});

```

## Example

Lets try to setup a simple server

``` js
var cs = require('conversation-stream');
var net = require('net');

net.createServer(function(socket) {
	var conversation = cs();

	socket.pipe(conversation).pipe(socket);

	conversation.on('message', function(message, respond) {
		conversation.send({server:message}, respond);
	});
}).listen(9000);
```

To start a conversation to the server we need to create a socket to the server and pipe our message to that.

``` js
var socket = net.connect(9000);
var conversation = cs();

socket.pipe(conversation).pipe(socket);

conversation.on('message', function(message, respond) {
	respond(null, {client:message});
});

conversation.send('echo me please', function(err, reply) {
	console.log(err, reply);  // prints {client:{server:'echo me please'}}
});
conversation.send('echo me please again', function(err, reply) {
	console.log(err, reply); // prints {client:{server:'echo me please again'}}
});
```

If we wanted to use `tls` instead of `tcp` we could just have implemented the above example using `tls` streams.
We could even use WebSockets using [shoe](https://github.com/substack/shoe).
