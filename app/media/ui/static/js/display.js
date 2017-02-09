// TODO: these need to be user settings
// Defaults shouldn't always persist across page loads etc.
var displayConfig = {
    showInCorner: true
};

let layoutMutators = {
    [Symbol("block")] () {
        // 
    },
    [Symbol("line")] () {
        // 
    },
    [Symbol("triangle")] () {
        // 
    }
}

// Mediator and Observer object over the Chatroom
class Chat {
    constructor () {
        this.connection = new RTCConnection;
        this.socket = null;//= websocket
        this.connection = null;//chat connection
        this.peers = new Set();
        // TODO: options configurable
        this.streamOptions = {
            offerToReceiveAudio: true,
            offerToReceiveVideo: true
        };
    }

    updatePeers () {
        // This function is called when the video chat list is updated
        // Peers are added and removed if they are present in the peer list
    }

    onMessageReceived (event) {
        // Event handler for when a websocket message is received and what to parse.
        var signal = JSON.parse(event.data);
        if (signap.sdp) {
            this._connection.setRemoteDescription(new RTCSessionDescription(signal.sdp));
        }
    }

    onPeerOfferError (error) {
        console.log(error);
        console.log("error occurred with creating an offer to peer");
    }

    offer (who) {
        var pc = new RTCPeerConnection();
        pc.createOffer(function(offer) {
            pc.setLocalDescription(offer, function() {
                send("offer", JSON.stringify(pc.localDescription));
            }, this.onPeerOfferErorr);
        }, onPeerOfferError, options);

        pc.onaddstream = () => {
            //derp
            console.log("peer connection stream added");

            Chat.addVideoStream();
            //document.getElementsByClassName("peer") = URL.createObjectURL(e.stream);
        };
    }
};

class ChatRoom {
    constructor() {
        this.displayOption = null;
    }

    show (layout) {
        // User-facing response text
        var message;
        var canvases = null;

        // If there is no layout, there is nothing to operate on.
        // Return an empty list of canvases, and an error message.
        if (layout == null) {
            // deleted from a user event or no streams
            raise Error("No user chats are available.");
        }
        else {
            // Mutate the existing DOM-representation of the layout
            document.elementByClass();
        }
        return canvases, message;
    }

    updateDisplay (numStreams) {
        // The three layouts will show either as a block or as a shape as specified below
        // TODO TypeScript, this is terrible
        if (_.isNumber(numStreams)) {
            // length of streams determines how many video connections are present
            // if null is in the list, display black rectangle
            if (streamCount) {
                this.displayOption = Symbol("block");
            }
            // transform existing layout by animation
            // for now just change the css, experiment with CSS3 animations later
            else if (streamCount == 2) {
                this.displayOption = Symbol("line");
            }
            else if (streamCount == 3) {
                this.displayOption = Symbol("triangle");
            }
        }
        else {
            // raise Error
        }
    }
}
