import { Component, OnDestroy } from '@angular/core';
import { Subscriber, Subscription, Observable } from 'rxjs/Rx';
import { ChatService } from './services/bid-service';
import { Message } from './../server/model';

@Component({
    selector: 'second-comp',
    template: `<h1>{{name}}</h1>
               <label>User ID: </label><input type='number' [(ngModel)]="userId" />
               <label>Deal ID: </label><input type='text' [(ngModel)]="dealId" /> 
               <input type='button' (click)="toggleWatch()" [value]="isWatching ? 'Stop Chat' : 'Start Chat'" />
               <br />
               <br />
               <div *ngIf="isWatching">
                   <input type='text' [(ngModel)]="message" />
                   <input type='button' (click)="sendMessage()" value="send Message" />
               </div>
               <hr />
               <div style='width: 25%; display: inline-block;'>
                   <div *ngIf="messages && messages.length > 0" style="background-color: #E8E8E8; border-radius: 10px; padding: 10px; display: inline-block;">
                       <label>Others: </label>
                       <p *ngFor="let msg of messages">{{msg}}</p>
                   </div>
                   <div *ngIf="selfMessages && selfMessages.length > 0" style="background-color: #ccf5ff; border-radius: 10px; padding: 10px; display: inline-block;">
                       <label>Me: </label>
                       <p *ngFor="let msg of selfMessages">{{msg}}</p>
                   </div>
               </div>`,
})
export class SecondComponent implements OnDestroy {
    socket$ = Observable.webSocket('ws://localhost:8085');
    name = 'Second Component';
    dealId: number = 0;
    userId: number = 1;
    message: string = `Message from ${this.userId}`;
    messages: string[] = [];
    selfMessages: string[] = [];

    isWatching: boolean = false;
    private subscription: Subscription;

    constructor(private chatService: ChatService) { }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    sendMessage() {
        this.socket$.next(JSON.stringify({ type: 'onchat', dealId: this.dealId, message: this.message.toString(), userId: this.userId }));
    }

    toggleWatch() {
        if (this.subscription) {
            this.subscription.unsubscribe();
            this.subscription = null;
            this.isWatching = false;
        }
        else {
            this.socket$.next(JSON.stringify({ type: 'onopen', message: this.dealId }));
            this.isWatching = true;
            this.subscription = this.socket$.subscribe(
                (msg: Message[]) => {
                    let lastMessage: Message = msg[msg.length - 1];
                    Array.prototype.push.apply((lastMessage.userId == this.userId ? this.selfMessages : this.messages), [lastMessage.message])
                },
                (err) => console.log(err),
                () => console.log('complete')
            );
        }
    }
}
