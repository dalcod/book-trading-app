"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var book_service_1 = require("./book.service");
var MyBooksComponent = (function () {
    function MyBooksComponent(bookService, fb) {
        var _this = this;
        this.bookService = bookService;
        this.fb = fb;
        this.receivedOffersList = [];
        this.acceptedOffersList = [];
        this.myOffersList = [];
        this.myAcceptedOffersList = [];
        this.showInfo = false;
        this.formErrors = {
            bookTitle: '',
        };
        this.validationMessages = {
            bookTitle: {
                'required': 'A book name is required',
                'pattern': 'Book names can contain only letters and numbers'
            }
        };
        this.sections = {
            allSell: { name: 'allSell', visible: true },
            recOff: { name: 'recOff', visible: false },
            accOff: { name: 'accOff', visible: false },
            myOff: { name: 'myOff', visible: false },
            myAccOff: { name: 'myAccOff', visible: false }
        };
        this.titles = {
            allSell: 'All Selling',
            recOff: 'Received',
            accOff: 'Accepted',
            myOff: 'Sent',
            myAccOff: 'Confirmed'
        };
        // crea il form.
        this.bookForm = this.fb.group({
            bookTitle: ['', forms_1.Validators.compose([forms_1.Validators.required, forms_1.Validators.pattern(/^[\w ]+$/)])]
        });
        // controlla validità della stringa inserita nel campo input.
        this.bookForm.valueChanges.subscribe(function () { return _this.onValueChanges(); });
    }
    MyBooksComponent.prototype.ngOnInit = function () {
        var _this = this;
        // esegui richiesta per ottenere i libri che ho messo in vendita e inseriscili nella proprietà "allSellingList".
        this.bookService.getMyBooks()
            .then(function (res) { return _this.allSellingList = res.myBooks; }, function (err) { return _this.httpErr = err; });
        // ottieni i dati dell utente relativi alle offerte ricevute, accettate e alle offerte effettuate, confermate.
        this.bookService.getUserData()
            .then(function (res) {
            var userData = res.userData;
            _this.receivedOffersList = userData.receivedOffers;
            _this.acceptedOffersList = userData.acceptedOffers;
            _this.myOffersList = userData.myOffers;
            _this.myAcceptedOffersList = userData.myAcceptedOffers;
        }, function (err) { return _this.httpErr = err; });
    };
    //funzione che controlla validità del testo inserito nel campo inpout.
    MyBooksComponent.prototype.onValueChanges = function () {
        if (!this.bookForm) {
            return;
        }
        var form = this.bookForm;
        this.error = false;
        for (var field in this.formErrors) {
            this.formErrors[field] = '';
            var control = form.get(field);
            if (control && control.dirty && !control.valid) {
                this.error = true;
                var messages = this.validationMessages[field];
                for (var key in control.errors) {
                    this.formErrors[field] += messages[key] + ' ';
                }
            }
        }
    };
    // questo metodo effettua una ricerca tramite la Google Books API, in base al testo inserito nel campo input, quando la API risponderà alla richiesta andremo ad inserire il nuovo oggetto relativo al libro nella lista "allSellingList".
    MyBooksComponent.prototype.getBook = function (formData) {
        var _this = this;
        if (!formData.bookTitle) {
            return;
        }
        this.bookService.getBook(formData.bookTitle)
            .then(function (res) { return _this.allSellingList.push(res.newBook); }, function (err) { return _this.httpErr = err; });
    };
    // la funzione è utilizzata per raccogliere le informazioni relative al venditore o all'offerente quando andremo a premere sul bottone "Contact Info".
    MyBooksComponent.prototype.getUserInfo = function (user, bookTitle, list) {
        var _this = this;
        // "elemPos" conterrà l'indice dell'oggetto "bookData" inserito nella relativa lista "list". Questo dato ci servirà per visualizzare nel template le infornazioni specifiche per quell'oggetto escludendo tutti gli altri. Saremo così in grado attraverso le condizioni nel template di visualizzare solo quel determinato elemento "info".
        this.elemPos = list.findIndex(function (elem) { return elem.title === bookTitle; });
        // inposta dei valori temporanei mentre il server ritorna le info.
        this.email = 'Loading...';
        this.name = 'Loading...';
        this.city = 'Loading...';
        this.state = 'Loading...';
        // invia una richiesta http per le info dell'offerente o del venditore. Quando il server ritornerà le info inposta le relative proprietà con i nuovi valori.
        this.bookService.getUserInfo(user)
            .then(function (res) {
            _this.email = res.userInfo.email;
            _this.name = res.userInfo.name || 'Not added.';
            _this.city = res.userInfo.city || 'Not added.';
            _this.state = res.userInfo.state || 'Not added.';
            _this.showInfo = true;
        }, function (err) { return _this.httpErr = err; });
    };
    // elimina il libro dalla lista  utilizzata dal template e dalle relative liste nel database quando l'utente cliccherà sul bottone "Reject Offer".
    MyBooksComponent.prototype.deleteMyBook = function (bookTitle) {
        var _this = this;
        this.allSellingList.forEach(function (elem, i) {
            if (elem.volumeInfo.title === bookTitle) {
                _this.allSellingList.splice(i, 1);
            }
        });
        this.allSellingList.filter(function (elem) { return elem !== undefined; });
        this.bookService.deleteMyBook(bookTitle)
            .then(function (res) { return null; }, function (err) { return _this.httpErr = err; });
    };
    // funzione che regola l'accettazione delle offerte ricevute.
    MyBooksComponent.prototype.acceptOffer = function (bookInfo) {
        var _this = this;
        // ricordarsi di  nascondere le sezioni "info" se aperte quando andremo ad accettare l'offerta. 
        this.hideInfo();
        // inserisci il nuovo libro nella nuva lista.
        this.acceptedOffersList.push(bookInfo);
        // rimuovi il libro dalla vecchia lista
        this.receivedOffersList = this.bookService.findAndRemove(this.receivedOffersList, bookInfo);
        // fai la stessa cosa sul server.
        this.bookService.acceptOffer(bookInfo)
            .then(function () { return null; }, function (err) { return _this.httpErr = err; });
    };
    // funzione che gestisce il rifiuto delle offerte. La logica è simile a quella utilizzata nella funzione sopra.
    MyBooksComponent.prototype.deleteOffer = function (bookInfo) {
        var _this = this;
        this.hideInfo();
        this.receivedOffersList = this.bookService.findAndRemove(this.receivedOffersList, bookInfo);
        this.acceptedOffersList = this.bookService.findAndRemove(this.acceptedOffersList, bookInfo);
        this.bookService.deleteOffer(bookInfo)
            .then(function () { return null; }, function (err) { return _this.httpErr = err; });
    };
    // funzione che determina quale sezione visualizzare e allo stesso tempo nascondere tutte le altre. Ma anche quele titolo visualizzare in base alla sezione su cui abbiamo cliccato.
    MyBooksComponent.prototype.show_hide = function (section) {
        // anche quà ricordarsi di nascondere la sezione info.
        this.hideInfo();
        for (var prop in this.sections) {
            if (section === prop) {
                // intanto che ci siamo utilizziamo la questa funzione per impostare il titolo della sezione.
                this.title = this.titles[prop];
                this.sections[prop].visible = true;
            }
            else {
                this.sections[prop].visible = false;
            }
        }
    };
    // utility function
    MyBooksComponent.prototype.hideInfo = function () {
        this.showInfo = false;
    };
    return MyBooksComponent;
}());
MyBooksComponent = __decorate([
    core_1.Component({
        templateUrl: './mybooks.component.html',
        styleUrls: ['./mybooks.component.css', './mybooks-nav.component.css', './mybooks-sections.component.css']
    }),
    __metadata("design:paramtypes", [book_service_1.BookService,
        forms_1.FormBuilder])
], MyBooksComponent);
exports.MyBooksComponent = MyBooksComponent;
//# sourceMappingURL=mybooks.component.js.map