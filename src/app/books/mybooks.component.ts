import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { BookService } from './book.service';

@Component({
    templateUrl: './mybooks.component.html',
    styleUrls: ['./mybooks.component.css', './mybooks-nav.component.css', './mybooks-sections.component.css']
})

export class MyBooksComponent implements OnInit {
    bookForm: FormGroup;
    userData: {};
    allSellingList: Array<any>;
    receivedOffersList: Array<any> = [];
    acceptedOffersList: Array<any> = [];
    myOffersList: Array<any> = [];
    myAcceptedOffersList: Array<any> = [];
    showInfo: boolean = false;
    elemPos: number;
    title: string;
    email: string;
    name: string;
    city: string;
    state: string;
    error: boolean;
    httpErr: string;
    errMsg: string;
    formErrors: any = {
        bookTitle: '',
    };
    validationMessages: any = {
        bookTitle: {
            'required': 'A book name is required.',
            'pattern': 'Invalid characters.'
        }
    };
    sections: {} = {
        allSell: { name: 'allSell', visible: true },
        recOff: { name: 'recOff', visible: false },
        accOff: { name: 'accOff', visible: false },
        myOff: { name: 'myOff', visible: false },
        myAccOff: { name: 'myAccOff', visible: false }
    };
    titles: {} = {
        allSell: 'All Selling',
        recOff: 'Received',
        accOff: 'Accepted',
        myOff: 'Sent',
        myAccOff: 'Confirmed'
    };

    constructor(private bookService: BookService,
                 private fb: FormBuilder) {
        // crea il form.
        this.bookForm = this.fb.group({
            bookTitle: ['', Validators.compose([Validators.required, Validators.pattern(/^[\w '\.]+$/)])]
        });
        // controlla validità della stringa inserita nel campo input.
        this.bookForm.valueChanges.subscribe(() => this.onValueChanges());
    }

    ngOnInit() {
        // esegui richiesta per ottenere i libri che ho messo in vendita e inseriscili nella proprietà "allSellingList".
        this.bookService.getMyBooks()
            .then(res => this.allSellingList = res.myBooks,
                  err => this.httpErr = err);

        // ottieni i dati dell utente relativi alle offerte ricevute, accettate e alle offerte effettuate, confermate.
        this.bookService.getUserData()
            .then(res => {
            let userData = res.userData;
            this.receivedOffersList = userData.receivedOffers;
            this.acceptedOffersList = userData.acceptedOffers;
            this.myOffersList = userData.myOffers;
            this.myAcceptedOffersList = userData.myAcceptedOffers;
        },
                  err => this.httpErr = err);
    }

    //funzione che controlla validità del testo inserito nel campo inpout.
    onValueChanges() {
        if (!this.bookForm) { return; }
        const form = this.bookForm;
        this.error = false;
        for (const field in this.formErrors) {
            this.formErrors[field] = '';
            const control = form.get(field);
            if (control && control.dirty && !control.valid) {
                this.error = true;
                const messages = this.validationMessages[field];
                for (const key in control.errors) {
                    this.formErrors[field] += messages[key] + ' ';
                }
            }
        }
    }

    // questo metodo effettua una ricerca tramite la Google Books API, in base al testo inserito nel campo input, quando la API risponderà alla richiesta andremo ad inserire il nuovo oggetto relativo al libro nella lista "allSellingList".
    getBook(formData: any): void {
        if (!formData.bookTitle) {
            return;
        }
        this.bookService.getBook(formData.bookTitle)
            .then(res => this.allSellingList.push(res.newBook),
                  err => this.httpErr = err);
    }

    // la funzione è utilizzata per raccogliere le informazioni relative al venditore o all'offerente quando andremo a premere sul bottone "Contact Info".
    getUserInfo(user: string, bookTitle: string, list: any[]): void {
        // "elemPos" conterrà l'indice dell'oggetto "bookData" inserito nella relativa lista "list". Questo dato ci servirà per visualizzare nel template le infornazioni specifiche per quell'oggetto escludendo tutti gli altri. Saremo così in grado attraverso le condizioni nel template di visualizzare solo quel determinato elemento "info".
        this.elemPos = list.findIndex(elem => elem.title === bookTitle);
        // inposta dei valori temporanei mentre il server ritorna le info.
        this.email = 'Loading...';
        this.name = 'Loading...';
        this.city = 'Loading...';
        this.state = 'Loading...';
        // invia una richiesta http per le info dell'offerente o del venditore. Quando il server ritornerà le info inposta le relative proprietà con i nuovi valori.
        this.bookService.getUserInfo(user)
            .then(res => {
            this.email = res.userInfo.email;
            this.name = res.userInfo.name || 'Not added.';
            this.city = res.userInfo.city || 'Not added.';
            this.state = res.userInfo.state || 'Not added.';
            this.showInfo = true;
        },
                  err => this.httpErr = err);
    }

    // elimina il libro dalla lista  utilizzata dal template e dalle relative liste nel database quando l'utente cliccherà sul bottone "Reject Offer".
    deleteMyBook(bookTitle: string): void {
        this.allSellingList.forEach((elem, i) => {
            if (elem.volumeInfo.title === bookTitle) {
                this.allSellingList.splice(i, 1);
            }
        });
        this.allSellingList.filter(elem => { return elem !== undefined; });
        this.bookService.deleteMyBook(bookTitle)
            .then(res => null,
                  err => this. httpErr = err);
    }

    // funzione che regola l'accettazione delle offerte ricevute.
    acceptOffer(bookInfo: any): void {
        // ricordarsi di  nascondere le sezioni "info" se aperte quando andremo ad accettare l'offerta. 
        this.hideInfo();
        // inserisci il nuovo libro nella nuva lista.
        this.acceptedOffersList.push(bookInfo);
        // rimuovi il libro dalla vecchia lista
        this.receivedOffersList = this.bookService.findAndRemove(this.receivedOffersList, bookInfo);
        // fai la stessa cosa sul server.
        this.bookService.acceptOffer(bookInfo)
            .then(() => null,
                  err => this.httpErr = err);
    }

    // funzione che gestisce il rifiuto delle offerte. La logica è simile a quella utilizzata nella funzione sopra.
    deleteOffer(bookInfo: any): void {
        this.hideInfo();
        this.receivedOffersList = this.bookService.findAndRemove(this.receivedOffersList, bookInfo);
        this.acceptedOffersList = this.bookService.findAndRemove(this.acceptedOffersList, bookInfo);
        this.bookService.deleteOffer(bookInfo)
            .then(() => null,
                  err => this.httpErr = err);
    }

    // funzione che determina quale sezione visualizzare e allo stesso tempo nascondere tutte le altre. Ma anche quele titolo visualizzare in base alla sezione su cui abbiamo cliccato.
    show_hide(section: string): void {
        // anche qui ricordarsi di nascondere la sezione info.
        this.hideInfo();
        for (let prop in this.sections) {
            if (section === prop) {
                // intanto che ci siamo utilizziamo la questa funzione per impostare il titolo della sezione.
                this.title = this.titles[prop];
                this.sections[prop].visible = true;
            } else {
                this.sections[prop].visible = false;
            }
        }
    }

    // utility function
    hideInfo(): void {
        this.showInfo = false;
    }
}
