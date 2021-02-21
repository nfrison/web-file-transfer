import fs from "fs";
import Message from "../models/message.model";
import Service from "./service";

class MessageService implements Service<Message>
{
    private static instance: MessageService;
    private static readonly messagesJsonPath = process.env.DATA_DIR + "messages.json";

    private constructor() {}

    public static getInstance(): MessageService {
        if (!MessageService.instance)
        {
            MessageService.instance = new MessageService();

            if (!fs.existsSync(this.messagesJsonPath))
            {
                fs.writeFileSync(this.messagesJsonPath, JSON.stringify([], null, 2));
            }
        }
        return MessageService.instance;
    }

    public create = (message: Message): Message | Error => {
        const messages = this.readAll();

        if (messages instanceof Error)
        {
            return messages;
        }
        else
        {
            message.timestamp = new Date();
            messages.push(message);

            try 
            {
                fs.writeFileSync(MessageService.messagesJsonPath, JSON.stringify(messages, null, 2));

                return messages.filter(m => m === message)[0];
            }
            catch (err)
            {
                console.error(err);
                return err;
            }
        }
    }

    public readAll = (): Array<Message> | Error => {

        try 
        {
            const messagesJson = fs.readFileSync(MessageService.messagesJsonPath) + "";

            const messages = JSON.parse(messagesJson);

            return messages;
        } 
        catch (err) 
        {
            console.error(err);
            return err;
        }
    }

    public update = () => {

    }

    public delete = () => {

    }
}

export default MessageService;