import React from 'react';
import { ListItem, Typography } from '@material-ui/core';

const ChatItem = ({ name, message, time }) => {

    return (
        <ListItem>
            <Typography>
                <b> {name}: </b> {message}
            </Typography>
        </ListItem>
    )
}

export default ChatItem;