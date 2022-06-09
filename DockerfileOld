# pull official base image
FROM node:13.12.0-alpine

# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install app dependencies
COPY package.json ./
COPY package-lock.json ./
RUN npm install --silent
RUN npm install react-scripts@3.4.1 -g --silent

# add app
COPY . ./

RUN addgroup -S pmdagroup && adduser -S pmdauser -G pmdagroup -u 1001
RUN apk update

RUN chown -R node:node /app/node_modules

USER pmdauser

EXPOSE 3000

# start app
CMD ["npm", "start"]
