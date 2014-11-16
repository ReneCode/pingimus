
"use strict"


var Protocol = (function() {

	var _log = function(text) {
		console.log(text);
	};




	return {
		log: function(data) {
			return _log(data);
	},


	}
})();


module.exports = Protocol;