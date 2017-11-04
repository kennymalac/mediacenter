from channels.routing import route, route_class, include
from .consumers import Demultiplexer

chat_routing = [
    route_class(Demultiplexer, path=r"^(?P<room>[a-zA-Z0-9_]+)/$"),
]

routing = [
    # You can use a string import path as the first argument as well.
    include(chat_routing, path=r"^/chat/")
]
