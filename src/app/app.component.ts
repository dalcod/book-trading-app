import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { UserService } from './user/user.service';

@Component({
    selector: 'my-app',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})

export class AppComponent{
    constructor(private router: Router, private userService: UserService) {}

    //per qualche motivo usare questo sistema per visualizzare o nascondere gli elementi della navbar funziona mentre tutti gli altri no. Come ad esempio utilizzare una proprietà dell' UserService, modificata dinamicamente da altri componenti, a cui faranno riferimento le condizioni all'interno degli elementi nel template di questo componente.
    public isLoggedIn(): boolean {
        return this.userService.isLoggedIn();
    }
    
    public getUsername(): string {
        return this.userService.getUsername();
    }

    public logout(): void {
        this.userService.logout();
        this.router.navigate(['/home']);
    }
}