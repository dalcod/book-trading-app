import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BookListComponent } from './books/book-list.component';
import { MyBooksComponent } from './books/mybooks.component';
import { LoggedInGuard } from './logged-in-guard';

const routes: Routes = [
    { path: 'home', component: BookListComponent },
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'mybooks', component: MyBooksComponent, canActivate: [LoggedInGuard] }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})

export class RoutingModule {}
