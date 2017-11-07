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
var router_1 = require("@angular/router");
var user_service_1 = require("./user/user.service");
var AppComponent = (function () {
    function AppComponent(router, userService) {
        this.router = router;
        this.userService = userService;
    }
    //per qualche motivo usare questo sistema per visualizzare o nascondere gli elementi della navbar funziona mentre tutti gli altri no. Come ad esempio utilizzare una proprietà dell' UserService, modificata dinamicamente da altri componenti, a cui faranno riferimento le condizioni all'interno degli elementi nel template di questo componente.
    AppComponent.prototype.isLoggedIn = function () {
        return this.userService.isLoggedIn();
    };
    AppComponent.prototype.getUsername = function () {
        return this.userService.getUsername();
    };
    AppComponent.prototype.logout = function () {
        this.userService.logout();
        this.router.navigate(['/home']);
    };
    return AppComponent;
}());
AppComponent = __decorate([
    core_1.Component({
        selector: 'my-app',
        templateUrl: './app.component.html',
        styleUrls: ['./app.component.css']
    }),
    __metadata("design:paramtypes", [router_1.Router, user_service_1.UserService])
], AppComponent);
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.component.js.map