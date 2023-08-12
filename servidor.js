const WebSocket = require('ws');
const express = require('express');
const http = require('http');
const cors = require('cors');

const app = express();
app.use(cors())

const server = http.createServer(app);

const wss = new WebSocket.Server({ server });
const clients = new Set();

wss.on('connection', (ws) => {
    console.log('Cliente conectado.');
    clients.add(ws);

    ws.on('message', (message) => {
        console.log(`Mensaje recibido: ${message}`);
        broadcastMessage(message, ws);
    });

    ws.on('close', () => {
        console.log('Cliente desconectado.');
        clients.delete(ws);
    });
});

function broadcastMessage(message, sender) {
    clients.forEach((client) => {
        // No retransmite el mensaje al cliente que lo envió originalmente
        if (client !== sender && client.readyState === WebSocket.OPEN) {
            client.send(`${message}`);
        }
    });
}

server.listen(8080, () => {
    console.log('Servidor WebSocket iniciado en ws://13.58.36.34:8080');
});
