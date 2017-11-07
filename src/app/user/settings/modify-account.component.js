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
var router_1 = require("@angular/router");
var user_service_1 = require("../user.service");
var ModifyAccountComponent = (function () {
    function ModifyAccountComponent(fb, userService, router) {
        var _this = this;
        this.fb = fb;
        this.userService = userService;
        this.router = router;
        this.formErrors = {
            currentPassword: '',
            password: '',
            confirmPassword: ''
        };
        this.validationMessages = {
            currentPassword: {
                'required': 'Password is required.'
            },
            password: {
                'required': 'Password is required',
                'minlength': 'Password must be at least 6 characters long.',
                'maxlength': 'Password cannot be more than 20 characters.'
            },
            confirmPassword: {
                'required': 'Password is required',
                'minlength': 'Password must be at least 6 characters long.',
                'maxlength': 'Password cannot be more than 20 characters.'
            }
        };
        this.onError = new core_1.EventEmitter();
        this.createModifyForm();
        this.modifyForm.valueChanges
            .subscribe(function () { return _this.onValueChanges(); });
    }
    ModifyAccountComponent.prototype.createModifyForm = function () {
        this.modifyForm = this.fb.group({
            currentPassword: ['', forms_1.Validators.required],
            password: ['', forms_1.Validators.compose([forms_1.Validators.required, forms_1.Validators.minLength(6), forms_1.Validators.maxLength(20)])],
            confirmPassword: ['', forms_1.Validators.compose([forms_1.Validators.required, forms_1.Validators.minLength(6), forms_1.Validators.maxLength(20)])]
        });
    };
    ModifyAccountComponent.prototype.onValueChanges = function () {
        if (!this.modifyForm) {
            return;
        }
        var form = this.modifyForm;
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
    ModifyAccountComponent.prototype.onSubmit = function (formData) {
        var _this = this;
        if (this.error) {
            this.errMsg = 'Please correct reported errors before submitting.';
            return;
        }
        if (formData.password !== formData.confirmPassword) {
            this.errMsg = 'Password doesn\'t match, cannot confirm the password.';
            return;
        }
        // invia una richiesta di modifica al server per la password attuale passando contemporaneamente la nuova password. Se tutto funziona come previsto rendirizza l'utente alla pagina di login.
        this.userService.modifyPassword(formData.currentPassword, formData.password)
            .then(function (res) {
            _this.router.navigate(['./login']);
        }, function (err) {
            if (err.http) {
                _this.onError.emit(err.http);
            }
            else {
                _this.errMsg = err.user;
            }
        });
    };
    return ModifyAccountComponent;
}());
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], ModifyAccountComponent.prototype, "onError", void 0);
ModifyAccountComponent = __decorate([
    core_1.Component({
        selector: 'modify-section',
        templateUrl: './modify-account.component.html',
        styleUrls: ['./modify-account.component.css']
    }),
    __metadata("design:paramtypes", [forms_1.FormBuilder, user_service_1.UserService, router_1.Router])
], ModifyAccountComponent);
exports.ModifyAccountComponent = ModifyAccountComponent;
//# sourceMappingURL=modify-account.component.js.map