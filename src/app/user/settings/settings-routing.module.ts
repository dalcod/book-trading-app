import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SettingsComponent } from './settings.component';
import { LoggedInGuard } from '../../logged-in-guard';

const userRoutes: Routes = [
    { path: 'settings', component: SettingsComponent, canActivate: [LoggedInGuard] }
];

@NgModule({
    imports: [
        RouterModule.forChild(userRoutes)
    ],
    exports: [
        RouterModule
    ]
})

export class SettingsRoutingModule {}
