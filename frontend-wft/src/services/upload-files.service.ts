import http from "../http-common";

class UploadFileService {
    private static instance: UploadFileService;

    upload(file: any, onUploadProgress: any) {
        let formData = new FormData();

        formData.append("file", file);

        return http.post("/upload", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
            onUploadProgress,
        });
    }

    getFiles() {
        return http.get("/files");
    }

    public static getInstance(): UploadFileService {
        if (this.instance === null || this.instance === undefined) {
            this.instance = new UploadFileService();
        }

        return this.instance;
    }
}

export default UploadFileService.getInstance();