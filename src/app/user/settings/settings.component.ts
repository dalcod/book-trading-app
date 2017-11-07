import { Component } from '@angular/core';

@Component({
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.css']
})

export class SettingsComponent {
    httpErr: string;

    // funzione che verrà utilizzata come 'ricevitore' dell'eventuale errore trasmesso dai componenti figli e setterà la relativa proprietà con quest'ultimo.
    setError(err: string) {
        this.httpErr = err;
    }
}
