import {ChatConnectionManager} from './connection'

// Rename this file to Chat?

// TODO: these need to be user settings
// Defaults shouldn't always persist across page loads etc.
var displayConfig = {
    showInCorner: true,
    // Switch to a solo view peer video container based on if a user is talking
    soloSwitch: false
}

const solo = Symbol.for("solo")
const block = Symbol.for("block")
const line = Symbol.for("line")
const triangle = Symbol.for("triangle")

const layoutBoxStructMethods = {
    [solo](count, peerIdList) {
        // 1 on 1
        // raise Exception()
        return []
    },
    [line](count, peerIdList) {
        // TODO variable numCols
        console.log('count ', count)
        console.log('peerIdList ', count)
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
    myPeer = null
    peers = new Map()
    streams = new Map()
    // TODO: options configurable
    options = {
        stream: {
            offerToReceiveAudio: 1,
            offerToReceiveVideo: 1
        }
    }

    constructor(options) {
        this.options = Object.assign({}, this.options, options)
        this.options.connection.onPeerOfferError = this.onPeerOfferError.bind(this)
        this.options.connection.onPeerReceiveError = this.onPeerReceiveError.bind(this)
        this.options.connection.onPeerAdded = this.onPeerAdded.bind(this)
        this.options.connection.onPeerTrackAdded = this.onPeerTrackAdded.bind(this)
        this.options.connection.createMyPeer = this.createMyPeer.bind(this)
    }

    updatePeers() {
        // This function is called when the video chat list is updated
        // Peers are added and removed if they are present in the peer list
    }

    createMyPeer(pid) {
        this.myPeer = {
            id: pid
        }
        console.log('my peer', this.myPeer)

        // NOTE we should be using the user account id rather than something random
        this.peers.set(pid, this.myPeer)

        console.log(this.constraints)
        let shouldRequestMedia = false
        for (const constraint in this.constraints) {
            if (this.constraints[constraint] === true) {
                shouldRequestMedia = true
                continue
            }
        }

        if (shouldRequestMedia) {
            // Request my streams
            navigator.mediaDevices.getUserMedia(this.constraints)
                .then((stream) => {
                    this.receiveMyStream(stream)
                })
                .catch((error) => {
                    console.log(error)
                })
        }
        else {
            this.streams.set(pid, null)
            this.options.connection.onStreamAdded(pid)
        }
    }

    connect(constraints) {
        if (constraints.screenshare) {
            // TODO fix this
            this.constraints = {
                audio: constraints.audio,
                video: {
                    mediaSource: 'screen',
                    mozMediaSource: 'screen',
                    mandatory: {chromeMediaSource: ['screen', 'window']},
                    optional: []
                }
            }
        }
        else {
            this.constraints = constraints
        }

        // RAII
        this.connection = new ChatConnectionManager(this.options.connection, this.options.stream)
    }

    onPeerOfferError(error) {
        console.log(error)
        console.log("error occurred with creating an offer to peer")
    }

    onPeerReceiveError(error) {
        console.log(error)
        console.log("error occurred with resolving an offer from a peer")
    }

    onPeerTrackAdded(who, e) {
        console.log("peer connection stream added")
        const pid = who.id
        this.streams.set(pid, e.stream[0])
        this.onStreamAdded(pid)
    }

    onPeerStreamRemoved(who, pc) {
        const pid = who.id
        // remove the stream on a remove stream event
        this.streams.delete(pid)
        // TODO remove peer!
        // this.peers.delete(pid)
        this.onStreamRemoved(pid)
    }

    offer(who) {
        this.connection.createOffer(who)
    }

    receiveMyStream(stream) {
        const pid = this.myPeer.id
        this.streams.set(pid, stream)
        console.log('this.streams', this.streams.size)
        // NOTE We want to add it to the existant peer connections
        stream.getTracks().forEach(track => this.connection.addTrack(track, stream))
        this.connection.onStreamAdded(pid)
    }

    onPeerAdded(peer) {
        const pid = peer.id

        // NOTE we can ask the user if they want to chat with this peer
        this.streams.set(pid, null)
        // Sooner or later account details will be in the peers Map...
        this.peers.set(pid, peer)
        this.connection.onStreamAdded(pid)
    }
}

export {
    layoutBoxStructMethods,
    ChatProvider,
    solo,
    displayConfig
}
