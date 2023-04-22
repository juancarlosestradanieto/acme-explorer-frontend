# AcmeExplorerFrontend

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

```
npm run fake-backend
```

## 6. Start the application

```
npm start
```

## 7. Run the tests

```
npm run test
```
