const fs = require('fs');
const dotenv = require('dotenv');

const writeFile = fs.writeFile;

//read environmen variables
dotenv.config({
    path: 'src/environments/.env'
});

// Configure Angular `environment.ts` file path
const targetPath = './src/environments/environment.ts';
const targetPathProd = './src/environments/environment.prod.ts';
const envConfigFile = `export const environment = {
    production: false,
    backendApiBaseURL: '${process.env['API_URL']}',
    firebase : {
      apiKey: "${process.env['apiKey']}",
      authDomain: "${process.env['authDomain']}",
      projectId: "${process.env['projectId']}",
      storageBucket: "${process.env['storageBucket']}",
      messagingSenderId: "${process.env['messagingSenderId']}",
      appId: "${process.env['appId']}",
    },
    TEST_EMAIL: '${process.env['TEST_EMAIL']}',
    TEST_PASSWORD: '${process.env['TEST_PASSWORD']}',
    s3 : {
      accessKeyId: "${process.env['AWS_S3_ACCESS_KEY_ID']}",
      secretAccessKey: "${process.env['AWS_S3_SECRET_ACCESS_KEY']}",
      region: "${process.env['AWS_S3_REGION']}",
      bucket: "${process.env['AWS_S3_BUCKET_NAME']}"
    }
  };
`;

console.log(`The file ${targetPath} will be written with the following content: \n`);
console.log(envConfigFile);

writeFile(targetPath, envConfigFile, function (err: any) {
  if (err) {
    throw console.error(err);
  } else {
    console.log(`Angular environment.ts file generated correctly at ${targetPath} \n`);
  }
});

const envProdConfigFile = `export const environment = {
    production: true,
    backendApiBaseURL: '${process.env['API_URL']}',
    firebase : {
      apiKey: "${process.env['apiKey']}",
      authDomain: "${process.env['authDomain']}",
      projectId: "${process.env['projectId']}",
      storageBucket: "${process.env['storageBucket']}",
      messagingSenderId: "${process.env['messagingSenderId']}",
      appId: "${process.env['appId']}"
    },
    TEST_EMAIL: '${process.env['TEST_EMAIL']}',
    TEST_PASSWORD: '${process.env['TEST_PASSWORD']}',
    s3 : {
      accessKeyId: "${process.env['AWS_S3_ACCESS_KEY_ID']}",
      secretAccessKey: "${process.env['AWS_S3_SECRET_ACCESS_KEY']}",
      region: "${process.env['AWS_S3_REGION']}",
      bucket: "${process.env['AWS_S3_BUCKET_NAME']}"
    }
  };
`;

console.log(`The file ${targetPathProd} will be written with the following content: \n`);
console.log(envProdConfigFile);

writeFile(targetPathProd, envProdConfigFile, function (err: any) {
  if (err) {
    throw console.error(err);
  } else {
    console.log(`Angular environment.prod.ts file generated correctly at ${targetPathProd} \n`);
  }
});