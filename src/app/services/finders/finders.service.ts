import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Finder } from 'src/app/models/finder/finder.model';
import { SystemParametersService } from '../system-parameters.service';

export interface FinderConfig {
  maxFinderResults: number;
  cacheHour: number;
}

@Injectable({
  providedIn: 'root'
})
export class FindersService {

  constructor(
    private http: HttpClient, 
    private systemParametersService: SystemParametersService
  ) 
  { 

  }

  createFinder(finder: any) {

    const idToken = localStorage.getItem('idToken') ?? '';
    const httpOptions = {
      headers: new HttpHeaders({ 
        'Content-Type': 'application/json',
        'Accept-Language': 'es',
        'idToken': idToken 
      }),
    };

    const url = `${environment.backendApiBaseURL + '/finder'}`;

    return new Promise<any>((resolve, reject) => {

      const body = JSON.stringify(finder);

      this.http.post<any>(url, body, httpOptions).subscribe({
        next: (response) => {
          console.log('FindersService->createFinder post next response', response);
          resolve(response);
        },
        error: (error) => {
          console.error('FindersService->createFinder post error: ', error);
          reject(error);
        }
      });
      
    });

  }

  getSingleFinder(explorer_Id: string)
  {

    const idToken = localStorage.getItem('idToken') ?? '';
    const httpOptions : Object = {
      headers: new HttpHeaders({ 
        'Content-Type': 'application/json',
        'Accept-Language': 'es',
        'idToken': idToken 
      }),
      observe: "response",
    };

    const url = `${environment.backendApiBaseURL + '/finder/explorer/'+explorer_Id}`;

    return new Promise<any>((resolve, reject) => {

      this.http.get<any>(url, httpOptions).subscribe({
        next: (response) => {
  
          console.log('FindersService->getSingleFinder get next response', response);
          resolve(response);
  
        },
        error: (error) => {
  
          console.error('FindersService->getSingleFinder get error', error);
          reject(error);
  
        }
      });
    
    });

  }

  setFinderConfig(finderConfig: FinderConfig)
  {
    localStorage.setItem("finderConfig", JSON.stringify(finderConfig));
  }

  getFinderConfig()
  {
    return new Promise<FinderConfig>((resolve, reject) => {

      let defaultMaxFinderResults = 10;
      let defaultCacheHour = 1;
      let defaultFinderConfig: FinderConfig = {
        maxFinderResults: defaultMaxFinderResults,
        cacheHour: defaultCacheHour
      };

      let finderConfigLocallyStoredString = localStorage.getItem("finderConfig");
      //console.log("finderConfigLocallyStoredString ", finderConfigLocallyStoredString);
      
      let getGlobalSystemParameters = true;

      if(finderConfigLocallyStoredString != null)
      {
        let finderConfigLocallyStored = JSON.parse(finderConfigLocallyStoredString);
        if(finderConfigLocallyStored.hasOwnProperty('maxFinderResults') && finderConfigLocallyStored.hasOwnProperty('cacheHour')) 
        {
          let maxFinderResultsLocallyStored = finderConfigLocallyStored.maxFinderResults;
          let cacheHourLocallyStored = finderConfigLocallyStored.cacheHour;

          if(!isNaN(maxFinderResultsLocallyStored) && !isNaN(cacheHourLocallyStored))
          {
            getGlobalSystemParameters = false;

            let finderConfig: FinderConfig = {
              maxFinderResults: maxFinderResultsLocallyStored,
              cacheHour: cacheHourLocallyStored
            };
            resolve(finderConfig);
          }
        }
      }

      if(getGlobalSystemParameters == true)
      {
        this.systemParametersService.getSystemParameters()
        .then((response) => {
          console.log("FindersService->getFinderConfig->systemParametersService->getGlobalSystemParameters then response ", response);
          if(response.hasOwnProperty('systemParameters')) 
          {
            //console.log("SI hay configurado systemParameters");
            let finderConfig: FinderConfig = {
              maxFinderResults: response.systemParameters.maxFinderResults,
              cacheHour: response.systemParameters.cacheHour
            };
            resolve(finderConfig);
          }
          else
          {
            //console.log("NO hay configurado systemParameters, se toman valores por defecto");
            resolve(defaultFinderConfig);
          }
        })
        .catch((error) => {
          console.error("FindersService->getFinderConfig->systemParametersService->getGlobalSystemParameters catch ", error);
          //console.log("NO pudo consultar systemParameters, se toman valores por defecto");
          resolve(defaultFinderConfig);
        });
      }

    });
    
  }
}
