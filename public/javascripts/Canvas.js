
var Canvas = function(c) {

	var canvas = c;
	var ctx = canvas.getContext('2d');
	var addNewCommand = undefined;


	var paintMode = 'dot';  
	var mouseDown = false;
	var points = [];
	var mouseDownTime = undefined;
	var imageData = undefined;


	var getMousePosition = function(canvas, evt) {
	  var rect = canvas.getBoundingClientRect();
	  return {
	    x: parseInt( (evt.clientX - rect.left) * 1000 / rect.width),
	    y: parseInt( (evt.clientY - rect.top) * 1000 / rect.height)
	  };
	}


	var switchMouseModeElapsed = function() {
	  if (mouseDown == true) {
	    paintMode = 'poly';
	    var canvas = $('#cvp')[0];
	//    canvas.css({'cursor': 'crosshair'});
	  }
	}

	var saveImage = function() {
	  var canvas = $('#cvp')[0];
	  var ctx = canvas.getContext('2d');
	  imageData = ctx.getImageData(0,0,canvas.width, canvas.width);
	}



	var restoreImage = function() {
	  var canvas = $('#cvp')[0];
	  var ctx = canvas.getContext('2d');
	  ctx.putImageData(imageData, 0, 0);
	}


	var doMouseDown = function(event) {
	  saveImage();
	  event.target.style.cursor = 'pointer';
	  var canvas = $('#cvp')[0];
	  var pt = getMousePosition(canvas, event);
	//  console.log("down / x:%d y:%d", pt.x, pt.y);
	  points.push(pt);
	  mouseDown = true;
	  setTimeout( switchMouseModeElapsed, 100);
	}



	var doMouseMove = function(event) {
	  if (mouseDown) {
	    var canvas = $('#cvp')[0];
	    var pt = getMousePosition(canvas, event);

	//    console.log("mouseMove / x:%d y:%d", pt.x, pt.y);

	    // echo drawing the last segment of the polygon
	    if (points.length > 0) {
	      Picture.drawPolygon([points[points.length-1], pt]);
	    }

	    points.push(pt);

	  }
	}

	var doMouseUp = function(event) {
	  restoreImage();

	  event.target.style.cursor = 'default';

	  mouseDown = false;
	  var canvas = $('#cvp')[0];
	  var pt = getMousePosition(canvas, event);

	  switch (paintMode) {
	    case 'dot':
	      addNewCommand({cmd:'dot', point:points[0]});
	      break;

	    case 'poly':
	      points = simplify(points, 1);
	      if (points.length == 1) {
	        addNewCommand({cmd:'dot', point:points[0]});
	      }
	      else {
	        addNewCommand({cmd:'poly', points:points});
	      }
	      break;

	  }
	  points = [];
	  paintMode = 'dot';
	}

	this.init = function(addNewCommandCallback) {
		console.log("Canvas init");
		addNewCommand = addNewCommandCallback;


		canvas.addEventListener('mousedown', doMouseDown, false);
		canvas.addEventListener('mouseup', doMouseUp, false);
		canvas.addEventListener('mousemove', doMouseMove, false);
	};

	this.blockRedraw = function() {
		return mouseDown;
	}
/*
	this.doReload = function(event) {
	  addNewCommandToServer('reload', "");
	  return false;
	}
*/
};

