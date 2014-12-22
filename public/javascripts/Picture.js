
var Picture = (function() {

	var cmdList = undefined;
	var refreshInterval = undefined;
	var blockRedraw = undefined;
	var localServerDelta = undefined;

	var coordToClient = function(pt) {
		var c = $('#cvp')[0];

		return {
			x: (pt.x * c.width / 1000),
			y: (pt.y * c.height / 1000)
		}
	}

	var drawRect = function(arr) {
		var c = $('#cvp')[0];
		var ctx = c.getContext('2d');

		ctx.FillStyle = "#440044";
		if (arr.length >= 4) {
			ctx.fillRect(arr[0], arr[1], arr[2], arr[3] );
		}
	};

	var drawCircle = function(arr) {
		var c = $('#cvp')[0];
		var ctx = c.getContext('2d');

		if (arr.length >= 3) {
			ctx.beginPath();
			ctx.arc(arr[0],arr[1],arr[2],0,2*Math.PI);
			ctx.stroke();
		}
	};

	var clear = function() {
		var c = $('#cvp')[0];
		var ctx = c.getContext('2d');
		ctx.clearRect(0,0,c.width,c.height);		
	};

	var _drawDot = function(pt, color) {
		var c = $('#cvp')[0];
		var ctx = c.getContext('2d');
		ctx.globalAlpha = 0.7;
		var p = coordToClient(pt);
		ctx.fillStyle = color || "black";
		ctx.fillRect(p.x-2, p.y-2, 8, 8);
	};

	var _drawPolygon = function(para, color) {
		if (!para  ||  para.length < 2) {
			return;
		}
		var c = $('#cvp')[0];
		var ctx = c.getContext('2d');
		ctx.globalAlpha = 0.7;
		ctx.beginPath();
		var first = true;
		para.forEach(function(pt) {
			var p = coordToClient(pt);
			if (first) {
				ctx.moveTo(p.x, p.y);
				first = false;
			} 
			else {
				ctx.lineTo(p.x, p.y);
			} 
		});
		ctx.lineWidth= 4;
		ctx.strokeStyle = color || "black";
		ctx.stroke();
	};


	var _drawCmd = function(cmd) {
		switch (cmd.cmd) {
			case 'dot':
				_drawDot(cmd.point, cmd.color);
				break;
				
			case 'poly':
				_drawPolygon(cmd.points, cmd.color);
				break;
		}
	}

	var sortCreate = function(a, b) {
		return a.create - b.create;
	}

	var _redraw = function() {
		if (!cmdList) {
			return;
		}
		if (blockRedraw()) {
			return;
		}
		var calcServerTime = getTimeNow() - localServerDelta;
		clear();
		cmdList.forEach(function(cmd) {	
			if (cmd.show  ||  cmd.create <= calcServerTime) {
				_drawCmd(cmd);
			}
		});
	}


	var _clearCmdList = function() {
		cmdList = undefined;
	}

	var _addCmdList = function(data) {
		if (!cmdList) {
			cmdList = data;
		}
		else {
			cmdList = cmdList.concat(data);
		}
		cmdList.sort( sortCreate );
	}

	var _addCmd = function(data) {
		if (!cmdList) {
			cmdList = [data];
		}
		else {
			cmdList.push(data);
		}
		cmdList.sort( sortCreate );
	}


	var getTimeNow = function() {
		var now = new Date().valueOf();
		return now;	
	}

	var _refresh = function() {
		updateCmdList();
		_redraw();
	}

	var updateCmdList = function() {
		if (!cmdList) {
			return;
		}

		var localTime = getTimeNow();
		var calcServerTime = getTimeNow() - localServerDelta;

		// remove expired elements
		cmdList = cmdList.filter( function(c) {
			if (c.expire <= calcServerTime) {
				return false;
			}
			return true;
		});
	}




	var _setServerTime = function(newServerTime) {
		localServerDelta = getTimeNow() - newServerTime;
	}


	refreshInterval = setInterval(_refresh, 1*1000);

	return {
		setServerTime: function(newServerTime) {
			_setServerTime(newServerTime);
		},

		clearCmdList: function() {
			_clearCmdList();
		},

		addCmdList: function(data) {
			_addCmdList(data);
		},

		addCmd: function(data) {
			_addCmd(data);
		},

		redraw: function() {
			_redraw();
		},

		drawDot: function(para, width) {
			_drawDot(para, width);
		},

		drawPolygon: function(para) {
			_drawPolygon(para);
		},

		drawCmd: function(para) {
			_drawCmd(para);
		},

		reload: function(data) {
			_reload(data);
		},

		refresh: function() {
			_refresh();
		},

		setBlockRedrawCallback: function(callback) {
			blockRedraw = callback;
		},

		receiveMessage: function(msg) {
			var arr = msg.split(',');
			var cmd = arr.shift();
			switch (cmd) {
				case "rect":
					drawRect(arr);
					break;
				case "circle":
					drawCircle(arr);
					break;
			}
//			console.log("picture.msg:" + msg);
		}
	};
})();

