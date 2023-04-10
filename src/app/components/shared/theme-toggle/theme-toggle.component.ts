import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-theme-toggle',
  templateUrl: './theme-toggle.component.html',
  styleUrls: ['./theme-toggle.component.scss']
})
export class ThemeToggleComponent implements OnInit {

   //obtener Tema oscuro o claro desde el local storage 
   storedTheme:string = localStorage.getItem('')!;
  constructor() { }

  ngOnInit(): void {
    const userPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const userPrefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
  
    if (userPrefersDark) {
      localStorage.setItem('theme-color','dark');
      this.storedTheme = localStorage.getItem('theme-color')!;
      document.body.classList.add('dark-mode'); 
      
    }
    if (userPrefersLight){
      localStorage.setItem('theme-color','light');
      this.storedTheme = localStorage.getItem('theme-color')!;
      document.body.classList.remove('dark-mode')
      
    }
  }
    
    //Setear tema oscuro o claro
    setTheme(){
    
        if(this.storedTheme === 'light'){
          //toggle and update local storage to dark
          localStorage.setItem('theme-color','dark');
          this.storedTheme = localStorage.getItem('theme-color')!;
          document.body.classList.add('dark-mode')
          
        }else{
          //toggle and update local storage to light
          localStorage.setItem('theme-color','light');
          this.storedTheme = localStorage.getItem('theme-color')!;
          document.body.classList.remove('dark-mode')
        }

      }
}

