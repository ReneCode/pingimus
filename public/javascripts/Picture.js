
var Picture = (function() {

	var cmdList = undefined;
	var refreshInterval = undefined;

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

	var _drawDot = function(pt, width) {
		var c = $('#cvp')[0];
		var ctx = c.getContext('2d');
		var p = coordToClient(pt);
		ctx.FillStyle = "#440044";
		var w = width | 4;
		ctx.fillRect(p.x-2, p.y-2, 4, 4);
	};

	var _drawPolygon = function(para) {
		if (!para  ||  para.length < 2) {
			return;
		}
		var c = $('#cvp')[0];
		var ctx = c.getContext('2d');
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
//		ctx.closePath();
		ctx.lineWidth=4;
		ctx.FillStyle = "#440044";
		ctx.stroke();
//			ctx.fillRect(p.x-2, p.y-2, 4, 4);
	};

	var _add = function(data) {
		if (!cmdList) {
			cmdList = [];
		}
		cmdList.push(data.para);
		drawCmd(data.para);
	}

	var drawCmd = function(cmd) {
		switch (cmd.cmd) {
			case 'dot':
				_drawDot(cmd.point);
				break;
				
			case 'poly':
				_drawPolygon(cmd.points);
				break;
		}
	}

	var redraw = function(now) {
		if (!cmdList) {
			return;
		}
		clear();
		cmdList.forEach(function(cmd) {	
			if (cmd.create <= now) {
				drawCmd(cmd);
			}
		});
	}


	var _reload = function(data) {
		cmdList = data.para;
		redraw();
	}

	var getTimeNow = function() {
		var now = new Date().valueOf();
		now = now - 10*1000;
		return now;	
	}

	var _refresh = function() {
		var now = getTimeNow();
		updateCmdList(now);
		redraw(now);
	}

	var updateCmdList = function(now) {
		if (!cmdList) {
			return;
		}

		// remove expired elements
		cmdList = cmdList.filter( function(c) {
			if (c.expire <= now) {
				return false;
			}
			return true;
		});
	}

	refreshInterval = setInterval(_refresh, 1*1000);

	return {
		add: function(data) {
			_add(data);
		},

		drawDot: function(para, width) {
			_drawDot(para, width);
		},

		drawPolygon: function(para) {
			_drawPolygon(para);
		},

		reload: function(data) {
			_reload(data);
		},

		refresh: function() {
			_refresh();
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

