
var userId = undefined;
var paintMode = 'dot';  //
var mouseDown = false;
var points = [];
var mouseDownTime = undefined;

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

var doMouseDown = function(event) {
  event.target.style.cursor = 'pointer';
  var canvas = $('#cvp')[0];
  var pt = getMousePosition(canvas, event);
//  console.log("down / x:%d y:%d", pt.x, pt.y);
  points.push(pt);
  mouseDown = true;
  setTimeout( switchMouseModeElapsed, 200);
}



var doMouseMove = function(event) {

  if (mouseDown) {
    var canvas = $('#cvp')[0];
    var pt = getMousePosition(canvas, event);
//    console.log("mouseMove / x:%d y:%d", pt.x, pt.y);

    points.push(pt);
  }
}

var doMouseUp = function(event) {
  event.target.style.cursor = 'default';

  mouseDown = false;
  var canvas = $('#cvp')[0];
  var pt = getMousePosition(canvas, event);

  switch (paintMode) {
    case 'dot':
      sendCommandToServer('dot', points[0]);
      break;

    case 'poly':
      points = simplify(points, 2);
      sendCommandToServer('poly', points);
      break;

  }
  points = [];
  paintMode = 'dot';
}


var doReload = function(event) {
  console.log("reload");
  sendCommandToServer('reload', "");
  return false;
}

$( function() {
  // DOM is ready
  var canvas = $('#cvp')[0];
  $('#cvp').css('background-color', 'rgba(158, 167, 184, 0.2)');
  canvas.width = 400;
  canvas.height = 400;
  canvas.addEventListener('mousedown', doMouseDown, false);
  canvas.addEventListener('mouseup', doMouseUp, false);
  canvas.addEventListener('mousemove', doMouseMove, false);


  $("#reload").click(doReload);

  $('form').submit(sendUserCommand);
});


/**
*/
/*
$(document).ready( function init() {
  var canvas = $('#cvp')[0];
//  console.log(canvas);
  canvas.addEventListener('mousedown', doMouseDown, false);

  $('form').submit(sendUserCommand);
});
*/

var sendUserCommand = function() {
  // send input
  var text = $('#cmd').val();
  // clear input
  $('#cmd').val('');

  var aCmd = text.split(' ');
  var sCmd = aCmd.shift();
  text = aCmd.join(' ');
  sendCommandToServer({cmd:sCmd, data:text});
  return false;
}

var sendCanvasCmd = function(pt) {
  if (pt) {
    var cmd = {cmd:"paint",
               data:"rect," + (pt.x - 10.0) + "," + (pt.y - 10.0) + ",20,20" };
    sendCommandToServer(cmd);
  }
}


var receiveDataFromServer = function(data) {
  switch (data.cmd) {
    case 'dot':
      Picture.drawDot(data.para.point);
      break;

    case 'poly':
      Picture.drawPolygon(data.para.points);
      break;

    case 'reload':
      Picture.reload(data.para);
      break;

    case 'login':
      if (data.result == true) {
        // login ok,
        userId = data.userId;
        $('#username').html(userId);
      }
      break;

    case 'getfollower':
      if (data.result == true) {
        var follower = data.follower;
        if (follower) {
          $('#follower').html(follower.join(','));
        }
        else {
          $('#follower').html('');
        }

      }
  }
}

var sendCommandToServer = function(cmd, para) {
  var data = {
        cmd: cmd,
        para: JSON.stringify(para)
      };

  $.ajax({
    type: 'POST',
    url: '/cmd',
    dataType: 'json',
    data: data,
    success: function(data) {
      receiveDataFromServer(data);
    }
  });

}