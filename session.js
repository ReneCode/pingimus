
"use strict"


var Protocol = require('./protocol')

var Session = (function() {

	var user = {};

	var _login = function(data) {
		var aData = data.split(',');
		var name = aData.shift();
		var pw = aData.shift();
		// alread logged in ?
		if (user.hasOwnProperty(name)) {
			return undefined;
		}
		user[name] = { name: name };
		Protocol.log("user:" + name  + " logged in.");
		return name;
	};




	return {
		login: function(data) {
			return _login(data);
	},


	}
})();


module.exports = Session;