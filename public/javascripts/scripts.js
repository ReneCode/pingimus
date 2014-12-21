

var canvas = undefined;
var clientBuffer = undefined;

var setText = function(text) {
  var label = document.getElementById("label");
  label.innerHTML = text;
 //   console.log(text);

}

var handler = function(ev) {
//  setText('hallo:' + ev.type + " / " + ev.targetTouches[0].clientX);
}

$( function() {
  // DOM is ready
  var cv = $('#cvp')[0];
  $('#cvp').css('background-color', 'rgba(158, 167, 184, 0.2)');
  cv.width = 400;
  cv.height = 400;

  clientBuffer = new ClientBuffer(sendCommandToServer);

  canvas = new Canvas(cv);
  canvas.init(adddNewCommand);

  Picture.setBlockRedrawCallback(canvas.blockRedraw);


  cv.addEventListener('touchstart', handler, false);
  cv.addEventListener('touchend', handler, false);
  cv.addEventListener('touchmove', handler, false);


/*
  var is_touch_device = 'ontouchstart' in document.documentElement;
 
  console.log("touch:" + is_touch_device);



  canvas.addEventListener('touchstart', doMouseDown, false);
  canvas.addEventListener('touchend', doMouseUp, false);
  canvas.addEventListener('touchmove', doMouseMove, false);

*/
  $("#reload").click( doReload );
  $("#test").click( tryToSendToServer );
//  $("#refresh").click( Picture.refresh );

  $('form').submit(sendUserCommand);

  var sendToServerInteraval = setInterval(tryToSendToServer, 1*1000);
  var reloadInterval = setInterval(doReload, 10*1000);
});


/**
  called every 10 seconds
*/
var doReload = function() {
  sendCommandToServer('reload', null);
}


var tryToSendToServer = function() {
  clientBuffer.tryToSendToServer( function(err, data) {
    ;
  });


}

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
      if (!data.cmdlist) {
        return;
      }
      Picture.setServerTime(data.servertime);
      Picture.clearCmdList();
      // data from server / my follower
      Picture.addCmdList(data.cmdlist);
      // my own data
      var cmdList = clientBuffer.getCmdList();
      Picture.addCmdList(cmdList);
      Picture.refresh();
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

  }
}

/**
*/
var adddNewCommand = function(data) {
  clientBuffer.add(data);
  Picture.addCmd(data);
  Picture.drawCmd(data);

/*
  clientBuffer.tryToSendToServer( function(err, data) {
    if (data) {
      data.forEach(function(c) {
        Picture.add(c);
      })

    }
  });
*/

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