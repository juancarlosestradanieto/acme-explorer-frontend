FROM debian:bullseye

#actualizar paquetes
RUN apt-get update

#instalar curl
RUN apt-get install -y curl

#descargar el instalador de node
RUN curl -sL https://deb.nodesource.com/setup_14.x | bash -

#instalar node y otras librerías sugeridas por el instalador

## Run `apt-get install -y nodejs` to install Node.js 19.x and npm
RUN apt-get install -y nodejs
## You may also need development tools to build native addons:
RUN apt-get install -y gcc g++ make
## To install the Yarn package manager, run:
RUN curl -sL https://dl.yarnpkg.com/debian/pubkey.gpg | gpg --dearmor | tee /usr/share/keyrings/yarnkey.gpg >/dev/null
RUN echo "deb [signed-by=/usr/share/keyrings/yarnkey.gpg] https://dl.yarnpkg.com/debian stable main" | tee /etc/apt/sources.list.d/yarn.list
RUN apt-get install -y yarn

#instalar la cli de angular
RUN npm install -g @angular/cli

#el comando anterior sugirió actualizar la versión de npm
##New minor version of npm available! 9.5.0 -> 9.6.1
RUN npm install -g npm@9.6.1

#instalar ts-node para ejecutar el archivo que crea las variables de entorno
RUN npm install -g ts-node

#instalar nano
RUN apt install -y nano

#instalar ping
RUN apt install -y iputils-ping

#instalar apache para servir la aplicación
RUN apt install -y apache2 
RUN apt install -y apache2-utils 
RUN apt clean
RUN a2enmod rewrite
EXPOSE 80

#install google chrome for tests
RUN apt-get install -y wget
RUN wget -q https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
RUN apt-get install -y ./google-chrome-stable_current_amd64.deb

#set working directory
WORKDIR /var/www/html

CMD ["apache2ctl", "-D", "FOREGROUND"]