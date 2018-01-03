import { Component, OnDestroy } from '@angular/core';
import { Subscriber, Subscription, Observable } from 'rxjs/Rx';

import { ChatService } from './services/bid-service';
import { Product, Review } from './services/product-service';

@Component({
    selector: 'my-app',
    template: `<h1>{{name}}</h1>
               <label>Deal ID: </label><input type='text' [(ngModel)]="dealId" />
               <input type='button' (click)="toggleWatchProduct()" [value]="isWatching ? 'Stop Chat' : 'Start Chat'" />
               <br />
               <br />
               <div *ngIf="isWatching">
                   <input type='text' [(ngModel)]="message" />
                   <input type='button' (click)="sendMessage()" value="send Message" />
               </div>
               <hr />
               <div *ngIf="messages && messages.length > 0" style="background-color: #E8E8E8; border-radius: 10px; padding: 10px; display: inline-block;">
                   <p *ngFor="let msg of messages">{{msg}}</p>
               </div>
               <second-comp></second-comp>`,
})
export class AppComponent implements OnDestroy {
    socket$ = Observable.webSocket('ws://localhost:8085');
    reviews: Review[];
    name = 'First Component';
    dealId: number = 0;
    message: string = `Welcome from ${this.name}`;
    messages: string[];

    isWatching: boolean = false;
    private subscription: Subscription;

    constructor(private chatService: ChatService) { }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    sendMessage() {
        this.socket$.next(JSON.stringify({ type: 'onchat', dealId: this.dealId, message: this.message.toString() }));
    }

    toggleWatchProduct() {
        if (this.subscription) {
            this.subscription.unsubscribe();
            this.subscription = null;
            this.isWatching = false;
        }
        else {   
            this.socket$.next(JSON.stringify({ type: 'onopen', message: this.dealId }));  
            this.isWatching = true;       
            this.subscription = this.socket$.subscribe(
                (msg: string[]) => {
                    console.log('message received: ' + msg);
                    this.messages = msg;
                },
                (err) => console.log(err),
                () => console.log('complete')
            );
        }
    }
}
