import React from 'react';
import { Typography, withStyles, Box, IconButton } from '@material-ui/core';
import { ExitToApp } from '@material-ui/icons';

import chatRoomStyle from '../../assets/styles/chatroomStyle';

const ChatRoomHeader = ({ name, ...props }) => {
    const { classes, enterHandler } = props;

    return (
        <div className={classes.header}>
            <div className={classes.headerContent}>
                <Typography variant="h5">
                    <Box fontWeight="fontWeightLight">
                        Welcome {name}
                    </Box>
                </Typography>

                <IconButton style={{ display: "inline-block", right: "0px", float: "left" }} onClick={() => enterHandler()}>
                    <ExitToApp />
                </IconButton>
            </div>
        </div>
    )
}

export default withStyles(chatRoomStyle)(ChatRoomHeader);