var RTCconfig = {
    'iceServers': [
        {'url': 'stun:stun.services.mozilla.com'},
    ]
};

var WSConnection = {
    location: ""
};

class RTCConnectionPool {
    constructor() {
        this.peerConnections = WeakMap();
    },
    prepare() {
        return new RTCPeerConnection(RTCconfig);
        //this._peerConnection
    },
    cancel() {
        // Close the connections here
        this.peerConnections.empty();
    },
    receive(peer) {
        //
        this.peerConnections.push([
            Symbol(peer.id),
            Promise(
                this.prepare,
                (success) => {
                    // perform action
                },
                (error) => {
                    // exception raised, fallback
                })]);
    }
}
