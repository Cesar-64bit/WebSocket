const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });
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

console.log('Servidor WebSocket iniciado en ws://localhost:8080');
