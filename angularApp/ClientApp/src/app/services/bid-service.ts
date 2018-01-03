import { WebSocketService } from './websocket-service';
import { Injectable } from '@angular/core';
import { Observable, Subscriber } from 'rxjs/Rx';

@Injectable()
export class ChatService {
    constructor(private webSocket: WebSocketService) { }
    watchProduct(message: any): Observable<any> {
        let openSubscriber = Subscriber.create(
            () => this.webSocket.send(message));

        return this.webSocket.createObservableSocket('ws://localhost:8085', openSubscriber)
            .map((messages: any) => JSON.parse(messages));
    }

    send(message: any) {
        this.webSocket.send(message);
    }
}