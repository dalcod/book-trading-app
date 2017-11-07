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
var user_service_1 = require("../user.service");
var UpdateProfileComponent = (function () {
    function UpdateProfileComponent(fb, userService) {
        var _this = this;
        this.fb = fb;
        this.userService = userService;
        this.formErrors = {
            name: '',
            city: '',
            state: ''
        };
        this.validationMessages = {
            name: {
                'required': 'Name field is required.',
                'pattern': 'Name name must contain only letters and spaces.'
            },
            city: {
                'required': 'City field is required.',
                'pattern': 'City name must contain only letters and spaces.'
            },
            state: {
                'required': 'State field is required.',
                'pattern': 'State name nust contain only letters and spaces.'
            }
        };
        this.onError = new core_1.EventEmitter();
        this.updateProfileForm = fb.group({
            name: ['', forms_1.Validators.compose([forms_1.Validators.required, forms_1.Validators.pattern(/^[a-zA-Z ]+$/)])],
            city: ['', forms_1.Validators.compose([forms_1.Validators.required, forms_1.Validators.pattern(/^[a-zA-Z ]+$/)])],
            state: ['', forms_1.Validators.compose([forms_1.Validators.required, forms_1.Validators.pattern(/^[a-zA-Z ]+$/)])]
        });
        this.updateProfileForm.valueChanges.subscribe(function () { return _this.onValueChanges(); });
    }
    UpdateProfileComponent.prototype.onValueChanges = function () {
        if (!this.updateProfileForm) {
            return;
        }
        var form = this.updateProfileForm;
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
    UpdateProfileComponent.prototype.onSubmit = function (formData) {
        var _this = this;
        var name = formData.name;
        var city = formData.city;
        var state = formData.state;
        if (!name && !city && !state) {
            return;
        }
        if (this.error) {
            this.errMsg = 'Please correct reported errors before submitting.';
            return;
        }
        this.successMsg = '';
        // effettua richiesta di inserimento al server per i relativi paramentri. 
        this.userService.updateProfile(name, city, state)
            .then(function (res) { return _this.successMsg = res; }, function (err) { return _this.onError.emit(err.http); });
    };
    return UpdateProfileComponent;
}());
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], UpdateProfileComponent.prototype, "onError", void 0);
UpdateProfileComponent = __decorate([
    core_1.Component({
        selector: 'update-section',
        templateUrl: './update-profile.component.html',
        styleUrls: ['./update-profile.component.css']
    }),
    __metadata("design:paramtypes", [forms_1.FormBuilder, user_service_1.UserService])
], UpdateProfileComponent);
exports.UpdateProfileComponent = UpdateProfileComponent;
//# sourceMappingURL=update-profile.component.js.map