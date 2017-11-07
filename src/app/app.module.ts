import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { RoutingModule } from './routing.module';
import { UserModule } from './user/user.module';

import { AppComponent } from './app.component';
import { BookListComponent } from './books/book-list.component';
import { MyBooksComponent } from './books/mybooks.component';

import { BookService } from './books/book.service';
import { UserService } from './user/user.service';
import { LoggedInGuard } from './logged-in-guard';

@NgModule({
    imports: [
        BrowserModule,
        ReactiveFormsModule,
        HttpModule,
        UserModule,
        RoutingModule
    ],
    declarations: [
        AppComponent,
        BookListComponent,
        MyBooksComponent
    ],
    providers: [ BookService, UserService, LoggedInGuard ],
    bootstrap: [ AppComponent ]
})

export class AppModule {}
