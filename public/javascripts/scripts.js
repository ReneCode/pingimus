
var userId = undefined;
var paintMode = 'dot';  //

var getMousePosition = function(canvas, evt) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: parseInt( (evt.clientX - rect.left) * 1000 / rect.width),
    y: parseInt( (evt.clientY - rect.top) * 1000 / rect.height)
  };
}

var doMouseDown = function(event) {
  var canvas = $('#cvp')[0];
  var pt = getMousePosition(canvas, event);
//  console.log("x:%d y:%d", pt.x, pt.y);

  switch (paintMode) {
    case 'dot':
      sendCommandToServer('dot', pt);
      break;

  }
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
      Picture.drawDot(data.para);
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