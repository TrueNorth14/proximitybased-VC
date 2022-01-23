import React, { useState } from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Box,
    IconButton,
    withStyles
} from '@material-ui/core';
import Brightness4OutlinedIcon from '@material-ui/icons/Brightness4Outlined';

const MyAppBar = ({ ...props }) => {
    const { themeHandler } = props;
    return (
        <AppBar >
            <Toolbar>
                <Typography variant="h5">
                    <Box fontWeight="fontWeightLight">
                        Suscord
                    </Box>
                </Typography>
                {/* <div>
                    <IconButton color={"white"} onClick={() => themeHandler()}>
                        <Brightness4OutlinedIcon style={{ fill: "white" }} />
                    </IconButton>
                </div> */}
            </Toolbar>
        </AppBar>
    )
}

export default MyAppBar;
