from datetime import datetime
from random import randrange

from channels import Channel, Group
from channels.generic.websockets import WebsocketDemultiplexer, WebsocketConsumer, JsonWebsocketConsumer
from channels.sessions import channel_session
from channels.auth import channel_session_user, channel_session_user_from_http
# from .models import ChatMessage

# TODO add chatroom messages

def getAnonymousId(ids):
    anon = randrange(-2555, 0)
    if anon in ids:
        return getAnonymousId()
    else:
        return anon

def getOrCreateIds(channel_session):
    try:
        return channel_session['ids']
    except KeyError:
        channel_session['ids'] = []
        return channel_session['ids']


class WebRTCConsumer(JsonWebsocketConsumer):
    # method_mapping = {
    #     "offer": "send_offer",
    # }
    # Set to True to automatically port users from HTTP cookies
    # (you don't need channel_session_user, this implies it)
    http_user = True
    channel_session_user = True

    # Set to True if you want it, else leave it out
    strict_ordering = False

    def send_offer(self, message, multiplexer, **kwargs):
        print('offer', message)
        multiplexer.group_send('chat-{}'.format(kwargs.get('room')), 'webrtc', message)

    def connection_groups(self, **kwargs):
        """
        Called to return the list of groups to automatically add/remove
        this connection to/from.
        """
        return ['chat-{}'.format(kwargs.get('room'))]

    def connect(self, message, multiplexer, **kwargs):
        """
        Perform things on connection start
        """
        # Save room in session and add us to the group
        #import pdb; pdb.set_trace()
        message.channel_session['room'] = kwargs.get('room')
        # TODO multiple groups
        # Accept the connection request
        message.reply_channel.send({"accept": True})
        print(datetime.now(), "Connection accepted.")


        ids = getOrCreateIds(message.channel_session)

        if message.user.is_anonymous:
            userInfo = { 'id': getAnonymousId(ids), 'username': 'guest' }
        else:
            userInfo = AccountSerializer(instance=message.user)

        message.channel_session['ids'].append(userInfo['id'])

        multiplexer.send({
            "type": 'assigned-id',
            "userInfo": userInfo
        })

        # Send offer to all clients

        multiplexer.group_send('chat-{}'.format(kwargs.get('room')), 'webrtc', {
            "type": 'user-joined',
            "userInfo": userInfo
        })

    def receive(self, content, **kwargs):
        multiplexer = kwargs.pop('multiplexer')
        self.send_offer(content, multiplexer, **kwargs)

    # def disconnect(self, message, **kwargs):
    #     """
    #     Perform things on connection close
    #     """
    #     pass
    #     #.discard(message.reply_channel)


class ChatConsumer(JsonWebsocketConsumer):

# Set to True to automatically port users from HTTP cookies
    # (you don't need channel_session_user, this implies it)
    http_user = True

    # Set to True if you want it, else leave it out
    strict_ordering = False

    # def connect(self, message, **kwargs):
    #     """
    #     Perform things on connection start
    #     """
    #     pass
    def connect(self, message, multiplexer, **kwargs):
        """
        Perform things on connection start
        """

        Group('chat-{}'.format(kwargs.get('room')), channel_layer=message.channel_layer)


    def receive(self, content, multiplexer, **kwargs):
        """
        Called when a message is received with either text or bytes
        filled out.
        """
        # Simple echo
        multiplexer.send({
            "room": message.channel_session["room"],
            "message": message["text"],
        })

    def disconnect(self, message, **kwargs):
        """
        Perform things on connection close
        """
        pass


class Demultiplexer(WebsocketDemultiplexer):

    # Wire your JSON consumers here: {stream_name : consumer}
    consumers = {
        # "chatroom": ChatRoomConsumer,
        "chat": ChatConsumer,
        "webrtc": WebRTCConsumer,
    }


# Connected to websocket.disconnect
# @channel_session
# def ws_disconnect(message):
#     getChatGroup(message).discard(message.reply_channel)


# # Connected to chat-messages
# def msg_consumer(message):
#     Save to model
#     room = message.content["room"]
#     Broadcast to listening sockets
#     getChatGroup(message).send({
#         "id": message.user.id, TODO anonymous id here
#         "text": message.content.message,
#     })
