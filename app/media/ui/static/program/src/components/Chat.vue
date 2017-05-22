import {ChatRoom} from 'ChatLib';

<script>
import {ChatProvider, displayConfig, layoutBoxStructMethods} from '../chatlib/display'
import auth from "../auth.js"

export default {
    name: "ChatRoom",
    data() {
        return {
            chat: ChatProvider({
                onStreamAdded: this.onStreamAdded,
                onStreamRemoved: this.onStreamRemoved
            }),
            //currentLayout: ,
            participants: []
        }
    },
    computed: {
        participants() {
            // Retrieve all participants, which is each peer and its id and stream
            const participants = []
            for (const participant in Array.from(this.chat.streams)) {
                const pid = participant.id
                participants.push({
                    id: pid,
                    stream: this.chat.streams[pid]
                })
            }
            return participants
        },
        layoutTruthTable() {
            const numPeers = this.chat.peers.length
            return {
                noLayout: numPeers === 0,
                solo: numPeers === 1 || displayConfig.soloSwitch,
                line: numPeers > 1 && numPeers < 3,
                block: numPeers > 4 && !displayConfig.soloSwitch,
                triangle: numPeers === 3
            }
        }
    },
    ready() {
        navigator.getUserMedia({video: true, audio: true}, (stream) => {
            const peer = {
                id: auth.getActiveUser().details.id,
                stream: stream
            }
            // NOTE we should not be doing an offer each time!
            this.chat.offerMine(peer)
        }, (error) => {
            console.log(error)
        })
    },
    methods: {
        // selectLayout() {
        //     this.
        // },
        onStreamAdded(pid) {
            console.log(pid, "added stream")
        },
        onStreamRemoved(pid) {
            console.log(pid, "removed stream")
        },
        render(h) {
            // NOTE maybe this should be the method that determines if we should update element CSS
            // or if we need to create a new element entirely
            // User-facing response text
            // var message

            // If there is no layout, there is nothing to operate on.
            // Return an empty list of canvases, and an error message.
            // if (layout == null) {
            //     // deleted from a user event or no streams
            //     return new Error("No user chats are available.")
            // }
            // else {
            // }

            // Update the display of the layout and ALSO reretrieve list of streams
            // length of streams determines how many video connections are present
            const layouts = this.layoutTruthTable
            if (layouts.noLayout) {
                return
            }

            // Create a grid and loop over to determine DOM structure

            // Using the truth table, dispatch the layout's box datastruct generator
            let grid = []
            if (layouts.solo) {
                grid = layoutBoxStructMethods[Symbol("solo")]
            }
            else if (layouts.block) {
                grid = layoutBoxStructMethods[Symbol("line")]
            }
            else if (layouts.line) {
                grid = layoutBoxStructMethods[Symbol("block")]
            }
            else if (layouts.triangle) {
                grid = layoutBoxStructMethods[Symbol("triangle")]
            }

            console.log(grid)

            // TODO Use flexbox
            // disregard the below code
            //padding = boxPaddingRight + boxPaddingLeft + 
            //boxWidth = container.width / ( + boxPaddingRight + boxPaddingLeft
            //boxHeight = container.height / ()

            //~(33%, 33%, 33%) each row
            //~(50%, 50%) || ~(33%, 33%, 33%) each column

            const allParticipants = this.participants
            console.log(allParticipants)
            // TODO Optimize this
            // const newParticipants =
            // TODO Move existing videos rather than creating a new video with Vue transitions using animate.css

            // Separate the video object url source modification from the creation of the element

            const peers = allParticipants.map((p) => {
                return (
                    <div ref={p.id} class="participant-container">
                        <video src={URL.createObjectURL(p.stream)} class="participant-video" autoplay></video>
                        <div class="controls">
                        </div>
                    </div>
                )
            })

            return (
                <div class="pure-u-1-1">
                    {peers}
                </div>
            )
            // TODO transition animations from one layout to another
            // transitionsetPeerVideoDimensions
        }
    }
}

</script>

 /* var errorHandler = function (err) {
  * console.log(err);
  * console.log("error occurred with webRTC");
  * }
  * var options = {
  * offerToReceiveAudio: true,
  * offerToReceiveVideo: true
  * };

  * var constraints = {
  * video: true,
  * audio: true,
  * };

  * var video = document.getElementById("you");
  * 
  */
  //var pc = new RTCPeerConnection();
  //pc.createOffer(function(offer) {
  //    pc.setLocalDescription(offer, function() {
  //        send("offer", JSON.stringify(pc.localDescription));
  //    }, errorHandler);
  //}, errorHandler, options);
  //
  //pc.onaddstream = function(e) {
  //    console.log("peer connection stream added");
  //    document.getElementByID("peer").src = URL.createObjectURL(e.stream);
  //}
</script>
