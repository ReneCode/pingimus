

var canvas = undefined;


$( function() {
  // DOM is ready
  var cv = $('#cvp')[0];
  $('#cvp').css('background-color', 'rgba(158, 167, 184, 0.2)');
  cv.width = 400;
  cv.height = 400;

  canvas = new Canvas(cv);
  canvas.init(sendCommandToServer);


/*
  var is_touch_device = 'ontouchstart' in document.documentElement;
 
  console.log("touch:" + is_touch_device);



  canvas.addEventListener('touchstart', doMouseDown, false);
  canvas.addEventListener('touchend', doMouseUp, false);
  canvas.addEventListener('touchmove', doMouseMove, false);

*/
  $("#reload").click( canvas.doReload );
  $("#refresh").click( Picture.refresh );

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
  sendCommandToServer(sCmd, text);
  return false;
}


var receiveDataFromServer = function(data) {
  switch (data.cmd) {
/*
    case 'dot':
      Picture.drawDot(data.para.point);
      break;

    case 'poly':
      Picture.drawPolygon(data.para.points);
      break;
*/

    case 'dot':
    case 'poly':
      Picture.add(data);
      break;

    case 'reload':
      Picture.reload(data);
      break;

    case 'login':
      if (data.result == true) {
        // login ok,
        userId = data.userId;
        $('#username').html(userId);
      }
      break;

    case 'follow':
      console.dir(data.para);
      if (data.para) {
        var sFollow = data.para.join(',');
        $('#follower').html(sFollow);
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