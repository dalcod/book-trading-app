"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var settings_component_1 = require("./settings.component");
var logged_in_guard_1 = require("../../logged-in-guard");
var userRoutes = [
    { path: 'settings', component: settings_component_1.SettingsComponent, canActivate: [logged_in_guard_1.LoggedInGuard] }
];
var SettingsRoutingModule = (function () {
    function SettingsRoutingModule() {
    }
    return SettingsRoutingModule;
}());
SettingsRoutingModule = __decorate([
    core_1.NgModule({
        imports: [
            router_1.RouterModule.forChild(userRoutes)
        ],
        exports: [
            router_1.RouterModule
        ]
    })
], SettingsRoutingModule);
exports.SettingsRoutingModule = SettingsRoutingModule;
//# sourceMappingURL=settings-routing.module.js.map