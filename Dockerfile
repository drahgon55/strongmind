FROM mongo:6
WORKDIR /app
COPY ./config.json ./config.json
COPY ./package.json ./package.json
COPY ./package-lock.json ./package-lock.json
COPY ./lib ./lib
COPY ./bootstrap.js ./bootstrap.js
COPY ./toppings.json ./toppings.json
COPY ./pizzas.json ./pizzas.json
COPY ./web/public ./web/public
COPY ./web/src ./web/src
COPY ./web/package.json ./web/package.json
COPY ./web/package-lock.json ./web/package-lock.json
COPY ./start.sh ./start.sh
COPY ./index.js ./index.js

# RUN docker-entrypoint.sh mongod &

RUN ls /usr/local/bin
RUN apt-get update&& apt-get install -y curl
# RUN mongosh
RUN curl -fsSL https://deb.nodesource.com/setup_16.x | bash -
RUN apt-get install nodejs
# RUN npm install&&npm run bootstrap&&npm run build
EXPOSE $PORT
EXPOSE 8080
CMD ["sh","start.sh"]