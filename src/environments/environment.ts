// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  backendApiBaseURL: 'http://localhost:3000',
  firebase : {
    apiKey: "AIzaSyAIC1TtOWMsnCbtz0K32m9F_hCeDRHNRvg",
    authDomain: "acme-explorer-da8b5.firebaseapp.com",
    projectId: "acme-explorer-da8b5",
    storageBucket: "acme-explorer-da8b5.appspot.com",
    messagingSenderId: "99197013762",
    appId: "1:99197013762:web:79e9eafface80a04abfc1b"
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
