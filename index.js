#!/usr/bin/env node

// Create a new instance of the Command class
// Then instanciate the command class
// After that, declare 3 commands, start, connect and help, no arguments
import { Command } from "commander";
import WSServer from "./server.js";
import WSClient from "./client.js";

const program = new Command();

// Create the help message, the program only works with the commands start, connect and help
// If the user types anything else, the program will display the help message
// The help message is a string that explains how to use the program
// The help message is displayed when the user types the help command
const helpMessage = `
Usage: broadcast-server [command]

Commands:
    start       Start the server
    connect     Connect to the server
    help        Show help
    `;


program.command("start").action(() => {
    const server = new WSServer();
    server.start();
    process.on('SIGTERM', server.shutdown.bind(server));
    process.on('SIGINT', server.shutdown.bind(server));;
    }
);

program.command("connect").action(() => {
    const client = new WSClient();
    client.start();
    }
);

program.command("help").action(() => {
    console.log(helpMessage);
});


program.parse(process.argv);