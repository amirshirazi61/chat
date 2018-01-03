import { Component, OnDestroy} from '@angular/core';
import { Subscriber, Subscription } from 'rxjs/Rx';

import { ChatService } from './services/bid-service';
import { Product, ProductService, Review } from './services/product-service';

@Component({
    selector: 'second-comp',
    template: `<h1>{{name}}</h1>
              <div *ngIf="isWatching">
                <input type='text' [(ngModel)]="messageFromServer" />
              </div>
                <input type='button' (click)="toggleWatchProduct()" [value]="isWatching ? 'Unwatch' : 'Watch'" />`,
})
export class SecondComponent implements OnDestroy {
    product: Product;
    reviews: Review[];
    currentBid: number;
    name = 'Second Component';
    messageFromServer: number = 0;

    isWatching: boolean = false;
    private subscription: Subscription;

    constructor(private productService: ProductService, private chatService: ChatService) {
        this.product = new Product(1, 'First Product', 24.99, 4.3,
            'This is a short description. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
            ['electronics', 'hardware']
        );

        this.currentBid = this.product.price;
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    toggleWatchProduct() {
        if (this.subscription) {
            this.subscription.unsubscribe();
            this.subscription = null;
            this.isWatching = false;
        } else {
            this.isWatching = true;
            this.subscription = this.chatService.watchProduct({ type: 'onopen', message: 0 })
                .subscribe(products =>
                    console.log(products)
                , error => console.log(error));
        }
    }
}
