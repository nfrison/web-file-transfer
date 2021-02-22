import React, {Component, useEffect} from "react";
import UploadFileService from "../services/upload-files.service"
import LinearProgress from '@material-ui/core/LinearProgress';
import { Box, Container, Typography, Button, ListItem, withStyles } from '@material-ui/core';
import { io } from "socket.io-client";
import File from "../models/file.model";

const BorderLinearProgress = withStyles((theme) => ({
    root: {
        height: 15,
        borderRadius: 5,
    },
    colorPrimary: {
        backgroundColor: "#EEEEEE",
    },
    bar: {
        borderRadius: 5,
        backgroundColor: '#1a90ff',
    },
}))(LinearProgress);

type UploadFilesState = {
    selectedFiles: any,
    currentFile: any,
    permanent: boolean,
    progress: number,
    message: string,
    isError: boolean,
    fileInfos: Array<File>,
}

export default class UploadFiles extends Component<{}, UploadFilesState> {
    constructor(props: any) {
        super(props);

        this.state = {
            selectedFiles: undefined,
            currentFile: undefined,
	    permanent: false,
            progress: 0,
            message: "",
            isError: false,
            fileInfos: [],
        }
    }

    selectFile = (event: any) => {
        this.setState({
            selectedFiles: event.target.files,
        })
    }

    upload = () => {

        let currentFile = this.state.selectedFiles[0];
	const permanent = this.state.permanent;

        this.setState({
            progress: 0,
            currentFile: currentFile,
        });
    
        UploadFileService.upload(currentFile, permanent, (event: any) => {
            this.setState({
                progress: Math.round((100 * event.loaded) / event.total),
            });
        })
        .then((response) => {
            this.setState({
                message: response.data.message,
                isError: false
            });
            
            return UploadFileService.getFiles();
        })
        .then((files) => {
            this.setState({
                fileInfos: files.data,
            });
        })
        .catch((reason: any) => {
            console.error(reason);
            this.setState({
                progress: 0,
                message: "Could not upload the file!",
                currentFile: undefined,
                isError: true
            });
        });
    
        this.setState({
            selectedFiles: undefined,
        });
    }

    setPermanent = (event: any) => {
	this.setState({
	    permanent: event.target.checked,
	}); 
    }

    componentDidMount = () => {
        UploadFileService.getFiles().then((response) => {
            this.setState({
                fileInfos: response.data
            });
        })
        .catch((reason: any) => {
            console.error(reason);
        });

        const ENDPOINT = process.env.REACT_APP_BACKEND_URL;
        if (ENDPOINT) {
            console.log(ENDPOINT);
            const socket = io(ENDPOINT);
            socket.on("filesUpdate", (data: Array<File>) => {
                console.log(data);
                this.setState(
                    { fileInfos: data }
                );
            });
        }
    }

    render = () => {
        const {
            selectedFiles,
            currentFile,
            progress,
            message,
            fileInfos,
            isError
        } = this.state;

        return (
            <Container>
                {currentFile && (
                <Box className="mb25" display="flex" alignItems="center">
                    <Box width="100%" mr={1}>
                    <BorderLinearProgress variant="determinate" value={progress} />
                    </Box>
                    <Box minWidth={35}>
                    <Typography variant="body2" color="textSecondary">{`${progress}%`}</Typography>
                    </Box>
                </Box>)
                }

                <label htmlFor="btn-upload">
                    <input
                        id="btn-upload"
                        name="btn-upload"
                        style={{ display: 'none' }}
                        type="file"
                        onChange={this.selectFile} />
                    <Button
                        className="btn-choose"
                        variant="outlined"
                        component="span" >
                        Choose Files
                    </Button>
                </label>
                <div className="file-name">
                    {selectedFiles && selectedFiles.length > 0 ? selectedFiles[0].name : null}
                </div>
                <Button
                        className="btn-upload"
                        color="primary"
                        variant="contained"
                        component="span"
                        disabled={!selectedFiles}
                        onClick={this.upload}>
                    Upload
                </Button>
                <div>
		    <label htmlFor="permanent">Permanent</label>
		    <input id="permanent" type="checkbox" onChange={this.setPermanent} />
		</div>

                <Typography variant="subtitle2" className={`upload-message ${isError ? "error" : ""}`}>
                {message}
                </Typography>

                <Typography variant="h6" className="list-header">
                List of Files
                </Typography>
                <ul className="list-group">
                {fileInfos &&
                    fileInfos.map((file, index) => (
                    <ListItem
                        divider
                        key={index}>
                        <a href={file.url}>{file.name}</a>
                    </ListItem>
                    ))}
                </ul>
            </Container>
        );
    }
}
