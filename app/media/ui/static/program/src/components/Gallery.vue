// The reason media-grid-item is hyphenated is because of lisp.
// This is a fact
<template>
    <div class="pure-u">
        <loading v-if="loading"/>

        <div v-if="info.error" class="info error">
            {{authError}}
        </div>

        <media-grid-item v-for="mediaItem in galleryMediaList" :media="mediaItem"/>

        <media-browser :media-items="galleryMediaList"/>
    </div>
</template>


<script>
import MediaGridItem from './MediaGridItem'
import MediaBrowser from './MediaBrowser'
import Loading from './Loading'
// Dynamic gallery

export default {
    data() {
        return {
            full: false,
            loading: true,
            galleryMediaList: [{}, {}, {}],
            authError: "Please sign in to view the media gallery.",
            infoBox: {
                status: "error"
            }
        }
    },
    computed: {
        info() {
            return {
                error: (this.infoBox.status === "error")
            }
        }
    },
    components: {
        MediaGridItem,
        MediaBrowser,
        Loading
    }
}
</script>

<style>
.media-content-box {
    animation-duration: 1s;
    animation-name: expand;
}
</style>
