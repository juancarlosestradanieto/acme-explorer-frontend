import { Component, OnInit } from '@angular/core';
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'acme-explorer-frontend';
  
 

  constructor(private translate: TranslateService) {
    this.translate.addLangs(['es','en']), //Lista de idiomas disponibles
    this.translate.setDefaultLang('es') //Por defecto dejamos establecido el Español
    localStorage.setItem("language","es");
    // this._translate.use('en')    USO DEL IDIOMA INGLÉS en la APP 
  }
  
  ngOnInit(): void {
    console.log(this.translate.currentLang)

  }
  

}
