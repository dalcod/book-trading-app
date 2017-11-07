import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class BookService {

    constructor(private http: Http) {}

    private createAuthHeader(headers: Headers): void {
        let token = localStorage.getItem('token');
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', 'JWT ' + token);
    }

    private handleError (error: Response | any): Promise<string> {
        let errMsg: string;
        if (error instanceof Response) {
            errMsg = error.status + ' - ' + error.statusText;
        }
        return Promise.reject(errMsg);
    }

    public getBook(bookTitle: string): Promise<any> {
        let username: string = localStorage.getItem('username');
        let headers = new Headers();
        this.createAuthHeader(headers);
        return this.http.get('/book/' + username + '/' + bookTitle, {headers: headers})
            .toPromise()
            .then(res => {
            let resObj = res.json();
            return resObj;
        }).catch(this.handleError);
    }

    public deleteMyBook(bookTitle: string): Promise<any> {
        let username: string = localStorage.getItem('username');
        let headers = new Headers();
        this.createAuthHeader(headers);
        return this.http.delete('/book/' + username + '/' + bookTitle, {headers: headers})
            .toPromise()
            .then(res => null).catch(this.handleError);
    }

    public getMyBooks(): Promise<any> {
        let username: string = localStorage.getItem('username');
        let headers = new Headers();
        this.createAuthHeader(headers);
        return this.http.get('/mybooks/' + username, {headers: headers})
            .toPromise()
            .then(res => {
            let resObj = res.json();
            return resObj;
        }).catch(this.handleError);
    }

    public getAllBooks(): Promise<any> {
        return this.http.get('/all-books')
            .toPromise()
            .then(res => {
            let resObj = res.json();
            return resObj;
        }).catch(this.handleError);
    }

    public getUserData(): Promise<any> {
        let username: string = localStorage.getItem('username');
        let headers = new Headers();
        this.createAuthHeader(headers);
        return this.http.get('/data/' + username, { headers: headers })
            .toPromise()
            .then(res => {
            let resObj = res.json();
            return resObj;
        }).catch(this.handleError);
    }

    public getUserInfo(username: string): Promise<any> {
        let headers = new Headers();
        this.createAuthHeader(headers);
        return this.http.get('/info/' + username, { headers: headers })
            .toPromise()
            .then(res => {
            let resObj = res.json();
            return resObj;
        }).catch(this.handleError);
    }

    public makeOffer(bookInfo: any, bidder: string, seller: string): Promise<any> {
        let headers = new Headers();
        this.createAuthHeader(headers);
        return this.http.post('/offer', JSON.stringify({bookInfo, bidder, seller}), {headers: headers})
            .toPromise()
            .then(res => null).catch(this.handleError);
    }

    public acceptOffer(bookInfo: any): Promise<any> {
        let headers = new Headers();
        this.createAuthHeader(headers);
        return this.http.put('/offer', JSON.stringify({ bookInfo }), { headers: headers })
            .toPromise()
            .then(res => null).catch(this.handleError);
    }

    public deleteOffer(bookInfo: any): Promise<any> {
        let headers = new Headers();
        this.createAuthHeader(headers);
        return this.http.post('/delete-offer', JSON.stringify({ bookInfo }), { headers: headers })
            .toPromise()
            .then(res => null).catch(this.handleError);
    }

    // funzione che fitrerà tutti i libri inseriti dagli utenti e stabilisce se quel determinato utente potrà effettuare un'offerta su un determinato libro oppure no.
    public checkIfCanOffer(bookList: Array<any>, myOffers: Array<any>): Array<any> {
        let username = localStorage.getItem('username');
        for (let i = 0; i < bookList.length; i++) {
            // per tutti gli utenti: se non sono presenti altre offerte per quel libro e non ne siamo noi i proprietari, imposta "canOffer" come "true".
            if (bookList[i].canOffer !== false && bookList[i].username !== username) {
                bookList[i].canOffer = true;
            } else {
                bookList[i].canOffer = false;
            }
            // per quanto concerne l'utente specifico che ha effettuato l'offerta se la proprietà "canOffer" è già impostata su "false" passa al libro successivo.
            for (let j = 0; j < myOffers.length; j++) {
                if (bookList[i].canOffer === false) {
                    continue;
                }
                // se la proprietà invece non è impostata su false, ma il titolo del libro per cui ho effettuato quella determinata offera è uguale a quello inserito nella lista ed inoltre il venditore del libro per cui ho effettuato l'offerta è lo stesso del venditore del libro inserito nella lista, imposta la proprietà come "false".
                if (myOffers[j].title === bookList[i].volumeInfo.title && myOffers[j].seller === bookList[i].username) {
                    bookList[i].canOffer = false;
                } else {
                    bookList[i].canOffer = true;
                }
            }
        }
        return bookList;
    }

    // trova e rimuovi l'elemento "objToRemove" all'interno dell array "arr". 
    public findAndRemove(arr: Array<any>, objToRemove: any): Array<any> {
        arr.forEach(function(elem, i){
            if (elem.title === objToRemove.title) {
                arr.splice(i, 1);
            }
        });
        var arr1 = arr.filter(function(elem){ return elem !== undefined });
        return arr1;
    }
}