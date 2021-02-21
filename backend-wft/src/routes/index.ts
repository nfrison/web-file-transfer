import express from "express";
import { Server } from "socket.io";
import FileController from "../controllers/file.controller";
import MessageController from "../controllers/message.controller";

const router = express.Router();

let routes = (app: express.Application, io: Server) => {
  const fileController = new FileController(io);
  const messageController = new MessageController(io);

  router.post("/upload", fileController.upload);
  router.get("/files", fileController.getListFiles);
  router.get("/files/:name", fileController.download);

  router.get("/messages", messageController.getMessages);
  router.post("/messages", messageController.postMessages)

  app.use(router);
};

export default routes;
