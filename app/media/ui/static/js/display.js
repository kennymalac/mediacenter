// Mediator and Observer object over the Chatroom
var Chat = {
    _socket: ,//websocket
    _connection: ,//chat connection
    _peers ,
    connect: function() {
        this._connection = new RTCConnection;
    },
    updatePeers: function() {
        // This function is called when the video chat list is updated
        // Peers are added and removed if they are present in the peer list
    },
    onMessageReceived: function(evt) {
        // Event handler for when a websocket message is received and what to parse.
        var signal = JSON.parse(evt.data);
        if (signap.sdp) {
            this._connection.setRemoteDescription(new RTCSessionDescription(signal.sdp))
        }
    },
};

// TODO: these need to be user settings
// Defaults shouldn't always persist across page loads etc.
displayConfig = {
    showInCorner: true,
}

function updateCanvases(streams) {
    var streamCount = streams.length;

    // The three layouts will show either as a block or as a shape as specified below
    if (streamCount) {
        // length of streams determines how many video connections are present
        // if null is in the list, display black rectangle
        var displayOption = null;
        var displayOption = "block";
        // transform existing layout by animation
        // for now just change the css, experiment with CSS3 animations later
        if (streamCount == 2) {
            displayOption = "line"
        }
        if (streamCount == 3) {
            displayOption = "triangle"
        }
    }
    else {
        return null;
    }

    return layout;
}

function setupCanvases() {
    var canvases = "" //grid of DOM elements, use pure-grid
}

var errorHandler = function (err) {
    console.log(err);
    console.log("error occurred with creating an offer to peer");
}
var options = function () {
    offerToReceiveAudio: true,
    offerToReceiveVideo: true
};

var pc = new RTCPeerConnection();
pc.createOffer(function(offer) {
    pc.setLocalDescription(offer, function() {
        send("offer", JSON.stringify(pc.localDescription));
    }, errorHandler);
}, errorHandler, options);

pc.onaddstream = function(e) {
    console.log("peer connection stream added")

    Chat.addVideoStream();

    //document.getElementsByClassName("peer") = URL.createObjectURL(e.stream);
}

function displayCanvases(layout) {
    // User-facing response text
    var message;
    var canvases = null;

    // If there is no layout, there is nothing to operate on.
    // Return an empty list of canvases, and an error message.
    if (layout == null) {
        // deleted from a user event or no streams
        message = "No user chats are available.";
    }
    else {
        // Mutate the existing DOM-representation of the layout
        document.elementByClass()
    }
    return canvases, message;
}
