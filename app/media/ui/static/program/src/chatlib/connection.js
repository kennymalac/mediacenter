import { WebSocketBridge } from 'django-channels'

const RTCconfig = {
    'iceServers': [
        {'url': 'stun:stun.services.mozilla.com'} // ,
    ]
}

const tempChatConfig = {
    // TODO don't hard code room
    roomId: '1'
}

const WSconfig = {
    // TODO environment variable
    baseUrl: "ws://localhost:8000/chat/"
}

class RTCConnectionPool {
    peerConnections = new Map()

    prepare(peer) {
        let conn = new RTCPeerConnection(RTCconfig)
        this.peerConnections[Symbol.for(peer.id)] = conn
        return conn
    }

    clear() {
        // Close the connections here
        this.peerConnections.empty()
    }
}

class ChatConnectionManager {
    actions = {
        visit: this.handleJoinedUser,
        answer: this.handleAddedUser
    }
    connection = null
    myConnection = null
    myPeerId = null
    connectionPool = new RTCConnectionPool()
    bridge = new WebSocketBridge()

    constructor(options) {
        const {onStreamAdded, onStreamRemoved, onPeerOfferError, onPeerReceiveError, receive} = options
        // Assign stream callbacks
        this.onStreamAdded = onStreamAdded
        this.onStreamRemoved = onStreamRemoved
        this.onPeerOfferError = onPeerOfferError
        this.onPeerReceiveError = onPeerReceiveError

        this.receive = receive

        // Connect to the WebSocket bridge
        // TODO don't hard code room

        this.bridge.connect(WSconfig.baseUrl + tempChatConfig.roomId)
        this.bridge.listen(function(action, stream) {
            // if (action in this.actions) {
            //     (this.actions[action].bind(this))(stream)
            // }
            console.log(action, stream)
        })
        console.log(this.bridge)
    }

    handleAddedUser(event) {
        const data = JSON.parse(event.data)
        const who = { id: data.pid }
        const pc = this.connectionPool.prepare(who.id)
        pc.setLocalDescription(event.sdp)
        pc.ontrack = (who) => this.peerTrackAdded
        pc.onremovestream = (who) => this.onPeerStreamRemoved
    }

    handleJoinedUser() {
        // Create offer to joined user
    }

    onMessageReceived(event) {
        if (!event || !event.candidate) return

        // Event handler for when a websocket message is received and what to parse.
        var signal = JSON.parse(event.data)
        if (signal.sdp) {
            
        }
    }

    prepareMyConnection(pid) {
        this.myConnection = this.connectionPool.prepare(pid)

        // this.myConnection.setRemoteDescription(new RTCSessionDescription(signal.sdp), this.offer)

        this.myConnection.oniceconnection = this.onIceCandidateHandler
        this.myConnection.onnegotiationneeded = this.onNegotiationNeeded

        return this.myConnection
    }

    sendNegotiation(msg, pid) {
        this.bridge.channel('offer').send({
            myId: this.myPeerId,
            targetId: pid,
            type: "chat-offer",
            sdp: this.myPeerConnection.localDescription
        })
    }

    onNegotiationNeeded() {
        
    }

    createOffer(peer) {
        const pc = this.myConnection

        pc.createOffer(this.streamOptions)
            .then((offer) => {
                return pc.setLocalDescription(offer)
                    .then(() => {
                        return pc.localDescription.toJSON()
                    })
                    .catch(this.onPeerOfferError)
            })
            .then((msg) => {
                // Send to negotiate server
                this.sendNegotiation(msg, peer.id)
            })
            .catch(this.onPeerOfferError)

        return pc
    }

    getAnswer() {
        return this.myConnection.createAnswer().then((answer) => {
            console.log("answer", answer)
            if (this.myConnection.connectionState === "connecting") {
                // dispatch an event to show a loading wheel
            }
            return this.myConnection.setLocalDescription(answer)
        })
            .then((peerConn) => {
                // this.connectionPool.peerConnections[Symbol(answer.pid)].set(Symbolpid, peerConn)
                return peerConn
            })
            .catch(this.onPeerReceiveError)
    }

    onIceCandidateHandler(event) {
        if (!event || !event.candidate) return
        this.bridge.send(JSON.stringify({ candidate: event.candidate }))
    }
}

export {RTCconfig, RTCConnectionPool, ChatConnectionManager}
