import {ChatRoom} from 'ChatLib';


<template>
    <div class="pure-g">
        <div class="participants">
            <!-- <div class="participant">
                 <video id="you" autoplay></video>
                 </div>
                 <div class="participant">
                 <video id="peer" autoplay></video>
                 </div> -->
        </div>
    </div>
</template>


export default {

}

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
  * navigator.getUserMedia(constraints, function(stream) {
  * video.src = URL.createObjectURL(stream);
  * }, errorHandler);
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
