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
var book_service_1 = require("./book.service");
var user_service_1 = require("../user/user.service");
var BookListComponent = (function () {
    function BookListComponent(bookService, userService) {
        this.bookService = bookService;
        this.userService = userService;
    }
    BookListComponent.prototype.ngOnInit = function () {
        var _this = this;
        // inserisci nella "bookList" tutti i libri ritornati dal server.
        this.bookService.getAllBooks()
            .then(function (res) { return _this.bookList = res.list; }, function (err) { return _this.httpErr = err; });
        // se l'utente è loggato
        if (this.isLoggedIn()) {
            // stabilisci se l'utente può effettuare o meno un'offerta per un determinato libro.
            this.bookService.getUserData()
                .then(function (res) {
                var userData = res.userData;
                _this.myOffers = userData.myOffers;
                // il metodo "checkIfCanOffer" stabilisce per quali libri l'utente può effettuare un'offerta.
                _this.bookList = _this.bookService.checkIfCanOffer(_this.bookList, _this.myOffers);
            }, function (err) { return _this.httpErr = err; });
        }
    };
    BookListComponent.prototype.isLoggedIn = function () {
        return this.userService.isLoggedIn();
    };
    BookListComponent.prototype.getUsername = function () {
        return this.userService.getUsername();
    };
    BookListComponent.prototype.makeOffer = function (bookData) {
        var _this = this;
        // questa proprietà è utilizzata per visualizzare un'icona "checked" quando andremo a cliccare sull'elemento "Make an Offer".
        this.checkedBook = bookData.volumeInfo.title;
        var bookInfo = bookData.volumeInfo;
        // determina chi è l'aquirente e chi il venditore e aumenta l'oggetto relativo al libro, in passaggi successivi, con delle proprietà significative.
        var bidder = this.getUsername();
        var seller = bookData.username;
        // esegui offerta.
        this.bookService.makeOffer(bookInfo, bidder, seller)
            .then(function (res) { return null; }, function (err) { return _this.httpErr = err; });
    };
    return BookListComponent;
}());
BookListComponent = __decorate([
    core_1.Component({
        templateUrl: './book-list.component.html',
        styleUrls: ['./book-list.component.css']
    }),
    __metadata("design:paramtypes", [book_service_1.BookService, user_service_1.UserService])
], BookListComponent);
exports.BookListComponent = BookListComponent;
//# sourceMappingURL=book-list.component.js.map