import { Component, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { UserService } from '../user.service';

@Component({
    selector: 'delete-section',
    templateUrl: './delete-account.component.html',
    styleUrls: ['./delete-account.component.css']
})

export class DeleteAccountComponent {
    public delAccForm: FormGroup;
    public errMsg: string;
    public httpErr: string;
    public error: boolean;
    formErrors: any = {
        username: '',
        password: '',
        confirmPassword: ''
    };
    validationMessages: any = {
        password: {
            'required': 'Password is required'
        },
        confirmPassword: {
            'required': 'Password is required'
        }
    };

    constructor(private fb: FormBuilder,
                 private userService: UserService,
                 private router: Router) {
        this.createDelAccForm();
        this.delAccForm.valueChanges
            .subscribe(() => this.onValueChanges());
    }

    public createDelAccForm(): void {
        this.delAccForm = this.fb.group({
            password: ['', Validators.required],
            confirmPassword: ['', Validators.required]
        });
    }

    // in questa proprietà andremo ad inserire l'eventuale errore che verrà poi trasmesso all'elemento padre tramite l'emissione di un evento.
    @Output() onError = new EventEmitter<string>();

    public onValueChanges() {
        if (!this.delAccForm) { return; }
        const form = this.delAccForm;
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
            .then(
            res => {
                this.router.navigate(['/home']);
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