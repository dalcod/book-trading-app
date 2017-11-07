import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { UserService } from './user.service';

@Component({
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})

export class LoginComponent {

    loginForm: FormGroup;
    error: boolean = false;
    httpErr: string;
    errMsg: string;
    formErrors: any = {
        username: '',
        password: '',
        confirmPassword: ''
    };
    validationMessages: any = {
        username: {
            'required': 'Username is required.',
            'minlength': 'Username must be at least 3 characters long.',
            'maxlength': 'Username cannot be more than 10 characters.',
            'pattern': 'Username can contain only letters, numbers or underscores.'
        },
        password: {
            'required': 'Password is required.',
            'minlength': 'Password must be at least 6 characters long.',
            'maxlength': 'Password cannot be more than 20 characters.'
        }
    };

    constructor(private fb: FormBuilder, private router: Router, private userService: UserService) {
        this.createForm();
    }

    createForm() {
        this.loginForm = this.fb.group({
            username: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(10), Validators.pattern(/^[\w]+$/)])],
            password: ['', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(20)])]
        });
        this.loginForm.valueChanges.subscribe(() => this.onValueChanges());
    }
    
    isPasswordChanged(): string {
        return this.userService.isPasswordChanged();
    }

    onValueChanges() {
        if (!this.loginForm) { return; }
        const form = this.loginForm;
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
    
    public isLoggedIn(): boolean {
        return this.userService.isLoggedIn();
    }

    onSubmit(formData: any) {
        let username = formData.username;
        let password = formData.password;
        // fare attenzione a questa condizione il cui compito è di impedire ad untente loggato di effettuare nuovamente il login. Una condizione che mi sono dimenticato di includere negli specifici componenti login delle precedenti applicazioni.
        if (this.isLoggedIn()) {
            this.errMsg = 'You are already logged in';
            return;
        }
        if (this.error) {
            this.errMsg = 'Please correct reported errors before submitting.';
            return;
        }
        this.userService.login(username, password)
            .then(
            res => {
                localStorage.setItem('username', username);
                this.router.navigate(['/mybooks']);
            },
            err => {
                if (err.http) {
                    this.httpErr = err.http;
                } else {
                    this.errMsg = err.user;
                }
            }
        );
    }
}