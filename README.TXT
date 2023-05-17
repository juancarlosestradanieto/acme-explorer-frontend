# AcmeExplorerFrontend
 EXAMEN DE MANUEL GARCÍA ROMERO

 USUARIO UTILIZADO PARA MANAGER : manager@elplan.es
 CONTRASEÑA: 1234567890

 Se han modificado varios archivos: all-trips (TS y HTML), pre-cancel(TS y HTML), además de la configuración i18n

Para el subrayado en amarillo solo se pinta la columna de startDate. Si los viajes tienen una fecha de startDate superior a 7 días
a la actual, no se subraya. Si tienen uno menor a 7 días, aunque haya concluido, sí estarían subrayados.

Por lógica de negocio se pueden cancelar ciertos viajes, como aquellos que están próximos a la fecha o ya han pasado de la actual.
EN ese caso consola devuelve un 403 forbidden.









## 1. Environment Variables

Copy the environment variables file.

```
cd src/environments
cp .env.example .env
```

Indicate in this the firebase credentials.

```
.
.
.
apiKey=""
authDomain=""
projectId=""
storageBucket=""
messagingSenderId=""
appId=""
.
.
.
```

Indicate the test email and password.

```
.
.
.
TEST_EMAIL=""
TEST_PASSWORD=""
.
.
.
```

# Important: this user and password must be registerd in the system because some tests require them.

## 2. Install dependencies

```
npm install
```

## 3. Install global dependency

It is needed to regenerate the environment variable files.

```
npm install --g ts-node
```

## 4. Start the backend

Go to the backend deployment documentation [here](https://github.com/juancarlosestradanieto/acme-explorer-backend/tree/main/docker).

## 5. Start the JSON server with the mockup of the favourite lists synchronisation

Json server is now part of the backend services, so there is no need to start it anymore.

It can be accessed in the same backend url at port 3000.

## 6. Start the application

```
npm start
```

## 7. Run the tests

```
npm run test
```
