import { Component } from '@angular/core';
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'acme-explorer-frontend';

  constructor(private translate: TranslateService) {
    this.translate.addLangs(['es','en']), //Lista de idiomas disponibles
    this.translate.setDefaultLang('es') //Por defecto dejamos establecido el Español
    // this._translate.use('en')    USO DEL IDIOMA INGLÉS en la APP 
  }
}
