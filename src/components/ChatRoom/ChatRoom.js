import React, { useEffect, useState } from 'react';
import { Paper, withStyles, Divider, TextField, Card } from '@material-ui/core';
import ChatRoomHeader from './ChatRoomHeader';
import chatRoomStyle from '../../assets/styles/chatroomStyle';
import ChatLog from './ChatLog';
import ChatInput from './ChatInput';
import Canvas from '../VoiceChatRoom/Canvas';
import io from 'socket.io-client';

let url = "http://localhost:5000";
let socket = io.connect(url);

const ChatRoom = ({ name, ...props }) => {
    const { classes, enterHandler } = props;

    const [messageList, setMessageList] = useState([]);
    const [currentMessage, setCurrentMessage] = useState("");

    useEffect(() => {
        getMessages();
    }, [messageList.length]);

    const onChange = (e) => {
        setCurrentMessage(e.target.value);
        console.log(currentMessage);
    }

    const sendMessage = (e) => {
        console.log(e);

        if (currentMessage !== '') {
            socket.emit("message", { 'name': name, 'message': currentMessage });
            setCurrentMessage('');
        }

    }

    const getMessages = () => {
        socket.on("message", msg => {
            console.log("Got message")
            setMessageList([...messageList, msg])
            console.log(messageList)
        })
    }

    const onEnter = () => {
        console.log(`Clicked enter with message ${currentMessage}`);
        sendMessage();
    }

    return (
        <>
            <div className={classes.root}>
                {/* <Card elevation={15} className={classes.container}>
                    <ChatRoomHeader name={name} enterHandler={enterHandler} />
                    <Canvas />
                </Card> */}
                <Paper elevation={8} className={classes.container}>
                    <Divider />
                    <ChatLog messages={messageList} />
                    <div className={classes.input}>
                        <TextField
                            value={currentMessage}
                            onChange={e => onChange(e)}
                            placeholder="Say something"
                            variant="filled"
                            style={{ width: "100%" }}
                            onKeyPress={(ev) => {
                                if (ev.key == 'Enter')
                                    onEnter()
                            }}
                        />
                    </div>
                </Paper>
            </div>
        </>
    )
}

export default withStyles(chatRoomStyle)(ChatRoom);
