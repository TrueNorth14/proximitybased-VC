import React from 'react';
import { TextField, withStyles } from '@material-ui/core';
import chatRoomStyle from '../../assets/styles/chatroomStyle';

const ChatInput = ({...props}) => {
    const {classes} = props;

    return (
        <div className={classes.input}>
            <TextField placeholder="Say something" variant="filled" style={{width: "100%"}} />
        </div>
    )
}

export default withStyles(chatRoomStyle)(ChatInput);
