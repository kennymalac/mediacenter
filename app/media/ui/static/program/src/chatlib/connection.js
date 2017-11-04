import { WebSocketBridge } from 'django-channels'
import { handleIceCandidate } from './ice.js'

const RTCconfig = {
    iceServers: [
        {urls: ['turn:127.0.0.1'], username: 'mediacenter', credential: 'password'} // ,
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

    constructor(connectionOptions, streamOptions) {
        const {onPeerAdded, onPeerTrackAdded, onStreamRemoved, onPeerOfferError, onPeerReceiveError, createMyPeer} = connectionOptions
        this.streamOptions = streamOptions
        // Assign stream callbacks
        this.onPeerAdded = onPeerAdded
        this.onPeerTrackAdded = onPeerTrackAdded
        this.onStreamRemoved = onStreamRemoved
        this.onPeerOfferError = onPeerOfferError
        this.onPeerReceiveError = onPeerReceiveError
        this.createMyPeer = createMyPeer

        // Connect to the WebSocket bridge
        // TODO don't hard code room

        this.bridge.connect(WSconfig.baseUrl + tempChatConfig.roomId + '/')
        this.bridge.socket.addEventListener('open', () => {
            console.log("Connected to WebSocket")

            this.bridge.stream('webrtc').send({
                'id': ''
            })
        })
        this.bridge.listen()
        this.bridge.demultiplex('webrtc', (action, stream) => {
            console.log(action, stream)

            switch (action.type) {
            case "new-candidate":
                this.myConnection.addIceCandidate(new RTCIceCandidate(action.candidate))
                break
            case "chat-offer":
                if (action.myId === this.myPeerId) {
                    return
                }

                this.myConnection.setRemoteDescription(action.sdp)

                // give an answer
                this.getAnswer().then((answer) => {
                    this.bridge.stream('webrtc').send({
                        myId: this.myPeerId,
                        // targetId: action.myId,
                        type: "chat-answer",
                        sdp: answer
                    })
                })
                break
            case "chat-answer":
                if (action.myId === this.myPeerId) {
                    return
                }
                this.myConnection.setRemoteDescription(action.sdp)
                break
            case "user-joined":
                this.handleAddedUser(action)
                break
            case "assigned-id":
                this.myPeerId = action.userInfo.id
                this.createMyPeer(action.userInfo.id)
                break
            }
        })
        console.log(this.bridge)
    }

    handleAddedUser(event) {
        //const data = JSON.parse(event.data)
        const data = event
        const who = data.userInfo
        // Ignore our own id
        if (who.id === this.myPeerId) {
            return
        }
        const pc = this.connectionPool.prepare(who.id)
        pc.ontrack = (event) => this.onPeerTrackAdded(who, event)
        pc.onremovestream = (event) => this.onPeerStreamRemoved(who, event)

        this.onPeerAdded({id: who.id})
    }

    prepareMyConnection(pid) {
        this.myConnection = this.connectionPool.prepare(pid)

        // this.myConnection.setRemoteDescription(new RTCSessionDescription(signal.sdp), this.offer)

        this.myConnection.onicecandidate = this.onIceCandidateHandler
        this.myConnection.onnegotiationneeded = this.createOffer.bind(this)

        return this.myConnection
    }

    sendNegotiation(msg, pid) {
        this.bridge.stream('webrtc').send({
            myId: this.myPeerId,
            targetId: pid,
            type: "chat-offer",
            sdp: msg
        })
    }

    createOffer() {
        const pc = this.myConnection

        pc.createOffer(this.streamOptions)
            .then((offer) => {
                return pc.setLocalDescription(offer)
            })
            .then(() => {
                return pc.localDescription
            })
            .then((msg) => {
                // Send to negotiate server
                this.sendNegotiation(msg)
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
            .then(() => {
                return this.myConnection.localDescription
            })
            .catch(this.onPeerReceiveError)
    }

    onIceCandidateLocal(event) {
        console.log('handling local ICE Candidate')
        handleIceCandidate(event.candidate, this.myPeerConnection)
    }

    onIceCandidateRemote(peerId, event) {
        console.log('handling remote ICE Candidate')
        handleIceCandidate(event.candidate, this.peerConnections.get(Symbol.for(peerId)))
    }
}

export {RTCconfig, RTCConnectionPool, ChatConnectionManager}
