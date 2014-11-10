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
