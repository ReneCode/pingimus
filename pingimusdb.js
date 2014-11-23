"use strict"


var redis = require('redis');

var PingimusDb = function() {


	return {
		storeUser: function(user) {
			return _storeUser(user);
		},
		
	}

}();


module.exports = PingimusDb;

