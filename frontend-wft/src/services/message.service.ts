import http from "../http-common";

class MessageService {
    private static instance: MessageService;

    postMessage(message: string)
    {
        return http.post("/messages", {
            "content": message
        });
    }

    getMessages() {
        return http.get("/messages");
    }

    public static getInstance(): MessageService {
        if (this.instance === null || this.instance === undefined) {
            this.instance = new MessageService();
        }

        return this.instance;
    }
}

export default MessageService.getInstance();