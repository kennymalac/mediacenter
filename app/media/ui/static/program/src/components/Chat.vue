import {ChatRoom} from 'ChatLib';

<script>
import ChatControls from './ChatControls'
import {ChatProvider, displayConfig, layoutBoxStructMethods} from '../chatlib/display'
// import auth from "../auth.js"

export default {
    name: "ChatRoom",
    components: {
        ChatControls
    },
    data() {
        return {
            chat: new ChatProvider({
                connection: {
                    onStreamAdded: this.onStreamAdded,
                    onStreamRemoved: this.onStreamRemoved
                }
            })
            //currentLayout: ,
        }
    },
    mounted() {
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
        const layouts = this.layoutTruthTable()
        console.log(this.chat.peers)
        console.log(this.chat.peers.size)
        console.log(layouts)

        let peersDisplay = []

        if (!layouts.noLayout) {
            // Create a grid and loop over to determine DOM structure
            // Using the truth table, dispatch the layout's box datastruct generator
            let grid = []
            let peerIds = Array.from(this.chat.peers)
            const peerCount = peerIds.length
            console.log('layout', Object.getOwnPropertySymbols(layoutBoxStructMethods))
            if (layouts.solo) {
                grid = layoutBoxStructMethods[Symbol.for("solo")](peerCount, peerIds)
            }
            else if (layouts.block) {
                grid = layoutBoxStructMethods[Symbol.for("line")](peerCount, peerIds)
            }
            else if (layouts.line) {
                grid = layoutBoxStructMethods[Symbol.for("block")](peerCount, peerIds)
            }
            else if (layouts.triangle) {
                grid = layoutBoxStructMethods[Symbol.for("triangle")](peerCount, peerIds)
            }

            console.log('grid', grid)

            // TODO Use flexbox
            // disregard the below code
            // padding = boxPaddingRight + boxPaddingLeft + 
            // boxWidth = container.width / ( + boxPaddingRight + boxPaddingLeft
            // boxHeight = container.height / ()

            // ~(33%, 33%, 33%) each row
            // ~(50%, 50%) || ~(33%, 33%, 33%) each column

            const allParticipants = this.participants()
            console.log(allParticipants)
            // TODO Optimize this
            // const newParticipants =
            // TODO Move existing videos with Vue transitions using animate.css

            // TODO Separate the video object url source modification from the creation of the element

            peersDisplay = allParticipants.map((p) => {
                if (p.stream === null) {
                    return (
                        <div ref={p.id} class="participant-container">
                            <video class="participant-video" autoplay></video>

                            <div class="controls">
                            </div>
                       </div>
                    )
                }
                return (
                   <div ref={p.id} class="participant-container">
                        <video src={URL.createObjectURL(p.stream)} muted class="participant-video" autoplay></video>
                        <div class="controls">
                        </div>
                   </div>
                )
            })
        }
        else {
        }

        return (
            <div>
                <ChatControls
                  clickJoinChatRoom={this.onJoinChatRoom} />
                <div>
                    {peersDisplay}
                </div>
            </div>
        )
        // TODO transition animations from one layout to another
        // transitionsetPeerVideoDimensions
    },
    methods: {
        onJoinChatRoom(settings) {
            if (settings.screenshare) {
                this.chat.connect({ screenshare: true, audio: settings.audio })
            }
            else {
                this.chat.connect({ video: settings.video, audio: settings.audio })
            }
        },
        participants() {
            // Retrieve all participants, which is each peer and its id and stream
            const participants = []
            for (const pid of this.chat.peers.keys()) {
                participants.push({
                    id: pid,
                    stream: this.chat.streams.get(pid)
                })
            }
            return participants
        },
        layoutTruthTable() {
            const numPeers = this.chat.peers.size
            return {
                noLayout: numPeers === 0,
                solo: numPeers === 1 || displayConfig.soloSwitch,
                line: numPeers > 1 && numPeers < 3,
                block: numPeers > 4 && !displayConfig.soloSwitch,
                triangle: numPeers === 3
            }
        },
        // selectLayout() {
        //     this.
        // },
        onStreamAdded(pid) {
            console.log(pid, "added stream")
            this.$forceUpdate()
        },
        onStreamRemoved(pid) {
            console.log(pid, "removed stream")
            this.$forceUpdate()
        }
    }
}

</script>


<style scoped lang="scss">
@import "../classicTheme.scss";

.participant-video {
    width: 854px;
    height: 480px;
    border: 1px solid $classicblue;
}
</style>

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
