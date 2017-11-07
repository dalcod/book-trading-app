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
var DeleteAccountComponent = (function () {
    function DeleteAccountComponent(fb, userService, router) {
        var _this = this;
        this.fb = fb;
        this.userService = userService;
        this.router = router;
        this.formErrors = {
            username: '',
            password: '',
            confirmPassword: ''
        };
        this.validationMessages = {
            password: {
                'required': 'Password is required'
            },
            confirmPassword: {
                'required': 'Password is required'
            }
        };
        // in questa proprietà andremo ad inserire l'eventuale errore che verrà poi trasmesso all'elemento padre tramite l'emissione di un evento.
        this.onError = new core_1.EventEmitter();
        this.createDelAccForm();
        this.delAccForm.valueChanges
            .subscribe(function () { return _this.onValueChanges(); });
    }
    DeleteAccountComponent.prototype.createDelAccForm = function () {
        this.delAccForm = this.fb.group({
            password: ['', forms_1.Validators.required],
            confirmPassword: ['', forms_1.Validators.required]
        });
    };
    DeleteAccountComponent.prototype.onValueChanges = function () {
        if (!this.delAccForm) {
            return;
        }
        var form = this.delAccForm;
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
    DeleteAccountComponent.prototype.onSubmit = function (formData) {
        var _this = this;
        // prima di sottomenttere il form controlla che non vi siano errori input non ancora corretti.
        if (this.error) {
            this.errMsg = 'Please correct reported errors before submitting.';
            return;
        }
        // se la password non combacia con la password inserita nel campo input di conferma password ritorna la funzione.
        if (formData.password !== formData.confirmPassword) {
            this.errMsg = 'Password doesn\'t match, cannot confirm the password.';
            return;
        }
        // se tutto è in ordine invia i dati al server e cancella l'account. Ad operazione compiuta reindirizza l'ex-utente alla pagina 'home'.
        this.userService.deleteAccount(formData.password)
            .then(function (res) {
            _this.router.navigate(['/home']);
        }, function (err) {
            if (err.http) {
                _this.onError.emit(err.http);
            }
            else {
                _this.errMsg = err.user;
            }
        });
    };
    return DeleteAccountComponent;
}());
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], DeleteAccountComponent.prototype, "onError", void 0);
DeleteAccountComponent = __decorate([
    core_1.Component({
        selector: 'delete-section',
        templateUrl: './delete-account.component.html',
        styleUrls: ['./delete-account.component.css']
    }),
    __metadata("design:paramtypes", [forms_1.FormBuilder,
        user_service_1.UserService,
        router_1.Router])
], DeleteAccountComponent);
exports.DeleteAccountComponent = DeleteAccountComponent;
//# sourceMappingURL=delete-account.component.js.map