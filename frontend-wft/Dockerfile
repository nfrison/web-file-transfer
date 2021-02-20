FROM arm64v8/alpine
RUN apk update && \
    apk upgrade && \
    apk add npm=14.15.4-r0

COPY ./package.json /home/frontend/package.json

WORKDIR /home/frontend

RUN npm install

COPY . /home/frontend

ENV BACKEND_URL="http://backend:8080"

EXPOSE 8081

CMD ["npm", "start"]
