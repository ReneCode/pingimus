var socket = io();

$('form').submit(function(){
  // send input
  socket.emit('chat message', $('#m').val());
  // clear input
  $('#m').val('');
  return false;
});

socket.on('chat message', function(msg){
  // receive message
  $('#messages').append($('<li>').text(msg));
});
