import React from 'react';
import { withStyles, List } from '@material-ui/core';
import chatRoomStyle from '../../assets/styles/chatroomStyle';
import ChatItem from './ChatItem';

const ChatLog = ({ ...props }) => {
    const { classes, messages } = props;

    return (
        <div className={classes.log}>
            <List>
                {
                    messages.map(item => <ChatItem name={item.name} message={item.message} />)
                }
            </List>
        </div>
    )
}

export default withStyles(chatRoomStyle)(ChatLog);