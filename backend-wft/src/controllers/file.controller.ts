import uploadFile from "../middleware/upload";
import fs, { PathLike } from "fs";
import { Request, Response } from "express";
import { Server } from "socket.io";
import FileService from "../services/file.service";
import File from "../models/file.model";

class FileController
{
  private static uploadFileDuration = Number.parseInt(process.env.UPLOAD_FILE_DURATION ?? "-1");

  private fileService: FileService = FileService.getInstance();
  private io: Server;

  constructor(io: Server)
  {
    this.io = io;
  }

  public upload = async (req: Request, res: Response) => {
    try {
      await uploadFile(req, res);
  
      if (req.file == undefined) {
        return res.status(400).send({ message: "Please upload a file!" });
      }
  
      res.status(200).send({
        message: "Uploaded the file successfully: " + req.file.originalname,
      });

      this.io.emit("filesUpdate", this.fileService.readAll());
  
      if (FileController  .uploadFileDuration > -1) {
        new Promise(() => {
          const that = this;
          setTimeout(function() {
            // remove file
            try {
              const filename = process.env.UPLOAD_DIR + req.file.originalname;
              fs.unlinkSync(filename);
  
              console.log(`Deleted file: ${filename}`);

              that.io.emit("filesUpdate", that.fileService.readAll());
            } catch (err) {
              if (err) {
                console.error(err);
                return;
              }
            }
  
          }, FileController.uploadFileDuration);
        });
      }
    } catch (err) {
      res.status(500).send({
        message: `Could not upload the file: ${req.file.originalname}. ${err}`,
      });
    }
  };

  public getListFiles = (req: Request, res: Response) => {
    const files = this.fileService.readAll();

    if (files instanceof Error) 
    {
      res.status(500).send({
        message: "Unable to scan files!",
      });
    }
    else
    {
      res.status(200).send(files);
    }
  };

  public download = (req: Request, res: Response) => {
    const directoryPath = process.env.UPLOAD_DIR;
    const fileName = req.params.name;
  
    const file = this.fileService.readByName(fileName);
    if (file instanceof File)
    {
      res.download(directoryPath + fileName, fileName, (err) => {
        if (err) {
          res.status(500).send({
            message: "Could not download the file. " + err,
          });
        }
      });
    }
    else
    {
      res.status(500).send({
        message: "Could not download the file. " + file,
      });
    }
  };
}

export default FileController;
