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
var http_1 = require("@angular/http");
require("rxjs/add/operator/catch");
require("rxjs/add/operator/toPromise");
var BookService = (function () {
    function BookService(http) {
        this.http = http;
    }
    BookService.prototype.createAuthHeader = function (headers) {
        var token = localStorage.getItem('token');
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', 'JWT ' + token);
    };
    BookService.prototype.handleError = function (error) {
        var errMsg;
        var obj;
        if (error instanceof http_1.Response) {
            errMsg = error.status + ' - ' + error.statusText;
        }
        return Promise.reject(errMsg);
    };
    BookService.prototype.getBook = function (bookTitle) {
        var username = localStorage.getItem('username');
        var headers = new http_1.Headers();
        this.createAuthHeader(headers);
        return this.http.get('/book/' + username + '/' + bookTitle, { headers: headers })
            .toPromise()
            .then(function (res) {
            var resObj = res.json();
            return resObj;
        }).catch(this.handleError);
    };
    BookService.prototype.deleteMyBook = function (bookTitle) {
        var username = localStorage.getItem('username');
        var headers = new http_1.Headers();
        this.createAuthHeader(headers);
        return this.http.delete('/book/' + username + '/' + bookTitle, { headers: headers })
            .toPromise()
            .then(function (res) { return null; }).catch(this.handleError);
    };
    BookService.prototype.getMyBooks = function () {
        var username = localStorage.getItem('username');
        var headers = new http_1.Headers();
        this.createAuthHeader(headers);
        return this.http.get('/mybooks/' + username, { headers: headers })
            .toPromise()
            .then(function (res) {
            var resObj = res.json();
            return resObj;
        }).catch(this.handleError);
    };
    BookService.prototype.getAllBooks = function () {
        return this.http.get('/all-books')
            .toPromise()
            .then(function (res) {
            var resObj = res.json();
            return resObj;
        }).catch(this.handleError);
    };
    BookService.prototype.getUserData = function () {
        var username = localStorage.getItem('username');
        var headers = new http_1.Headers();
        this.createAuthHeader(headers);
        return this.http.get('/data/' + username, { headers: headers })
            .toPromise()
            .then(function (res) {
            var resObj = res.json();
            return resObj;
        }).catch(this.handleError);
    };
    BookService.prototype.getUserInfo = function (username) {
        var headers = new http_1.Headers();
        this.createAuthHeader(headers);
        return this.http.get('/info/' + username, { headers: headers })
            .toPromise()
            .then(function (res) {
            var resObj = res.json();
            return resObj;
        }).catch(this.handleError);
    };
    BookService.prototype.makeOffer = function (bookInfo, bidder, seller) {
        var headers = new http_1.Headers();
        this.createAuthHeader(headers);
        return this.http.post('/offer', JSON.stringify({ bookInfo: bookInfo, bidder: bidder, seller: seller }), { headers: headers })
            .toPromise()
            .then(function (res) { return null; }).catch(this.handleError);
    };
    BookService.prototype.acceptOffer = function (bookInfo) {
        var headers = new http_1.Headers();
        this.createAuthHeader(headers);
        return this.http.put('/offer', JSON.stringify({ bookInfo: bookInfo }), { headers: headers })
            .toPromise()
            .then(function (res) { return null; }).catch(this.handleError);
    };
    BookService.prototype.deleteOffer = function (bookInfo) {
        var headers = new http_1.Headers();
        this.createAuthHeader(headers);
        return this.http.post('/delete-offer', JSON.stringify({ bookInfo: bookInfo }), { headers: headers })
            .toPromise()
            .then(function (res) { return null; }).catch(this.handleError);
    };
    // funzione che fitrerà tutti i libri inseriti dagli utenti e stabilisce se quel determinato utente potrà effettuare un'offerta su un determinato libro oppure no.
    BookService.prototype.checkIfCanOffer = function (bookList, myOffers) {
        var username = localStorage.getItem('username');
        for (var i = 0; i < bookList.length; i++) {
            // per tutti gli utenti: se non sono presenti altre offerte per quel libro e non ne siamo noi i proprietari, imposta "canOffer" come "true".
            if (bookList[i].canOffer !== false && bookList[i].username !== username) {
                bookList[i].canOffer = true;
            }
            else {
                bookList[i].canOffer = false;
            }
            // per quanto concerne l'utente specifico che ha effettuato l'offerta se la proprietà "canOffer" è già impostata su "false" passa al libro successivo.
            for (var j = 0; j < myOffers.length; j++) {
                if (bookList[i].canOffer === false) {
                    continue;
                }
                // se la proprietà invece non è impostata su false, ma il titolo del libro per cui ho effettuato quella determinata offera è uguale a quello inserito nella lista ed inoltre il venditore del libro per cui ho effettuato l'offerta è lo stesso del venditore del libro inserito nella lista, imposta la proprietà come "false".
                if (myOffers[j].title === bookList[i].volumeInfo.title && myOffers[j].seller === bookList[i].username) {
                    bookList[i].canOffer = false;
                }
                else {
                    bookList[i].canOffer = true;
                }
            }
        }
        return bookList;
    };
    // trova e rimuovi l'elemento "objToRemove" all'interno dell array "arr". 
    BookService.prototype.findAndRemove = function (arr, objToRemove) {
        arr.forEach(function (elem, i) {
            if (elem.title === objToRemove.title) {
                arr.splice(i, 1);
            }
        });
        var arr1 = arr.filter(function (elem) { return elem !== undefined; });
        return arr1;
    };
    return BookService;
}());
BookService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [http_1.Http])
], BookService);
exports.BookService = BookService;
//# sourceMappingURL=book.service.js.map