# web-file-transfer

In order to use create a ".env" file inside the root folder, at the same level as the "docker-compose.yaml" file and put the following inside:
`BACKEND_IP=backend_ip`
where "backend_ip" is the ip of your backend server.
Then create a volume called "webfiletransfer_data" that will be used to mantain the container data.

Then run
`docker-compose up -d`
and all should work.
