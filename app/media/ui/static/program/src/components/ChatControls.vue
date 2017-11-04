<template>
  <div class="chat-controls">
    <fieldset class="flex one">
      <legend>settings</legend>
      <label>
        <input v-model="settings.audio" name="audio" type="checkbox" />
        <span class="checkable">Audio</span>
      </label>
      <label>
        <input v-model="settings.video" name="video" type="checkbox" />
        <span class="checkable">Video</span>
      </label>
      <label>
        <input v-model="settings.screenshare" name="screenshare" type="checkbox" />
        <span class="checkable">Screenshare</span>
      </label>
    </fieldset>
    <button @click="onClickJoinChatRoom">Join chatroom</button>
  </div>
</template>

<script>
    export default {
        props: {
            'clickJoinChatRoom': {
                type: Function,
                required: true
            }
        },
        name: "ChatControls",
        data() {
            return {
                // TODO persistence
                settings: {
                    audio: false,
                    video: false,
                    screenshare: false
                }
            }
        },
        methods: {
            onClickJoinChatRoom() {
                this.clickJoinChatRoom(this.settings)
            }
        }
    }
</script>
