import fs, { PathLike } from "fs";
import { Request, Response } from "express";
import { Server } from "socket.io";
import MessageService from "../services/message.service";
import Message from "../models/message.model";

class MessageController
{
  private static uploadFileDuration = Number.parseInt(process.env.UPLOAD_FILE_DURATION ?? "-1");

  private messageService: MessageService = MessageService.getInstance();
  private io: Server;

  constructor(io: Server)
  {
    this.io = io;
  }
  
  public getMessages = (req: Request, res: Response) => {
    const messages = this.messageService.readAll();

    if (messages instanceof Error) 
    {
      res.status(500).send({
        message: "Unable to read messages!",
      });
    }
    else
    {
      res.status(200).send(messages);
    }
  };

  public postMessages = (req: Request, res: Response) => {
    const messageContent = req.body.content;

    const message = {
        timestamp: undefined as unknown as Date,
        content: messageContent as string
    }

    const insertedMessage = this.messageService.create(message);

    if (insertedMessage instanceof Error)
    {
        res.status(500).send({
          message: "Unable to insert message!",
        });
    }
    else
    {
      this.io.emit("messagesUpdate", this.messageService.readAll());

        res.status(200).send(insertedMessage);
    }
  }
}

export default MessageController;
