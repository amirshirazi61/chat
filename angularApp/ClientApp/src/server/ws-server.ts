import * as express from 'express';
import * as path from 'path';
import { Server } from 'ws';
import { Message } from './model';

// Using WS API
var wsServer: Server = new Server({ port: 8085 });
console.log('Websocket server is listening on port 8085.');
wsServer.on('connection', ws => {
    ws.on('message', message => {
        let subscriptionRequest = JSON.parse(message);
        console.log("Server received: %s", message);
        switch (subscriptionRequest.type) {
            case 'onopen':
                addToClients(ws, subscriptionRequest);
                break;
            case 'onchat':
                addToHistory(subscriptionRequest);
                broadCast(subscriptionRequest);
        }
    });
});

const clients = new Map<number, any[]>();
const histories = new Map<number, Message[]>();

// Helper functions

function addToClients(client: any, request: any) {
    let dealId: number = parseInt(request.message);
    let dealClients = clients.get(dealId);
    if (!dealClients) {
        clients.set(dealId, [client]);
    }
    else if (!dealClients.find(c => c == client)) {
        clients.set(dealId, [...dealClients, client]);
    }
}

function addToHistory(request: any) {
    let chatHistory = histories.get(request.dealId);

    if (!chatHistory) {
        histories.set(request.dealId, [new Message(parseInt(request.userId), request.message)]);
    }
    else {
        chatHistory.push(new Message(parseInt(request.userId), request.message));
    }
}

function broadCast(request: any) {
    let dealClients = clients.get(parseInt(request.dealId));
    let chatHistoryForDeal: Message[] = histories.get(request.dealId);
    dealClients.forEach((client: WebSocket) => {
        if (client.readyState === 1) {
                console.log(`val :${JSON.stringify(chatHistoryForDeal)}`);
            client.send(JSON.stringify(chatHistoryForDeal));
        }
        else 
            dealClients.splice(dealClients.indexOf(client), 1);        
    });
}