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
    localPeerConnections = new Map()
    remotePeerConnections = new Map()

    prepareLocal(peer) {
        let conn = new RTCPeerConnection(RTCconfig)
        this.localPeerConnections[Symbol.for(peer.id)] = conn
        return conn
    }

    prepareRemote(peer) {
        let conn = new RTCPeerConnection(RTCconfig)
        this.remotePeerConnections[Symbol.for(peer.id)] = conn
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
            // case "new-candidate":
            //     this.myConnection.addIceCandidate(new RTCIceCandidate(action.candidate))
            //     break
            case "chat-offer":
                if (action.myId === this.myPeerId) {
                    return
                }

                this.connectionPool.localPeerConnections.get(Symbol.for(action.myId))
                    .setRemoteDescription(action.sdp)
                const remotePc = this.connectionPool.remotePeerConnections.get(Symbol.for(action.myId))
                remotePc.setLocalDescription(action.sdp)

                // give an answer
                this.getAnswer(remotePc).then((answer) => {
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
                this.connectionPool.localPeerConnections.get(Symbol.for(action.myId))
                    .setRemoteDescription(action.sdp)
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

        this.prepareConnections(who)
        // Call callback which adds peer to list of peers for display purposes
        this.onPeerAdded(who)
    }

    prepareConnections(who) {
        // Create remote peer connection for this peer
        const remotePc = this.connectionPool.prepareRemote(who.id)
        remotePc.ontrack = (event) => this.onPeerTrackAdded(who, event)
        remotePc.onicecandidate = this.onIceCandidateHandler
        // NOTE DEPRECATED pc.onremovestream = (event) => this.onPeerStreamRemoved(who, event)

        // Also create local peer connection for this user
        const localPc = this.connectionPool.prepare(who.id)
        localPc.onicecandidate = this.onIceCandidateHandler
        localPc.onnegotiationneeded = this.createOffer.bind(this)
        // this.myConnection.setRemoteDescription(new RTCSessionDescription(signal.sdp), this.offer)
    }

    sendNegotiation(msg, pid) {
        this.bridge.stream('webrtc').send({
            myId: this.myPeerId,
            targetId: pid,
            type: "chat-offer",
            sdp: msg
        })
    }

    createOffer(pc) {
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

    getAnswer(pc) {
        return pc.createAnswer().then((answer) => {
            console.log("answer", answer)
            if (this.myConnection.connectionState === "connecting") {
                // dispatch an event to show a loading wheel
            }
            return pc.setLocalDescription(answer)
        })
            .then(() => {
                return pc.localDescription
            })
            .catch(this.onPeerReceiveError)
    }

    onIceCandidateLocal(event) {
        console.log('handling local ICE Candidate')
        // handleIceCandidate(event.candidate, )
    }

    onIceCandidateRemote(peerId, event) {
        console.log('handling remote ICE Candidate')
        handleIceCandidate(event.candidate, this.peerConnections.get(Symbol.for(peerId)))
    }
}

export {RTCconfig, RTCConnectionPool, ChatConnectionManager}
