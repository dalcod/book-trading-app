import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { SignupComponent } from './signup.component';
import { LoginComponent } from './login.component';
import { UserRoutingModule } from './user-routing.module';
import { SettingsModule } from './settings/settings.module';

import { UserService } from './user.service';

@NgModule({
    imports: [
        BrowserModule,
        ReactiveFormsModule,
        HttpModule,
        SettingsModule,
        UserRoutingModule
    ],
    declarations: [
        SignupComponent,
        LoginComponent
    ],
    providers: [ UserService ]
})

export class UserModule {}
