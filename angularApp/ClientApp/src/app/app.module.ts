import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { WebSocketService } from './services/websocket-service';
import { ChatService } from './services/bid-service';
import { ProductService } from './services/product-service';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { SecondComponent } from './second.component';
import { AppRoutingModule } from './app.routing';

@NgModule({
    imports: [FormsModule, BrowserModule, HttpModule, AppRoutingModule],
    declarations: [AppComponent, SecondComponent],
    bootstrap: [AppComponent],
    providers: [ProductService, ChatService, WebSocketService]
})

export class AppModule { }
