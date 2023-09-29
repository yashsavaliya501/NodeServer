const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve your HTML and JavaScript files
app.use(express.static(__dirname + '/public'));

io.on('connection', (socket) => {
  // Generate a unique ID for each connected client
  const clientId = socket.id;

  // Send the client ID to the connected client
  socket.emit('client-id', clientId);

  // Broadcast to all clients that a new client has connected
  io.emit('client-connected', clientId);

  // Listen for messages from clients
  socket.on('message', (message) => {
    // Broadcast the message to all clients
    io.emit('message', { clientId, message });
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    // Broadcast that a client has disconnected
    io.emit('client-disconnected', clientId);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
