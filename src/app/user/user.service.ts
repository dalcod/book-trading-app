import {Injectable} from '@angular/core';
import {Http, Headers, Response} from '@angular/http';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class UserService {
    private loggedIn: boolean;
    private header: Headers = new Headers({'Content-Type': 'application/json'});
    private successMsg: string;
    public username: string;

    constructor(private http: Http) {
        this.loggedIn = !!localStorage.getItem('token');
    }

    public isLoggedIn(): boolean {
        return this.loggedIn;
    }

    public isPasswordChanged(): string {
        return this.successMsg;
    }

    public getUsername(): string {
        return this.username;
    }

    private handleError (error: Response | any): Promise<string> {
        let errMsg: string;
        let obj: Object;
        if (error instanceof Response) {
            if (error.status === 404 && error.statusText !== 'Not Found') {
                errMsg = error.statusText;
                obj = {user: errMsg};
            } else {
                errMsg = error.status + ' - ' + error.statusText;
                obj = {http: errMsg};
            }
        }
        return Promise.reject(obj);
    }

    private createAuthHeader(headers: Headers): void {
        let token = localStorage.getItem('token');
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', 'JWT ' + token);
    }

    public signup(username: string, email: string, password: string): Promise<any> {
        return this.http
            .post('/signup', JSON.stringify({username, email, password}), {headers: this.header})
            .toPromise()
            .then(res => {
            let resObj = res.json();
            if (resObj.success) {
                this.username = username;
                localStorage.setItem('token', resObj.token);
                this.loggedIn = true;
            } else {
                throw resObj;
            }
        }).catch(this.handleError);
    }

    public login(username: string, password: string): Promise<any> {
        return this.http
            .post('/login', JSON.stringify({username, password}), {headers: this.header})
            .toPromise()
            .then(res => {
            let resObj = res.json();
            if (resObj.success) {
                this.username = username;
                localStorage.setItem('token', resObj.token);
                this.loggedIn = true;
                this.successMsg = '';
                return true;
            } else {
                throw resObj;
            }
        }).catch(this.handleError);
    }

    public logout(): void {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        this.loggedIn = false;
    }

    public updateProfile(name: string, city: string, state: string): Promise<any> {
        console.log(this.username)
        let headers = new Headers();
        this.createAuthHeader(headers);
        return this.http.put('/update-profile', JSON.stringify({username: this.username, name, city, state}), {headers: headers})
            .toPromise()
            .then( res => {
            let resObj = res.json();
            if (resObj.success) {
                return resObj.message;
            } else {
                throw resObj;
            }
        }).catch(this.handleError);
    }

    public modifyPassword(currentPassword: string, password: string): Promise<any> {
        let headers = new Headers();
        this.createAuthHeader(headers);
        return this.http.put('/edit-profile', JSON.stringify({username: this.username, currentPassword, password}), {headers: headers})
            .toPromise()
            .then(res => {
            let resObj = res.json();
            if (resObj.success) {
                // effettua logout parziale, mantieni l'username nel localstorage.
                localStorage.removeItem('token');
                this.loggedIn = false;
                this.successMsg = resObj.message;
            } else {
                throw resObj;
            }
        }).catch(this.handleError);
    }

    public deleteAccount(password: string): Promise<any> {
        let headers = new Headers();
        this.createAuthHeader(headers);
        return this.http.post('/delete-profile', JSON.stringify({username: this.username, password}), {headers: headers})
            .toPromise()
            .then(res => {
            let resObj = res.json();
            if (resObj.success) {
                this.logout();
                return true;
            } else {
                throw resObj;
            }
        }).catch(this.handleError);
    }
}