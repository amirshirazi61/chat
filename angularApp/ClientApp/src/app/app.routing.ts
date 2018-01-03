import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { SecondComponent } from './second.component';

const routes: Routes = [
    { path: '', component: AppComponent },
    { path: 'second', component: SecondComponent }
]

@NgModule({
    imports: [
        RouterModule.forRoot(routes)
    ],
    exports: [
        RouterModule
    ]
})

export class AppRoutingModule { }