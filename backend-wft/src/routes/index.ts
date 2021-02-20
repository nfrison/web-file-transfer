import express from "express";
import { Server } from "socket.io";
import FileController from "../controllers/file.controller";

const router = express.Router();

let routes = (app: express.Application, io: Server) => {
  const fileController = new FileController(io);

  router.post("/upload", fileController.upload);
  router.get("/files", fileController.getListFiles);
  router.get("/files/:name", fileController.download);

  app.use(router);
};

export default routes;
