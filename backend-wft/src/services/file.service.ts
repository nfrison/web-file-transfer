import fs from "fs";
import File from "../models/file.model";
import Service from "./service";

class FileService implements Service<File>
{
    private static instance: FileService;
    private static readonly directoryPath = process.env.UPLOAD_DIR + "";

    private constructor() {}

    public static getInstance(): FileService {
        if (!FileService.instance)
        {
            FileService.instance = new FileService();

            if (!fs.existsSync(this.directoryPath))
            {
                fs.mkdirSync(this.directoryPath);
            }
        }
        return FileService.instance;
    }

    public create = (file: File): File | Error => {
        return new Error("Not implemented");
    }

    public readAll = (): Array<File> | Error => {

        try 
        {
            const files = fs.readdirSync(FileService.directoryPath);

            const fileInfos = files.map((file) => {
                return {
                    name: file,
                    url: process.env.BASE_URL + "files/" + file,
                };
            });

            return fileInfos;
        } 
        catch(err) 
        {
            console.error(err);
            return err;
        }
    }

    public readByName (filename: string): File | undefined | Error
    {
        const files = this.readAll();
        
        if (files instanceof Error)
        {
            return files;
        }
        else
        {
            return files.find((f) => f.name === filename);
        }
    }

    public update = () => {

    }

    public delete = () => {

    }
}

export default FileService;