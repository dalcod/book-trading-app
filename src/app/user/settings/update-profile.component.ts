import { Component, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { UserService } from '../user.service';
import {  } from '';

@Component({
    selector: 'update-section',
    templateUrl: './update-profile.component.html',
    styleUrls: ['./update-profile.component.css']
})

export class UpdateProfileComponent {

    updateProfileForm: FormGroup;
    successMsg: string;
    errMsg: string;
    error: boolean;
    formErrors: any = {
        name: '',
        city: '',
        state: ''
    };
    validationMessages: any = {
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

    @Output() onError = new EventEmitter<string>();

    constructor(private fb: FormBuilder, private userService: UserService) {
        this.updateProfileForm = fb.group({
            name: ['', Validators.compose([Validators.required, Validators.pattern(/^[a-zA-Z ]+$/)])],
            city: ['', Validators.compose([Validators.required, Validators.pattern(/^[a-zA-Z ]+$/)])],
            state: ['', Validators.compose([Validators.required, Validators.pattern(/^[a-zA-Z ]+$/)])]
        });
        this.updateProfileForm.valueChanges.subscribe(() => this.onValueChanges());
    }

    onValueChanges() {
        if (!this.updateProfileForm) { return; }
        const form = this.updateProfileForm;
        this.error = false;
        for (const field in this.formErrors) {
            this.formErrors[field] = '';
            const control = form.get(field);
            if (control && control.dirty && !control.valid) {
                this.error = true;
                const messages = this.validationMessages[field];
                for (const key in control.errors) {
                    this.formErrors[field] += messages[key] + ' ';
                }
            }
        }
    }

    onSubmit(formData: any): void {
        let name = formData.name;
        let city = formData.city;
        let state = formData.state;
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
        .then(res => this.successMsg = res,
             err => this.onError.emit(err.http));
    }
}
