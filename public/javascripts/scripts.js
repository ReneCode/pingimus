
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
  console.log("x:%d y:%d", pt.x, pt.y);
  emitCanvasMessage(pt);
}


$(document).ready( function init() {
  var canvas = $('#cvp')[0];
  console.log(canvas);
  canvas.addEventListener('mousedown', doMouseDown, false);
});


/*
var canvas = $('#cvp')[0];
if (canvas) {
	canvas.on('mousedown', Picture.mouseDown, false);
}
*/
var socket = io();
$('form').submit(function(){
  // send input
  socket.emit('pmsg', $('#m').val());
  // clear input
  $('#m').val('');
  return false;
});

socket.on('join', function(msg) {
	var user = prompt(msg);
	socket.emit('join', user);
});

socket.on('pmsg', function(msg){
  // receive message
  console.log("receive msg:", msg);
  $('#messages').append($('<li>').text(msg));
  Picture.receiveMessage(msg);
});

var emitCanvasMessage = function(pt) {
  if (pt) {
    var msg = "rect," + (pt.x - 10.0) + "," + (pt.y - 10.0) + ",20,20";
    socket.emit('pmsg', msg);    
  }
}

