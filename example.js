var cs = require('conversation-stream');
var net = require('net');

net.createServer(function(socket) {
	var conversation = cs();

	socket.pipe(conversation).pipe(socket);

	conversion.on('message', function(message, respond) {
		conversion.send({server:message}, respond);
	});

}).listen(9585, function() {
	var socket = net.connect(9585);
	var conversion = cs();

	socket.pipe(conversion).pipe(socket);

	conversion.on('message', function(message, respond) {
		respond(null, {client:message});
	});

	conversion.send({hello:'world'}, function(err, reply) {
		console.log(reply);
	});
});
