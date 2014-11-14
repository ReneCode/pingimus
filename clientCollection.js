"use strict"


var ClientCollection = (function() {
	var list = {};

	var addClient = function(name, socketId) {
		list.name = {name:name, socketId: socketId};
	};

	var removeClient = function(name) {
		delete list.name;
	};

	var followOther = function(name, others) {
		var client = list[name];
		if (client) {
			client.follower = others;
		}
	};

	var getMyFollower = function(name) {
		var client = list[name];
		if (client) {
			return client['follower'];
		}
		else {
			return undefined;
		}
	}

	return {
		add: function(name, socketId) {
			addClient(name, socketId)
		},

		remove: function(name) {
			removeClient(name);
		},

		follow: function(name, arr) {
			followOther(name, arr)
		},

		getFollower: function(name) {
			getMyFollower(name);
		}
	}
})();


module.exports = ClientCollection;