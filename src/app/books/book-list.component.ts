import { Component, OnInit } from '@angular/core';
import { BookService } from './book.service';
import { UserService } from '../user/user.service';

@Component({
    templateUrl: './book-list.component.html',
    styleUrls: ['./book-list.component.css']
})

export class BookListComponent implements OnInit {
    bookList: Array<any>;
    httpErr: string;
    myOffers: Array<any>;
    checkedBook: string;

    constructor(private bookService: BookService, private userService: UserService) {}

    ngOnInit() {
        // inserisci nella "bookList" tutti i libri ritornati dal server.
        this.bookService.getAllBooks()
            .then(res => this.bookList = res.list,
                  err => this.httpErr = err);
        // se l'utente è loggato
        if (this.isLoggedIn()) {
            // stabilisci se l'utente può effettuare o meno un'offerta per un determinato libro.
            this.bookService.getUserData()
                .then(res => {
                let userData = res.userData;
                this.myOffers = userData.myOffers;
                // il metodo "checkIfCanOffer" stabilisce per quali libri l'utente può effettuare un'offerta.
                this.bookList = this.bookService.checkIfCanOffer(this.bookList, this.myOffers);
            },
                      err => this.httpErr = err);
        }
    }

    public isLoggedIn(): boolean {
        return this.userService.isLoggedIn();
    }

    public getUsername(): string {
        return this.userService.getUsername();
    }

    public makeOffer(bookData: any): void {
        // questa proprietà è utilizzata per visualizzare un'icona "checked" quando andremo a cliccare sull'elemento "Make an Offer".
        this.checkedBook = bookData.volumeInfo.title;
        let bookInfo = bookData.volumeInfo;
        // determina chi è l'aquirente e chi il venditore e aumenta l'oggetto relativo al libro, in passaggi successivi, con delle proprietà significative.
        let bidder = this.getUsername();
        let seller = bookData.username;
        // esegui offerta.
        this.bookService.makeOffer(bookInfo, bidder, seller)
            .then(res => null,
                  err => this.httpErr = err);
    }
}