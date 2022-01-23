import React, { useState } from 'react';
import {
    TextField,
    Card,
    CardMedia,
    Typography,
    CardContent,
    Box,
    Button,
    withStyles
} from '@material-ui/core';
import ChatImage from '../assets/images/chat.svg';
import loginStyle from '../assets/styles/loginStyle';

const Login = ({ states, stateFunctions, ...props }) => {
    const { classes } = props;
    const { name } = states;
    const { onChangeName, onChangeEntered } = stateFunctions;
    const [elevation, setElevation] = useState(5);

    var elevation_test = 5;

    console.log('Login Twice')


    const [enterEnabled, setEnabled] = useState(false);

    const handleChange = (val) => {
        onChangeName(val)
    }

    const handleKeyEnter = (ev) => {
        if (ev.key === 'Enter'){
            console.log("pressed enter")
            handleNavigate()
        }
    }

    const handleNavigate = () => {
        onChangeEntered(true)
    }

    const increaseElevation = () => {
        // elevation_test = 15;
        setElevation(15)
    }

    const decreaseElevation = () => {
        setElevation(5)
    }

    return (
        <div className={classes.root}>
            <Card className={classes.login} onPointerEnter={increaseElevation} onPointerLeave={decreaseElevation} elevation={elevation}>
                <CardMedia className={classes.image} component="img" image={ChatImage} />
                <CardContent style={{ alignItems: "center" }}>
                    <Typography variant="h4" align="center" >
                        <Box fontWeight="fontWeightLight">Suscord</Box>
                    </Typography>
                    <Typography variant="overline" align="center" >
                        <Box fontWeight="fontWeightLight">Voice Chat</Box>
                    </Typography>
                    <div className={classes.textField}>
                        <TextField variant="outlined" name={name} onKeyPress={handleKeyEnter} onChange={handleChange} placeholder="Enter your name" />
                    </div>
                </CardContent>
                <div className={classes.button}>
                    <Button color="primary" variant="contained" disabled={name === ""} onClick={handleNavigate} size="large"> Enter Room </Button>
                </div>
            </Card>
        </div>
    )
}

export default withStyles(loginStyle)(Login);