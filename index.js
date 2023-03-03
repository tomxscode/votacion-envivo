const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// Lógica
const votos = [0, 0];

io.on('connection', (socket) => {
    console.log(`Nuevo cliente conectado: ${socket.id}`);

    socket.emit('resultado', votos);

    socket.on('voto', (opcion) => {
        console.log(`Voto recibido de ${socket.id}: Opción ${opcion}`);
        votos[opcion]++;
        io.emit('resultado', votos);
    });

    socket.on('disconnect', () => {
        console.log(`Cliente desconectado: ${socket.id}`);
    });
});

server.listen(3000, () => {
    console.log('Servidor iniciado en http://localhost:3000');
});