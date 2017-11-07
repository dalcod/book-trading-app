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
var UserService = (function () {
    function UserService(http) {
        this.http = http;
        this.header = new http_1.Headers({ 'Content-Type': 'application/json' });
        this.loggedIn = !!localStorage.getItem('token');
    }
    UserService.prototype.isLoggedIn = function () {
        return this.loggedIn;
    };
    UserService.prototype.isPasswordChanged = function () {
        return this.successMsg;
    };
    UserService.prototype.getUsername = function () {
        return this.username;
    };
    UserService.prototype.handleError = function (error) {
        var errMsg;
        var obj;
        if (error instanceof http_1.Response) {
            if (error.status === 404 && error.statusText !== 'Not Found') {
                errMsg = error.statusText;
                obj = { user: errMsg };
            }
            else {
                errMsg = error.status + ' - ' + error.statusText;
                obj = { http: errMsg };
            }
        }
        return Promise.reject(obj);
    };
    UserService.prototype.createAuthHeader = function (headers) {
        var token = localStorage.getItem('token');
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', 'JWT ' + token);
    };
    UserService.prototype.signup = function (username, email, password) {
        var _this = this;
        return this.http
            .post('/signup', JSON.stringify({ username: username, email: email, password: password }), { headers: this.header })
            .toPromise()
            .then(function (res) {
            var resObj = res.json();
            if (resObj.success) {
                _this.username = username;
                localStorage.setItem('token', resObj.token);
                _this.loggedIn = true;
            }
            else {
                throw resObj;
            }
        }).catch(this.handleError);
    };
    UserService.prototype.login = function (username, password) {
        var _this = this;
        return this.http
            .post('/login', JSON.stringify({ username: username, password: password }), { headers: this.header })
            .toPromise()
            .then(function (res) {
            var resObj = res.json();
            if (resObj.success) {
                _this.username = username;
                localStorage.setItem('token', resObj.token);
                _this.loggedIn = true;
                _this.successMsg = '';
                return true;
            }
            else {
                throw resObj;
            }
        }).catch(this.handleError);
    };
    UserService.prototype.logout = function () {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        this.loggedIn = false;
    };
    UserService.prototype.updateProfile = function (name, city, state) {
        console.log(this.username);
        var headers = new http_1.Headers();
        this.createAuthHeader(headers);
        return this.http.put('/update-profile', JSON.stringify({ username: this.username, name: name, city: city, state: state }), { headers: headers })
            .toPromise()
            .then(function (res) {
            var resObj = res.json();
            if (resObj.success) {
                return resObj.message;
            }
            else {
                throw resObj;
            }
        }).catch(this.handleError);
    };
    UserService.prototype.modifyPassword = function (currentPassword, password) {
        var _this = this;
        var headers = new http_1.Headers();
        this.createAuthHeader(headers);
        return this.http.put('/edit-profile', JSON.stringify({ username: this.username, currentPassword: currentPassword, password: password }), { headers: headers })
            .toPromise()
            .then(function (res) {
            var resObj = res.json();
            if (resObj.success) {
                // effettua logout parziale, mantieni l'username nel localstorage.
                localStorage.removeItem('token');
                _this.loggedIn = false;
                _this.successMsg = resObj.message;
            }
            else {
                throw resObj;
            }
        }).catch(this.handleError);
    };
    UserService.prototype.deleteAccount = function (password) {
        var _this = this;
        var headers = new http_1.Headers();
        this.createAuthHeader(headers);
        return this.http.post('/delete-profile', JSON.stringify({ username: this.username, password: password }), { headers: headers })
            .toPromise()
            .then(function (res) {
            var resObj = res.json();
            if (resObj.success) {
                _this.logout();
                return true;
            }
            else {
                throw resObj;
            }
        }).catch(this.handleError);
    };
    return UserService;
}());
UserService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [http_1.Http])
], UserService);
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map