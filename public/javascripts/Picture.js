
var Picture = (function() {
	var self = this;


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

	var _drawDot = function(pt) {
		var c = $('#cvp')[0];
		var ctx = c.getContext('2d');
		var p = coordToClient(pt);
		ctx.FillStyle = "#440044";
		ctx.fillRect(p.x-2, p.y-2, 4, 4);
	};

	var _drawPolygon = function(para) {
		var c = $('#cvp')[0];
		var ctx = c.getContext('2d');
		ctx.beginPath();
		var pt = para.shift();
		var p = coordToClient(pt);
		ctx.moveTo(p.x, p.y);
		para.forEach(function(pt) {
			var p = coordToClient(pt);
			ctx.lineTo(p.x, p.y);
		});
//		ctx.closePath();
		ctx.lineWidth=4;
		ctx.FillStyle = "#440044";
		ctx.stroke();
//			ctx.fillRect(p.x-2, p.y-2, 4, 4);
	};


	var _reload = function(para) {
		clear();
		para.forEach(function(p) {		
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



	return {
		drawDot: function(para) {
			_drawDot(para);
		},

		drawPolygon: function(para) {
			_drawPolygon(para);
		},

		reload: function(para) {
			_reload(para);
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