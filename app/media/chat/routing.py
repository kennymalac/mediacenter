from channels.routing import route, include
from .consumers import ws_connect, ws_message, ws_disconnect, msg_consumer

chat_routing = [
    route("websocket.connect", ws_connect, path=r"^/(?P<room>[a-zA-Z0-9_]+)/$"),
    route("websocket.disconnect", ws_disconnect),
]

routing = [
    # You can use a string import path as the first argument as well.
    include(chat_routing, path=r"^/chat")
]
