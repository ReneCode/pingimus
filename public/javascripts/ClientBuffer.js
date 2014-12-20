

"use strict"

var ClientBuffer = function(sendToServerCb) {
	var sendToServerCallback = sendToServerCb;
	var cmdList = [];
	var dirty = false;

	var receiveDataFromServer = function(data) {
		if (!data) 
		{
			return;
		}
		switch (data.cmd) {
			case 'cmdlist':
				var expire = data.para.expire;
				var create = data.para.create;
				cmdList.forEach( function(c) {
					if (!c.hasOwnProperty('expire')) {
						c.expire = expire;
//						c.create = create;
					}
				});
				break;
		}
	}

	return {
		add: function(data) {
		 	cmdList.push(data);
		 	dirty = true;
		},

		tryToSendToServer: function(callback) {

			if (!dirty) {
				return callback(null, null);
			}

			// do not send that command, that have already got 
			// expire-date from server (that are already sent)
			var sendList = cmdList.filter( function(c) {
				return !c.hasOwnProperty('expire');
			});
			if (!sendList ||  sendList.length == 0) {
				return callback(null, null);
			}

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
			    	dirty = false;
			      	receiveDataFromServer(data);
			      	callback(null, sendList);
			    }
			});
		},

		getCmdList: function() {
			return cmdList;
		}
	};
};


