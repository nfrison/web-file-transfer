import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import Fab from '@material-ui/core/Fab';
import SendIcon from '@material-ui/icons/Send';
import { io } from "socket.io-client";
import MessageService from "../services/message.service";
import Message from "../models/message.model";
import { CssBaseline } from '@material-ui/core';
import * as CSS from "csstype";

const styles: Record<string, CSS.Properties> = {
    table: {
        minWidth: "650",
      },
      chatSection: {
        width: '100%',
        height: '80vh'
      },
      headBG: {
          backgroundColor: '#e0e0e0'
      },
      borderRight500: {
          borderRight: '1px solid #e0e0e0'
      },
      messageArea: {
        height: '70vh',
        overflowY: 'auto'
      }
    };

type ChatState = {
    currentMessage: string,
    message: string,
    isError: boolean,
    messagesList: Array<Message>,
}

export default class Chat extends React.Component<{}, ChatState> {
    constructor(props: any) {
        super(props);

        this.state = {
            currentMessage: "",
            message: "",
            isError: false,
            messagesList: [],
        }
    }

    changeMessage = (event: any) => {
        this.setState({
            currentMessage: event.target.value,
        })
    }

    sendMessage = () => {
        const message = this.state.currentMessage;
        console.log(message)

        if (message.length > 0) {
            MessageService.postMessage(message)
            .then((response) => {
                this.setState({
                    message: response.data.message,
                    isError: false
                });
                
                return MessageService.getMessages();
            })
            .then((res) => {
                console.log(this.state);
                this.setState({
                    currentMessage: "",
                    messagesList: res.data,
                });
                console.log(this.state);
            })
            .catch((reason: any) => {
                console.error(reason);
                this.setState({
                    message: "Could not send the message!",
                    isError: true
                });
            });
        }
    }

    chatsList = () => {    
        return (
            <Grid item xs={3} style={styles.borderRight500}>
                <List>
                    <ListItem button key="RemySharp">
                        <ListItemIcon>
                        <Avatar alt="Remy Sharp" src="https://material-ui.com/static/images/avatar/1.jpg" />
                        </ListItemIcon>
                        <ListItemText primary="John Wick"></ListItemText>
                    </ListItem>
                </List>
                <Divider />
                <Grid item xs={12} style={{padding: '10px'}}>
                    <TextField id="outlined-basic-email" label="Search" variant="outlined" fullWidth />
                </Grid>
                <Divider />
                <List>
                    <ListItem button key="RemySharp">
                        <ListItemIcon>
                            <Avatar alt="Remy Sharp" src="https://material-ui.com/static/images/avatar/1.jpg" />
                        </ListItemIcon>
                        <ListItemText primary="Remy Sharp">Remy Sharp</ListItemText>
                        <ListItemText secondary="online" style={{display:'flex', justifyContent:'flex-end'}}></ListItemText>
                    </ListItem>
                    <ListItem button key="Alice">
                        <ListItemIcon>
                            <Avatar alt="Alice" src="https://material-ui.com/static/images/avatar/3.jpg" />
                        </ListItemIcon>
                        <ListItemText primary="Alice">Alice</ListItemText>
                    </ListItem>
                    <ListItem button key="CindyBaker">
                        <ListItemIcon>
                            <Avatar alt="Cindy Baker" src="https://material-ui.com/static/images/avatar/2.jpg" />
                        </ListItemIcon>
                        <ListItemText primary="Cindy Baker">Cindy Baker</ListItemText>
                    </ListItem>
                </List>
            </Grid>
        );
    }
    
    chatInput = () => {
        return (
            <Grid container style={{padding: '20px'}}>
                <Grid item xs={11}>
                    <TextField id="outlined-basic-email" label="Type Something" fullWidth onChange={this.changeMessage} value={this.state.currentMessage} />
                </Grid>
                <Grid item xs={1} style={{display:'flex', justifyContent:'flex-end'}}>
                    <Fab color="primary" aria-label="add" onClick={this.sendMessage}><SendIcon /></Fab>
                </Grid>
            </Grid>
        );
    }
    
    chatContent = () => {
        const messagesList = this.state.messagesList;
    
        return (
            <List style={styles.messageArea}>
                {messagesList.map((message, index) => (
                    <ListItem key={index}>
                        <Grid container>
                            <Grid item xs={12}>
                                <ListItemText style={{display:'flex', justifyContent:'flex-start'}} primary={message.content}></ListItemText>
                            </Grid>
                            <Grid item xs={12}>
                                <ListItemText style={{display:'flex', justifyContent:'flex-start'}} secondary={message.timestamp}></ListItemText>
                            </Grid>
                        </Grid>
                    </ListItem>)
                )}
            </List>
        );
    }

    componentDidMount = () => {
        MessageService.getMessages().then((response) => {
            this.setState({
                messagesList: response.data
            });
        })
        .catch((reason: any) => {
            console.error(reason);
        });

        const ENDPOINT = process.env.REACT_APP_BACKEND_URL;
        if (ENDPOINT) {
            console.log(ENDPOINT);
            const socket = io(ENDPOINT);
            socket.on("messagesUpdate", (data: Array<Message>) => {
                console.log(data);
                this.setState(
                    { messagesList: data }
                );
            });
        }
    }
    
    render = () => {
        return (
            <div>
                <Grid container component={Paper} style={styles.chatSection}>
                    {/*
                    <ChatsList />
                    */}
                    <Grid item xs={12}>
                        <this.chatInput />
                        <Divider />
                        <this.chatContent />
                    </Grid>
                </Grid>
            </div>
        );
    }
}