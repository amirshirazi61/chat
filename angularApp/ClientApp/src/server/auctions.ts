﻿import * as express from 'express';
import * as path from 'path';
import { Server } from 'ws';
import { Product, Review, getProducts, getProductById, getReviewsByProductId } from './model';

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
const histories = new Map<number, string[]>();

// Helper functions

function addToClients(client: any, request: any) {
    let dealId: number = parseInt(request.message);
    let dealClients = clients.get(dealId);
    if (!dealClients) {
        clients.set(dealId, [client]);
    }
    else if (!dealClients.find(c => c == client)) {
        clients.set(dealId, [...dealClients, client]);
        console.log(`clients length: ${clients.size}`);
    }
}

function addToHistory(request: any) {
    let chatHistory = histories.get(request.dealId);
    if (!chatHistory) {
        histories.set(request.dealId, [request.message]);
    }
    else {
        chatHistory.push(request.message);
    }
}

function broadCast(request: any) {
    let dealClients = clients.get(request.dealId);
    let chatHistoryForDeal: string[] = histories.get(request.dealId);
    dealClients.forEach((client: WebSocket) => {
        if (client.readyState === 1)
            client.send(JSON.stringify(chatHistoryForDeal));
        else 
            dealClients.splice(dealClients.indexOf(client), 1);        
    });
}