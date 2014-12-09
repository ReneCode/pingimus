
var moment = require('moment');


var ServerTime = (function() {

	return {
		getExpireTime: function() {
			// 2 min after now
			return moment().add(1, 'm').valueOf();
		},

		getCurrentTime: function() {
			return moment().valueOf();
		}
	};

})();


module.exports = ServerTime;