import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { SettingsComponent } from './settings.component';
import { ModifyAccountComponent } from './modify-account.component';
import { DeleteAccountComponent } from './delete-account.component';
import { UpdateProfileComponent } from './update-profile.component';

import { SettingsRoutingModule } from './settings-routing.module';

import { UserService } from '../user.service';
import { LoggedInGuard } from '../../logged-in-guard';

@NgModule({
    imports: [
        BrowserModule,
        ReactiveFormsModule,
        HttpModule,
        SettingsRoutingModule
    ],
    declarations: [
        SettingsComponent,
        ModifyAccountComponent,
        DeleteAccountComponent,
        UpdateProfileComponent
    ],
    providers: [ UserService, LoggedInGuard ]
})

export class SettingsModule {}
