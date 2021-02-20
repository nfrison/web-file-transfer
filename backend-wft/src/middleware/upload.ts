import util from "util";
import multer from "multer";

const maxSize = 2 * 1024 * 1024 * 1024;

let storage = multer.diskStorage({
    destination: (req: any, file: Express.Multer.File, cb: any) => {
        cb(null, process.env.UPLOAD_DIR);
    },
    filename: (req: any, file: Express.Multer.File, cb: any) => {
        console.log(file.originalname);
        cb(null, file.originalname);
    },
});
  
let uploadFile = multer({
    storage: storage,
    limits: { fileSize: maxSize },
}).single("file");
 
let uploadFileMiddleware = util.promisify(uploadFile);
export default uploadFileMiddleware;