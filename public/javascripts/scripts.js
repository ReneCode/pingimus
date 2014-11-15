
var getMousePosition = function(canvas, evt) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  };
}

var doMouseDown = function(event) {
  var canvas = $('#cvp')[0];
  var pt = getMousePosition(canvas, event);
//  console.log("x:%d y:%d", pt.x, pt.y);
  sendCanvasCmd(pt);
}


/**
*/
$(document).ready( function init() {
  var canvas = $('#cvp')[0];
//  console.log(canvas);
  canvas.addEventListener('mousedown', doMouseDown, false);

  $('form').submit(sendUserCommand);
});


var sendUserCommand = function() {
  // send input
  var cmd = $('#cmd').val();
  // clear input
  $('#cmd').val('');

  sendCommandToServer(cmd);
  return false;
}

var sendCanvasCmd = function(pt) {
  if (pt) {
    var cmd = "rect," + (pt.x - 10.0) + "," + (pt.y - 10.0) + ",20,20";
    sendCommandToServer(cmd);
  }
}


var receiveDataFromServer = function(data) {
  console.log("server:" + data);
}

var sendCommandToServer = function(cmd) {
  $.ajax({
    type: 'GET',
    url: "/cmd",
    data: {
      format: 'json',
      cmd: cmd
    },
    success: function(data) {
      receiveDataFromServer(data);
    }
  });

}