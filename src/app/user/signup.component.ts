import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { UserService } from './user.service';

@Component({
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.css']
})

export class SignupComponent {

    signupForm: FormGroup;
    error: boolean = false;
    errMsg: string;
    httpErr: string;
    formErrors: any = {
        username: '',
        email: '',
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
        email: {
            'required': 'Email is required.',
            'email': 'Invalid email.'
        },
        password: {
            'required': 'Password is required.',
            'minlength': 'Password must be at least 6 characters long.',
            'maxlength': 'Password cannot be more than 20 characters.'
        },
        confirmPassword: {
            'required': 'Password is required.',
            'minlength': 'Password must be at least 6 characters long.',
            'maxlength': 'Password cannot be more than 20 characters.'
        }
    };

    constructor(private fb: FormBuilder, private router: Router, private userService: UserService) {
        this.createForm();
        this.signupForm.valueChanges.subscribe(() => this.onValueChanges());
    }

    createForm() {
        this.signupForm = this.fb.group({
            username: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(10), Validators.pattern(/^[\w]+$/)])],
            email: ['', Validators.compose([Validators.required, Validators.email])],
            password: ['', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(20)])],
            confirmPassword: ['', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(20)])]
        });
    }

    onValueChanges() {
        if (!this.signupForm) { return; }
        const form = this.signupForm;
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
        let email = formData.email;
        let password = formData.password;
        let confirmPassword = formData.confirmPassword;
        if (this.isLoggedIn()) {
            this.errMsg = 'You are already logged in';
            return;
        }
        if (this.error) {
            this.errMsg = 'Please correct reported errors before submitting.';
            return;
        }
        if (password !== confirmPassword) {
            this.errMsg = 'Password doesn\'t match, cannot confirm the password.';
            return;
        }
        this.userService.signup(username, email, password)
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