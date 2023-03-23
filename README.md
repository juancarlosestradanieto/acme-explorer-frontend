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

Indicar el correo y password de pruebas, este correo debe ser registrado antes de ejecutar los tests ya que cierto test espera que este correo esté registrado en firebase.

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

## 2. Instalar dependencias

```
npm install
```

## 3. Instalar dependencia global

Es necesaria para regenerar los archivos de variables de entorno.

```
npm install --g ts-node
```

## 4. Iniciar el backend

Inicia el json server.

```
npm run fake-backend
```

# 5. Iniciar la aplicación

```
npm start
```

# 6. ejecutar los tests

```
npm run test
```
