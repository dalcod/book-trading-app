import { Component, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { UserService } from '../user.service';
import {  } from '';

@Component({
    selector: 'modify-section',
    templateUrl: './modify-account.component.html',
    styleUrls: ['./modify-account.component.css']
})

export class ModifyAccountComponent {
    public modifyForm: FormGroup;
    public errMsg: string;
    public httpErr: string;
    public error: boolean;
    formErrors: any = {
        currentPassword: '',
        password: '',
        confirmPassword: ''
    };
    validationMessages: any = {
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

    @Output() onError = new EventEmitter<string>();

    constructor(private fb: FormBuilder, private userService: UserService, private router: Router){
        this.createModifyForm();
        this.modifyForm.valueChanges
            .subscribe(() => this.onValueChanges());
    }

    public createModifyForm(): void {
        this.modifyForm = this.fb.group({
            currentPassword: ['', Validators.required],
            password: ['', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(20)])],
            confirmPassword: ['', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(20)])]
        });
    }

    public onValueChanges() {
        if (!this.modifyForm) { return; }
        const form = this.modifyForm;
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

    public onSubmit(formData: any): void {
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
            .then(
            res => {
                this.router.navigate(['./login']);
            },
            err => {
                if (err.http) {
                    this.onError.emit(err.http);
                } else {
                    this.errMsg = err.user;
                }
            });
    }
}