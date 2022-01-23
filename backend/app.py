import time
from typing import NoReturn
from  flask import Flask, request
from flask_socketio import SocketIO, send, emit

app = Flask(__name__)

socketIo = SocketIO(app, cors_allowed_origins="*")

app.debug = True

app.host = 'localhost'

sid_dict = {}
users = [] # global list of sids

@socketIo.on('room update')
def handleRoomConnection(msg):
    sid_dict[request.sid] = msg
    emit('room update', msg, broadcast=True)
    print(f'{request.sid} {msg}')

    # emit('room returned', msg)
    return None

@socketIo.on('new user')
def handleRoomConnection(msg):
    msg['sid'] = request.sid
    sid_dict[request.sid] = msg
    print("NEW USER")
    emit('user set', sid_dict, broadcast=True)
    return None

@socketIo.on('test')
def test(data):
    emit('test', 'custom test message')
    return None


@socketIo.on('joined room')
def joined(data):
    '''
    This function should add the user to the list and emit the list back to the frontend
    '''

    print('entered joined room')
    # Send the list back to the frontend
    if request.sid not in users:
        users.append(request.sid)

    returned_users = []
    for user in users:
        if user != request.sid:
            returned_users.append(user)

    emit('user list', returned_users)

    # Add user to the list here vv

    # print(users)
    # print(payload)


@socketIo.on('new signal')
def handleNewSignal(data):
    '''
    The new member of the room will send their signal to the server once the peer stuff has been setup.
    
    We have to send this signal to everyone connected so that the users can establish an audio channel together.

    Use the endpoint 'new user' to emit the signal to all connected users
    '''

    print('entered new signal')
    print(data['signal'])

    # iter through all users and send signal unless it is the user who sent the message in the first place
    # for user in users:
        # if user != request.sid:
    emit('new user audio', {'signal' : data['signal'], 'from' : data['from']}, room=data['to'])


@socketIo.on('returned signal')
def handleReturnedSignal(data):
    '''
    The people who are already in the room need to send their signals to the new user.
    
    Use the endpoint 'handle user signal' to send the signal to the new user
    '''
    print('entered returned signal')
    print(f'{data["signal"]} signal to: {data["to"]}')
    # send data to most recent user to join which should be the most recently appended
    emit('handle user signal', {'from': data['from'], 'signal': data['signal']}, room=data['to'])

@socketIo.on('updated distance')
def handleUpdatedDistance(data):
    # print(data)

    one_guy = data['sid']
    another_guy = data['from']

    emit('updated distance', data, room=one_guy)
    emit('updated distance', data, room=another_guy)


# ------------------------------------------- #

@socketIo.on('connect')
def connection():
    print(f'id {request.sid}')
    send("HELLO")
    print("connected")


@socketIo.on('disconnect')
def disconnected():
    users.remove(request.sid)
    del sid_dict[request.sid]
    emit('user disconnect', request.sid, broadcast=True)
    print('disconnected')


@socketIo.on_error_default
def error_handler(e):
    print(e)

# ------------------------------------------- #


# Test flask function to test get requests
@app.route('/time')
def get_current_time():
    return {'time': time.time()}


if __name__ == '__main__':
    socketIo.run(app)

# @socketIo.on('message')
# def handleMessage(msg):
#     print(msg)
#     send(msg, broadcast=True)
#     return None

@socketIo.on('disconnect')
def disconnected():
    print("disconnected")
    print(sid_dict[request.sid])