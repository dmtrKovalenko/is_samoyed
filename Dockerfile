FROM node:10

EXPOSE 8080
EXPOSE 8443
EXPOSE 443

RUN npm install -g yarn

COPY . ./app
WORKDIR ./app

RUN yarn
RUN yarn now-build

CMD ["yarn", "now-start"]