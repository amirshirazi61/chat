 import * as express from 'express';
import * as path from 'path';
import { Server } from 'ws';

const app = express();

app.use('/',express.static(path.join(__dirname, '..', 'client')));
app.use('/node_modules', express.static(path.join(__dirname, '..', 'node_modules')));

app.get('/',  (req, res) => {
    console.log(__dirname);
    res.sendFile('D:/myProto/client/simple-websocket-client.html');
});

const httpServer = app.listen(8000, "localhost", () =>{
    console.log('HTTP Server is listening on port 8000');
});

// Using WS API

var wsServer: Server = new Server({port:8085});
console.log('Websocket server is listening on port 8085.');
wsServer.on('connection', ws => 
{
    ws.send('First Message.');
    ws.on('message', message => {

        let subscriptionRequest = message;
        subscribeToProductBids(ws, subscriptionRequest)
        console.log("Server received: %s", message);
    });
});

setInterval(() => {
    broadcastNewBidsToSubscribers();
  }, 2000);

// Helper functions
// The map key is a reference to WebSocket connection that represents a user.
const subscriptions = new Map<any, string[]>();

function subscribeToProductBids(client, productId: string): void {
    let products = subscriptions.get(client) || [];
    console.log(`product: ${products}`);
    console.log(`[...products, productId]: ${[...products, productId]}`)
    subscriptions.set(client, [...products, productId]);
    console.log('map size: ', subscriptions.size);
  }

  function broadcastNewBidsToSubscribers() {
      subscriptions.forEach((products: string[], ws:WebSocket) => {
          if(ws.readyState === 1) { // 1 - READT_STATE_OPEN    
            ws.send('message from broadcastNewBidsToSubscribers()');
          } else {
              subscriptions.delete(ws);
          }
      })
  }