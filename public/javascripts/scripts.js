
var userId = undefined;


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
  console.log("server:" + data.cmd);
  switch (data.cmd) {
    case 'login':
      if (data.result == true) {
        // login ok,
        userId = data.userId;
        $('#username').html(userId);
      }
  }
}

var sendCommandToServer = function(cmd) {
  $.ajax({
    type: 'GET',
    url: "/cmd",
    data: {
      format: 'json',
      userId: userId,
      cmd: cmd
    },
    success: function(data) {
      receiveDataFromServer(data);
    }
  });

}