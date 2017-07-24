from datetime import datetime
from random import randrange

from channels import Channel, Group
from channels.sessions import channel_session
from channels.auth import channel_session_user, channel_session_user_from_http
# from .models import ChatMessage

# TODO add chatroom messages


def getChatGroup(message):
    return Group("chat-{}".format(message.channel_session["room"]))

def getAnonymousId(ids):
    anon = randrange(-2555, 0)
    if anon in ids:
        return getAnonymousId()
    else:
        return anon

@channel_session_user_from_http
def ws_connect(message, room):
    # Save room in session and add us to the group
    message.channel_session["room"] = room
    getChatGroup(message).add(message.reply_channel)

    # Accept the connection request
    message.reply_channel.send({"accept": True})

    print(datetime.now(), "Connection accepted.")

    ids = message.channel_session['ids'] or []

    if message.user.is_anonymous:
        userInfo = { 'id': getAnonymousId(ids), 'username': 'guest' }

    else:
        userInfo = AccountSerializer(instance=message.user)

    message.channel_session['ids'].append(userInfo.id)

    # Send offer to all clients
    getChatGroup(message).send({
        "sdp": message.content,
        "room": message.channel_session["room"],
        "userInfo": userInfo
    })


# Connected to websocket.disconnect
@channel_session
def ws_disconnect(message):
    getChatGroup(message).discard(message.reply_channel)


# Connected to chat-messages
def msg_consumer(message):
    # Save to model
    room = message.content["room"]
    # Broadcast to listening sockets
    getChatGroup(message).send({
        "id": message.user.id, # TODO anonymous id here
        "text": message.content["message"],
    })

# @channel_session
# def ws_message(message):
#     # Stick the message onto the processing queue
#     Channel("chat-messages").send({
#         "room": message.channel_session["room"],
#         "message": message["text"],
#     })
