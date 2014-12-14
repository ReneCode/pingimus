

"use strict"

var ClientBuffer = function(sendToServerCb) {
	var sendToServerCallback = sendToServerCb;
	var bufferList = [];

	var receiveDataFromServer = function(data) {
		switch (data.cmd) {
			case 'cmdlist':
				var expire = data.para.expire;
				var create = data.para.create;
				bufferList.forEach( function(c) {
					if (!c.hasOwnProperty('expire')) {
						c.expire = expire;
						c.create = create;
					}
				});
				break;
		}
	}

	return {
		add: function(data) {
			bufferList.push(data);
		},

		tryToSendToServer: function(callback) {

			// do not send that command, that have already got 
			// expire-date from server (that are already sent)
			var sendList = bufferList.filter( function(c) {
				return !c.hasOwnProperty('expire');
			});

			var data = {
		        cmd: 'cmdlist',
		        para: JSON.stringify(sendList)
		    };
			$.ajax({
			    type: 'POST',
			    url: '/cmd',
			    dataType: 'json',
			    data: data,
			    success: function(data) {
			      receiveDataFromServer(data);
			      callback(null, sendList);
			    }
			});
		},

		getBufferList: function() {
			return bufferList;
		}
	};
};


