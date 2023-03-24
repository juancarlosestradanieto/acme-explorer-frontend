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

Indicar el correo y password de pruebas.

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
# IMPORTANTE: 
Este usuario debe ser registrado en AcmeExplorerFrontend **ANTES** de ejecutar los tests ya que ciertos tests esperan que este usuario(y el password también) esté registrado en firebase.

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
