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

# 5. Start the application

```
npm start
```

# 6. Run the tests

```
npm run test
```
