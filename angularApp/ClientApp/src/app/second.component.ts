import { Component, OnDestroy } from '@angular/core';
import { Subscriber, Subscription, Observable } from 'rxjs/Rx';

import { ChatService } from './services/bid-service';
import { Product, ProductService, Review } from './services/product-service';

@Component({
    selector: 'second-comp',
    template: `<h1>{{name}}</h1>
               <label>Deal ID: </label><input type='text' [(ngModel)]="dealId" /> 
               <input type='button' (click)="toggleWatch()" [value]="watching ? 'Stop Chat' : 'Start Chat'" />
               <br />
               <br />
               <div *ngIf="watching">
                 <input type='text' [(ngModel)]="message" />
                 <input type='button' (click)="sendMessage2()" value="send Message" />
               </div>
            
             <hr />
             <div *ngIf="messages && messages.length > 0" style="background-color: #E8E8E8; border-radius: 10px; padding: 10px; display: inline-block;">
                <p *ngFor="let msg of messages">{{msg}}</p>
             </div>`,
})
export class SecondComponent implements OnDestroy {
    socket$ = Observable.webSocket('ws://localhost:8085');
    reviews: Review[];
    name = 'Second Component';
    dealId: number = 0;
    message: string = `Welcome from ${this.name}`;
    messages: string[];

    watching: boolean = false;
    private subscription: Subscription;

    constructor(private productService: ProductService, private chatService: ChatService) { }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    sendMessage2() {
        this.socket$.next(JSON.stringify({ type: 'onchat', dealId: this.dealId, message: this.message.toString() }));
    }

    toggleWatch() {
        if (this.subscription) {
            this.subscription.unsubscribe();
            this.subscription = null;
            this.watching = false;
        }
        else {
            this.socket$.next(JSON.stringify({ type: 'onopen', message: this.dealId }));
            this.watching = true;
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
