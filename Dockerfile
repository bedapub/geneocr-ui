# pull official base image
FROM node:13.12.0-alpine

# set working directory
WORKDIR /app

RUN addgroup -g 1001 pmdagroup && \
    adduser -g pmdagroup -u 1001 pmdauser

USER pmdauser

USER root

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install app dependencies
COPY package.json ./
COPY package-lock.json ./
RUN npm install --silent
RUN npm install react-scripts@3.4.1 -g --silent

# add app
COPY . ./

RUN yum-config-manager --enable epel && yum update -y && yum -y install shadow-utils.x86_64 xmlstarlet saxon augeas bsdtar unzip && yum clean all



EXPOSE 3000

# start app
CMD ["npm", "start"]
