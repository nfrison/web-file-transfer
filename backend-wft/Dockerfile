FROM arm64v8/alpine
RUN apk update && \
    apk upgrade && \
    apk add npm=14.15.4-r0

COPY ./package.json /home/backend/package.json

WORKDIR /home/backend

RUN npm install

COPY . /home/backend
RUN mkdir /home/uploadDir

EXPOSE 8080

CMD ["npm", "start"]