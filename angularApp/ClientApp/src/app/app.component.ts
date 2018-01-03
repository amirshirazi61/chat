import { Component, OnDestroy } from '@angular/core';
import { Subscriber, Subscription } from 'rxjs/Rx';

import { ChatService } from './services/bid-service';
import { Product, Review } from './services/product-service';

@Component({
    selector: 'my-app',
    template: `<h1>{{name}}</h1>
             <div *ngIf="isWatching">
                 <input type='text' [(ngModel)]="messageFromServer" />
                 <input type='button' (click)="sendMessage()" value="send Message" />
             </div>
             <input type='button' (click)="toggleWatchProduct()" [value]="isWatching ? 'Unwatch' : 'Watch'" />
             <hr />
             <second-comp></second-comp>`,
})
export class AppComponent implements OnDestroy {
    product: Product;
    reviews: Review[];
    name = 'First Component';
    messageFromServer: number = 0;

    isWatching: boolean = false;
    private subscription: Subscription;

    constructor(private chatService: ChatService) { }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    sendMessage() {
        console.log("Sending message to WebSocket server.");
        this.chatService.send({ type: 'onchat', dealId: 0, message: this.messageFromServer.toString() });
    }

    toggleWatchProduct() {
        if (this.subscription) {
            this.subscription.unsubscribe();
            this.subscription = null;
            this.isWatching = false;
        } else {
            this.isWatching = true;
            this.subscription = this.chatService.watchProduct({ type: 'onopen', message: 0 }).subscribe(messages =>
                    console.log(messages)
                , error => console.log(error));
        }
    }
}
