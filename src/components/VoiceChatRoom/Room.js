import { withStyles } from '@material-ui/styles';
import React, { useEffect, useRef, useState } from 'react';
import Canvas from './Canvas';
import ChatRoomHeader from '../ChatRoom/ChatRoomHeader';
import { BottomNavigation, Button, Card, Switch } from '@material-ui/core';
import chatRoomStyle from '../../assets/styles/chatroomStyle';
import io from 'socket.io-client';
import Peer from 'simple-peer';


const Audio = ({ ...props }) => {
    const audioRef = useRef();
    const { user, socket, peerID } = props;

    /*
     * You can control the volume of the audio component with the code below.
     *
     * audioRef.current.volume = // some number here 
     */

    //audioRef.current.volume = 0.2;
    useEffect(() => {
        console.log(`The is is ${peerID}`)

        /* Once the peer receives a stream from another user, we want to add that stream to the peer. 
         * We can do this by listening for a stream using user.on('stream', () => {})
         * This will fire a callback as soon as a stream has been received.
         * 
         * We add this stream to the audio tag so that it can be played back by the browser.
         */
        user.on('stream', stream => {
            // console.log('ADDING STREAM');
            audioRef.current.srcObject = stream;

            socket.on('updated distance', data => {
                // console.log(`THIS IS THE NEW DISTANCE DATA: ${data['distance']} ${data['name']}`);

                console.log(`sid: ${data['sid']} | from id: ${data['from']} peerID: ${peerID}`);

                // if (data['sid'] === peerID || data['from'] === peerID) {
                //     console.log(`Changing volume of ${peerID}`)
                //     var distance = data['distance'];
                //     // if (data['sid'] != socket)
                //     if (distance >= 200) {
                //         audioRef.current.volume = 0.0;
                //     } else {
                //         audioRef.current.volume = 0.5;
                //     }
                // }

                console.log(`THIS IS THE NEW DISTANCE DATA: ${data['distance']} ${data['name']}`);



                // if (data['sid'] != socket)
                
                //Volume will stay the same 50 units radius around a user.
                
                if (data['sid'] === peerID || data['from'] === peerID) {
                    var distance = data['distance'];
                    var newVolume = 1 - .005 * (distance - 100);
                    if (newVolume > 0 && newVolume < 1) {
                        audioRef.current.volume = newVolume;
                    }
                    else if (newVolume >= 1) {
                        audioRef.current.volume = 1;
                    }
                    else {
                        audioRef.current.volume = 0;
                    }
                }

            })

        })

    }, []);

    return (
        <audio playsInline autoPlay ref={audioRef} />
    );
}

const Room = ({ name, ...props }) => {
    const { classes, enterHandler } = props;
    const socket = useRef();
    const [peers, setPeers] = useState([]); /* Initialize a list of peer objects. This will contain a Peer object for everyone in the room. */
    const [broadcastState, setBroadcast] = useState(false);
    const [proximityState, setProximity] = useState(true);

    /* List of users where each entry is {id: socket id, peer: Peer Object}. We will use this list to be able to map the peer object to a member in the room. */
    const peersRef = useRef([]);


    /* The callback in useEffect is the first thing that React will call.
    * Think of it as an initializer.
    */
    useEffect(() => {
        // console.log('use effect called')

        socket.current = io("http://localhost:5000");
        // socket.current = io("https://suscord-backend.ue.r.appspot.com", {transports: ['polling', 'flashsocket']}); /* Use for production */

        navigator.mediaDevices.getUserMedia({ audio: true, video: false }).then(stream => {
            // console.log('Arrived')

            socket.current.emit('joined room', 'hello I have joined the room'); // use this emit function to let the server know that you have joined the room.

            /* After user has joined the room. The server should return a list of user ids.*/
            socket.current.on("user list", users => {
                /*
                 * Loop through all entries of data (this will be the dictionary of ever user joined)
                 * 
                 * Create a peer object using the audioStream.
                 * 
                 * const currentPeer = new Peer({
                 *  initiator: true, 
                 *  trickle: false,
                 *  audioStream
                 * })
                 * 
                 * Setting initializer to true means that the Peer object will send a signal when it has been created
                 * Setting it to false means that the Peer object will receive a signal when it has been created.
                 * 
                 * After creating the Peer object, we need to send the signal to our server so that it can be sent to everyone else.
                 * 
                 * Use the endpoint 'new signal' to send the new user's signal to the server.
                 * 
                 * currentPeer.on('signal', signal => {})
                 */

                const peers = [];
                users.forEach(userID => {

                    const peer = new Peer({
                        initiator: true,
                        trickle: false,
                        stream,
                    });

                    peer.on("signal", signal => {
                        socket.current.emit("new signal", { 'to': userID, 'from': socket.current.id, 'signal': signal })
                    })

                    peersRef.current.push({
                        peerID: userID,
                        peer,
                    })
                    peers.push({ 'peerID': userID, 'peer': peer });
                })
                setPeers(peers);
            })

            socket.current.on("new user audio", payload => {
                /*
                 * People who are already in the room need a way to handle a new user joining the room.
                 * 
                 * Create a new Peer object and add it to the users dictionary.
                 * Use the on('signal') function of the new peer to send this client's signal to the person who joined
                 * 
                 * use the endpoint 'returned signal' to send this user's signal to the server 
                 */

                const peer = new Peer({
                    initiator: false,
                    trickle: false,
                    stream,
                })

                peer.on("signal", signal => {
                    socket.current.emit("returned signal", { 'signal': signal, 'to': payload['from'], 'from': socket.current.id })
                })

                // console.log(`Incomming signal ${payload['signal']}`)
                peer.signal(payload['signal']);


                peersRef.current.push({
                    peerID: payload['from'],
                    peer,
                })

                setPeers(users => [...users, { 'peerID': payload['from'], 'peer': peer }]);
            });

            socket.current.on("handle user signal", payload => {

                /* 
                 * Person who just joined the room will receive signals from everyone else. Handle this by adding the signal to the appropriate Peer in the users dictionary.
                 * The key for users is the sid, use that to find the right peer.
                 * 
                 * 
                 * Establish peer handshake with this command peer.signal(data.signal)
                 * 
                 */

                const item = peersRef.current.find(p => p.peerID === payload['from']);
                // console.log(`Adding peer ${JSON.stringify(payload.signal)}`)
                item.peer.signal(payload.signal);
            });
        })

    }, [])

    const handleBroadcastClicked = () => {
        const newVal = !broadcastState;
        console.log('new val broad is ' + newVal);
        setBroadcast(newVal);
    }

    const handleProximityToggle = () => {
        const newVal = !proximityState;
        console.log('new val is' + newVal);
        setProximity(newVal);
    }

    return (
        <div>
            <div className={classes.root}>
                {
                    peers.map((user, index) => {
                        return (<Audio key={index} user={user['peer']} peerID={user['peerID']} socket={socket.current} />)
                    })
                }
                {

                    socket.current &&
                    <Canvas socket={socket.current} name={name} />
                }
            </div>
            {/* <BottomNavigation className={classes.bottomBar}>
                <Button variant="contained" onClick={handleBroadcastClicked} >Broadcast</Button>
                <Switch label="Proximity" checked={proximityState} onClick={handleProximityToggle} />
            </BottomNavigation> */}
        </div>
    )
}

export default withStyles(chatRoomStyle)(Room);
