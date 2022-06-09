# stage1 - build react app first 
FROM node:12.16.1-alpine3.9 as build
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY ./package.json /app/
COPY ./package-lock.json /app/
COPY . /app
RUN npm build

# stage 2 - build the final image and copy the react build files
FROM nginxinc/nginx-unprivileged:stable-alpine
COPY --chown=101 --from=build /app/build /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY --chown=101 nginx/nginx.conf /etc/nginx/conf.d
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]