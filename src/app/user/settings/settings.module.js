"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require("@angular/core");
var platform_browser_1 = require("@angular/platform-browser");
var forms_1 = require("@angular/forms");
var http_1 = require("@angular/http");
var settings_component_1 = require("./settings.component");
var modify_account_component_1 = require("./modify-account.component");
var delete_account_component_1 = require("./delete-account.component");
var update_profile_component_1 = require("./update-profile.component");
var settings_routing_module_1 = require("./settings-routing.module");
var user_service_1 = require("../user.service");
var logged_in_guard_1 = require("../../logged-in-guard");
var SettingsModule = (function () {
    function SettingsModule() {
    }
    return SettingsModule;
}());
SettingsModule = __decorate([
    core_1.NgModule({
        imports: [
            platform_browser_1.BrowserModule,
            forms_1.ReactiveFormsModule,
            http_1.HttpModule,
            settings_routing_module_1.SettingsRoutingModule
        ],
        declarations: [
            settings_component_1.SettingsComponent,
            modify_account_component_1.ModifyAccountComponent,
            delete_account_component_1.DeleteAccountComponent,
            update_profile_component_1.UpdateProfileComponent
        ],
        providers: [user_service_1.UserService, logged_in_guard_1.LoggedInGuard]
    })
], SettingsModule);
exports.SettingsModule = SettingsModule;
//# sourceMappingURL=settings.module.js.map