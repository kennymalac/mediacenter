import {RTCConnectionPool} from './connection'

// Rename this file to Chat?

// TODO: these need to be user settings
// Defaults shouldn't always persist across page loads etc.
var displayConfig = {
    showInCorner: true,
    // Switch to a solo view peer video container based on if a user is talking
    soloSwitch: false
}

const solo = Symbol("solo")
const block = Symbol("block")
const line = Symbol("line")
const triangle = Symbol("triangle")

const layoutBoxStructMethods = {
    [solo](count, peerIdList) {
        // 1 on 1
        // makes lines for each peer
        // raise Exception()
        return
    },
    [line](count, peerIdList) {
        // TODO variable numRows
        if (count === -1) {
            // What this means there is colLength-1 left in the row
        }
        else if (count === -2) {
            // What this means there is colLength-2 left in the row
        }
        else if (count !== 3) {
            // raise Exception()
            return
        }
    },
    [block](count, peerIdList) {
        // TODO variable numColumns
        // 2n^2 people
        // makes lines for each peer
        if (count < 4) {
            return new Error("Blocks are only allowed with 4+ active streams.")
        }

        // We are going to pop each peer id and use those
        let activePeers = peerIdList

        const layout = [] // [, null]
        let leftoverLen = count
        const numColumns = 3
        const numRows = Math.ceil(count / numColumns)

        // Loop over the amount over rows and create a line
        for (let currLine = 0; currLine < numRows; currLine += numColumns) {
            const currPeers = activePeers.splice(0, leftoverLen)
            layout.push(layoutBoxStructMethods[line](leftoverLen, currPeers))
            leftoverLen -= currLine
        }

        // leftline = count
    },
    [triangle](count, peerIdList) {
        // one line with 2, solo for bottom
    }
}

// Mediator and Observer object over the Chatroom
class ChatProvider {
    constructor(options) {
        this.connectionPool = new RTCConnectionPool()
        this.socket = null // = websocket
        this.connection = null // chat connection
        this.myPeer = null
        this.peers = new Set()
        this.streams = new Set()
        // TODO: options configurable
        this.streamOptions = {
            offerToReceiveAudio: true,
            offerToReceiveVideo: true
        }
        this.onStreamAdded = options.onStreamAdded
        this.onStreamRemoved = options.onStreamRemoved
    }

    updatePeers() {
        // This function is called when the video chat list is updated
        // Peers are added and removed if they are present in the peer list
    }

    onMessageReceived(event) {
        // Event handler for when a websocket message is received and what to parse.
        var signal = JSON.parse(event.data)
        if (signal.sdp) {
            this._connection.setRemoteDescription(new RTCSessionDescription(signal.sdp))
        }
    }

    onPeerOfferError(error) {
        console.log(error)
        console.log("error occurred with creating an offer to peer")
    }

    onPeerReceiveError(error) {
        console.log(error)
        console.log("error occurred with resolving an offer from a peer")
    }

    offerMine(myPeer) {
        this.myPeer = myPeer
        this.offer(this.myPeer)
    }

    offer(who) {
        var pc = new RTCPeerConnection()
        const options = {}
        pc.createOffer(options)
            .then((offer) => {
                return pc.setLocalDescription(offer)
                    .then(() => {
                        return pc.localDescription.toJSON() })
                    .catch(this.onPeerOfferError)
            })
            .then((msg) => {
                fetch() 
            })
            .catch(this.onPeerOfferError)

        pc.ontrack = (e) => {
            console.log("peer connection stream added")
            this.receive(who).then((pid) => {
                this.streams[pid] = e.stream[0]
                this.onStreamAdded(pid)
                // 
            })
        }

        pc.onremovestream = (pc) => (pc) => {
            const pid = who.id
            // remove the stream on a remove stream event
            this.streams[pid].remove()
            this.peers[pid].remove()
            this.onStreamRemoved(pid)
        }
    }

    receive(peer) {
        const pid = peer.id
        var pc = this.connectionPool.prepare(pid)

        return this.connectionPool.myConnection.createAnswer().then((answer) => {
            console.log(answer)
            if (pc.connectionState === "connecting") {
                // dispatch an event to show a loading wheel
            }
            return pc.setLocalDescription(answer)
        })
        .then((peerConn) => {
            this.peers[pid] = peerConn
            return pid
        })
        .catch(this.onPeerReceiveError)
    }
}

export {
    layoutBoxStructMethods,
    ChatProvider,
    solo,
    displayConfig
}
