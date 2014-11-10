
var Picture = (function() {
	var self = this;

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
	}

	return {
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