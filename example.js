var rs = require('request-stream');
var net = require('net');

net.createServer(function(socket) {
	var r = rs();

	socket.pipe(r).pipe(socket);

	r.on('request', function(request, respond) {
		r.request({server:request}, respond);
	});

}).listen(9585, function() {
	var socket = net.connect(9585);
	var r = rs();

	socket.pipe(r).pipe(socket);

	r.on('request', function(request, respond) {
		respond(null, {client:request});
	});

	r.request({hello:'world'}, function(err, reply) {
		console.log(reply);
	});
});