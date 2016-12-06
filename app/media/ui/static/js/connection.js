var RTCconfig = {
    'iceServers': [
        {'url': 'stun:stun.services.mozilla.com'},
    ]
};

var WSConnection = {
    location: ""
};

var RTCConnection = {
    _peerConnection: undefined,
    prepare: function() {
        this._peerConnection = new RTCPeerConnection(RTCconfig);
        this._peerConnection
    },
    cancel: function() {
        // Close the connection here
        this._peerConnection = null;
    },
    receive: function() {
        //
    }
}
