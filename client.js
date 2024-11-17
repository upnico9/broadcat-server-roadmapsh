import WebSocket from "ws";
import readline from "readline";


export default class WSClient {
    constructor() {
        this.ws = new WebSocket('ws://localhost:8080');
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
    }

    start() {
        this.ws.on('open', () => {
            console.log('Connected to the server');
        });

        this.ws.on('message', (message) => {
            if (message.toString() == 'The server is full') {
                console.log(message.toString());
                this.rl.removeAllListeners();
                this.rl.close();
                this.ws.close();
                process.exit();
            }
            console.log(message.toString());
        });

        this.rl.setPrompt('Enter message: ');
        this.rl.prompt();

        this.rl.on('line', (input) => {
            this.ws.send(input);
        });

        this.rl.on('SIGINT', () => {
            this.rl.question('Are you sure you want to exit? ', (answer) => {
              if (answer.match(/^y(es)?$/i))
                this.ws.close(),
                process.exit();
              else
                this.rl.prompt();
            });
          }); 
    }
}
