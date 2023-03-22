# AcmeExplorerFrontend

## 1. Variables de entorno

Copiar el archivo de variables de entorno.

```
cd src/environments
cp .env.example .env
```

Indicar en este las credenciales de firebase.

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
measurementId=""
.
.
.
```

## 2. Instalar dependencia global

Es necesaria para regenerar los archivos de variables de entorno.

```
npm install --g ts-node
```

## 3. Iniciar el backend

Inicia el json server.

```
npm run fake-backend
```

# 3. Iniciar la aplicación

```
npm start
```
