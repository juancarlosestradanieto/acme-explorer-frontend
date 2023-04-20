## Config container

Copy the environment variables file.

~~~
cd docker
cp .env.example .env
~~~

In which the app port can be specified.

~~~
FRONTEND_PORT=4200
~~~

## Build container image

~~~
cd docker
sh build-dev.sh
~~~

## Start development server

Run:

~~~
cd docker
sh watch.sh
~~~

Changes are not automatically reloaded in the browser, once a change has been made the tab must be refreshed in the browser with <code>F5</code> or <code>ctrl + r</code>.

## Access the application

Once the build is done, you should be able to access through the browser at <http://localhost:4200/>, changing <code>4200</code> to the value set in <code>FRONTEND_PORT</code>.

## Generate build for production

Run:

~~~
cd docker
sh npm-build.sh
~~~

## Test the application

~~~
ng test --browsers ChromeHeadless --no-sandbox
~~~
