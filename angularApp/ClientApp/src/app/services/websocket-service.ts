import { Observable, Subscriber } from 'rxjs/Rx';
import { Injectable } from '@angular/core';

@Injectable()
export class WebSocketService {
    private ws: WebSocket;

    createObservableSocket(url: string, openSubscriber: Subscriber<any>): Observable<any> {
        this.ws = new WebSocket(url);
        return new Observable(
            (observer: Subscriber<any>) => {
                this.ws.onmessage = (event) => observer.next(event.data);
                this.ws.onerror = (event) => observer.error(event);
                this.ws.onclose = (event) => observer.complete();                
                this.ws.onopen = event => {
                    openSubscriber.next();
                    openSubscriber.complete();
                };

                return () => this.ws.close();
            }
        );
    }

    send(message: any) {
        this.ws.send(JSON.stringify(message));
    }
}