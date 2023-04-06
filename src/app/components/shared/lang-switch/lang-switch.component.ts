import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-lang-switch',
  templateUrl: './lang-switch.component.html',
  styleUrls: ['./lang-switch.component.scss']
})
export class LangSwitchComponent  {

  
  constructor( private translate: TranslateService) { 

  }

  changeEN(){
    this.translate.use('en');
  }

  changeES(){
    this.translate.use('es');
  }
}
