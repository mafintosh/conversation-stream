var Stream = require('stream');

var noop = function() {};

noop.noop = true; // a flag so you can check if noop has been passed

var RequestStream = function() {
	var self = this;

	this._buffer = '';
	this._offset = 0;

	this._sent = 0;
	this._rcvd = 0;
	this._callbacks = {};

	this.readable = true;
	this.writable = true;

	this.on('pipe', function(from) {
		if (from.setEncoding) from.setEncoding('utf-8');
	});

	this.on('end', function() {
		Object.keys(self._callbacks).forEach(function(key) {
			self._callbacks[key](new Error('stream has ended'));
		});
	});

	Stream.call(this);
};

RequestStream.prototype.__proto__ = Stream.prototype;

RequestStream.prototype.write = function(data) {
	var index = data.indexOf('\n');
	var offset = index+1;

	if (index === -1) {
		this._buffer += data;
		return;
	}

	this._in(this._buffer.substring(this._offset)+data.substring(0,index));

	while ((index = data.indexOf('\n', offset)) > -1) {
		this._in(data.substring(offset, index));
		offset = index+1;
	}

	if (offset === data.length) {
		offset = 0;
		data = '';
	}

	this._offset = offset;
	this._buffer = data;
};

RequestStream.prototype.end = function(data) {
	if (data) this.write(data);
	if (!this.readable) return;
	this.readable = false;
	this.writable = false;
	this.emit('end');
};

RequestStream.prototype.destroy = function() {
	this.end();
};

RequestStream.prototype.request = function(message, callback) {
	if (!callback) return this._out([0, message]);

	var self = this;
	var id = ++this._sent;

	this._callbacks[id] = function(err, value) {
		delete self._callbacks[id];
		self._rcvd++;
		callback(err, value);
		if (self._rcvd === self._sent) self.emit('idle');
	};

	this._out([id,message]);
};

RequestStream.prototype._in = function(message) {
	try {
		message = JSON.parse(message);
	} catch (err) {
		return;
	}

	var id = message[0];

	if (id < 0) return (this._callbacks[-id] || noop)(message[2] && new Error(message[2]), message[1]);

	var self = this;
	var reply = id === 0 ? noop : function(err, message) {
		if (err) return self._out([-id, null, err.message]);
		self._out([-id, message]);
	};

	this.emit('request', message[1], reply);
};

RequestStream.prototype._out = function(message) {
	this.emit('data', JSON.stringify(message)+'\n');
};

module.exports = function() {
	return new RequestStream();
};
