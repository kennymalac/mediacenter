import { WebSocketBridge } from 'django-channels'

const webSocketBridge = new WebSocketBridge()

const RTCconfig = {
    'iceServers': [
        {'url': 'stun:stun.services.mozilla.com'} // ,
    ]
}

const WSconfig = {
    // TODO environment variable
    baseUrl: "localhost:8000/chat/"
}

function connectToChatRoom(roomId) {
    webSocketBridge.connect(WSconfig.baseUrl + roomId)
    webSocketBridge.listen(function(action, stream) {
        console.log(action, stream)
    })
}

class RTCConnectionPool {
    constructor() {
        this.peerConnections = Map()
    }

    prepare(peer) {
        let conn = new RTCPeerConnection(RTCconfig)
        this.peerConnections[Symbol(peer.id)] = conn
        return conn
    }

    clear() {
        // Close the connections here
        this.peerConnections.empty()
    }
}

export {RTCconfig, connectToChatRoom, RTCConnectionPool}
