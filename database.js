"use strict"


var redis = require('redis');

var Database = function() {


	return {
		storeUser: function(user) {
			return _storeUser(user);
		},
		
		loadUser: function(username) {
			
		}
	}

}();


module.exports = Database;

