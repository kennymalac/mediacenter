let RTCconfig = new RTCConfiguration({
    'iceServers': [
        {'url': 'stun:stun.services.mozilla.com'},
    ]
});

let WSConnection = {
    location: ""
};

class RTCConnectionPool {
    constructor() {
        this.peerConnections = Map();
    }

    prepare(peer) {
        let conn = new RTCPeerConnection(RTCconfig);
        this.peerConnections[Symbol(peer.id)] = conn;
        return conn;
    }

    clear() {
        // Close the connections here
        this.peerConnections.empty();
    }
}
