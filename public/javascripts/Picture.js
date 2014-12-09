
var Picture = (function() {

	var cmdList = undefined;

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


	var redraw = function() {
		if (!cmdList) {
			return;
		}
		clear();
		cmdList.forEach(function(p) {		
			switch (p.cmd) {
				case 'dot':
					_drawDot(p.point);
					break;
					
				case 'poly':
					_drawPolygon(p.points);
					break;

			}
		});
	}


	var _reload = function(data) {
		cmdList = data.para;
		redraw();
	}

	var _refresh = function() {
		updateCmdList()
		redraw();
	}

	var updateCmdList = function() {
		if (!cmdList) {
			return;
		}
		var now = new Date().valueOf();
		// take only the valid cmd
		cmdList = cmdList.filter( function(c) {
			if (c.create <= now  &&  c.expire > now) {
				return true;
			}
			return false;
		});
	}

	setInterval(_refresh, 2*1000);

	return {
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

