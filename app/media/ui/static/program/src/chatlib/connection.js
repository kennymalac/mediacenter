import { WebSocketBridge } from 'django-channels'
import { handleIceCandidate } from './ice.js'

const RTCconfig = {
    iceServers: [
        {urls: ['turn:127.0.0.1:'], username: 'mediacenter', credential: 'password'} // ,
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
        this.peerConnections.set(Symbol.for(peer.id), conn)
        return conn
    }

    getPeerConnection(pid) {
        return this.peerConnections.get(Symbol.for(pid))
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
            case "new-candidate":
                if (action.targetId !== this.myPeerId) {
                    return
                }

                handleIceCandidate(action.candidate, this.getOrCreatePeerConnection(action.myId))
                break
            case "chat-offer":
                // TODO add check that this offer is for my peer
                if (action.myId === this.myPeerId) {
                    return
                }

                const pc = this.getOrCreatePeerConnection(action.myId)
                pc.setRemoteDescription(action.sdp)

                // give an answer
                this.getAnswer(pc).then((answer) => {
                    this.bridge.stream('webrtc').send({
                        myId: this.myPeerId,
                        targetId: action.myId,
                        type: "chat-answer",
                        sdp: answer
                    })
                })
                break
            case "chat-answer":
                if (action.myId === this.myPeerId && action.targetId !== this.myPeerId) {
                    return
                }
                this.getOrCreatePeerConnection(action.myId)
                    .setRemoteDescription(action.sdp)
                break
            case "user-joined":
                // Ignore our own id
                if (action.userInfo.id === this.myPeerId) {
                    return
                }

                // NOTE we may not have to add the user here
                // this.handleAddedUser(action)
                this.createOffer(action.userInfo.id)
                break
            case "assigned-id":
                this.myPeerId = action.userInfo.id
                this.createMyPeer(action.userInfo.id)
                break
            }
        })
        console.log(this.bridge)
    }

    getOrCreatePeerConnection(pid) {
        const maybeConn = this.connectionPool.getPeerConnection(pid)
        return maybeConn || this.handleAddedUser({ userInfo: { id: pid } })
    }

    handleAddedUser(event) {
        //const data = JSON.parse(event.data)
        const data = event
        const who = data.userInfo

        const pc = this.prepareConnection(who)
        // Call callback which adds peer to list of peers for display purposes
        this.onPeerAdded(who)
        return pc
    }

    prepareConnection(who) {
        // Create remote peer connection for this peer
        const pc = this.connectionPool.prepare(who)
        pc.ontrack = (event) => this.onPeerTrackAdded(who, event)
        pc.onicecandidate = (event) => this.onIceCandidate.bind(this)(who.id, event)
        pc.onnegotiationneeded = () => this.createOffer.bind(this)(who.id)
        // NOTE DEPRECATED pc.onremovestream = (event) => this.onPeerStreamRemoved(who, event)
        // this.myConnection.setRemoteDescription(new RTCSessionDescription(signal.sdp), this.offer)
        return pc
    }

    sendNegotiation(msg, pid) {
        this.bridge.stream('webrtc').send({
            myId: this.myPeerId,
            targetId: pid,
            type: "chat-offer",
            sdp: msg
        })
    }

    createOffer(pid) {
        console.log('creating offer with peer', pid)
        // Get the local and remote peer connections from the pid
        const pc = this.getOrCreatePeerConnection(pid)

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
    }

    getAnswer(pc) {
        return pc.createAnswer().then((answer) => {
            console.log("answer", answer)
            if (pc.connectionState === "connecting") {
                // TODO dispatch an event to show a loading wheel
            }
            pc.setLocalDescription(answer)
        })
            .then(() => {
                return pc.localDescription
            })
            .catch(this.onPeerReceiveError)
    }

    onIceCandidate(pid, event) {
        console.log('handling remote ICE Candidate')
        this.bridge.stream('webrtc').send({
            myId: this.myPeerId,
            targetId: pid,
            type: "new-candidate",
            candidate: event.candidate
        })
    }
}

export {RTCconfig, RTCConnectionPool, ChatConnectionManager}
