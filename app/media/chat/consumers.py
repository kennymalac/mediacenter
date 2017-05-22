from datetime import datetime
from channels import Channel, Group
from channels.sessions import channel_session
# from .models import ChatMessage

# TODO add chatroom messages

@channel_session
def ws_connect(message):
    print(datetime.now(), "Connection accepted.")

    # Send offer to all clients
    Group("chat-%s" % message.channel_session["room"]).send(message.content)

# Connected to websocket.disconnect
@channel_session
def ws_disconnect(message):
    Group("chat-%s" % message.channel_session["room"]).discard(message.reply_channel)

# Connected to chat-messages
def msg_consumer(message):
    # Save to model
    room = message.content["room"]
    # Broadcast to listening sockets
    Group("chat-%s" % room).send({
        "text": message.content["message"],
    })

# Connected to websocket.connect
@channel_session
def ws_connect_msg(message):
    # Work out room name from path (ignore slashes)
    room = message.content["path"].strip("/")
    # Save room in session and add us to the group
    message.channel_session["room"] = room
    Group("chat-%s" % room).add(message.reply_channel)
    # Accept the connection request
    message.reply_channel.send({"accept": True})

# Connected to websocket.receive
@channel_session
def ws_message(message):
    # Stick the message onto the processing queue
    Channel("chat-messages").send({
        "room": message.channel_session["room"],
        "message": message["text"],
    })
