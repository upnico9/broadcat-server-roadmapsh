import WebSocket, { WebSocketServer}  from 'ws';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

const userNames = getUserNames();

function getUserNames() {
  const data = fs.readFileSync('userNames.json');
  return JSON.parse(data);
}

function generateUserName() {
    // Generate a random number between 0 and userNames.length
    const randomNum = Math.floor(Math.random() * userNames.length);
    const userName = `${userNames[randomNum]}-${randomNum}`;
    return userName;
}

export default class WSServer {
    constructor () {
        this.ws = new WebSocketServer({ port: process.env.PORT || 8080 });
        this.activeClients = new Map();
    }

    start() {
        this.ws.on('connection', (ws, req) => {
            // Set the user name
            const userName = generateUserName();

            if (this.activeClients.has(ws)) {
                ws.send('You are already connected');
                ws.close();
                return;
            }

            if (this.activeClients.size === 2) {
                ws.send('The server is full');
                ws.close();
                return;
            }

            // Add the user to the activeClients map
            this.activeClients.set(ws, userName);

            console.log(`${userName} connected`);

            // Sending a welcome message to the user
            ws.send(`Welcome ${userName}`);

            // Broadcast the message to all clients
            ws.on('message', (message) => {
                this.ws.clients.forEach(client => {
                    if (client !== ws && client.readyState === WebSocket.OPEN) {
                        client.send(`${userName}: ${message}`);
                    }
                });

            });

            ws.on('close', () => {
                console.log(`${userName} disconnected`);
                this.activeClients.delete(ws);
            });
        });
    }

    shutdown() {
        this.ws.close();

        this.ws.clients.forEach(client => {
            client.close(1001, 'Server is shutting down');
            this.activeClients.delete(client);
        });

        process.exit();
    }
}



