<template>
    <div class="pure-u-1-1">
        <loading v-if="loading"/>

        <div v-if="authError" class="info error">
            {{authError}}
        </div>

        <div class="debug-controls">
            <ladda-button :isLoading="isLoadingAlbums" @click.native="showAlbums" text="Show Albums" />
        </div>

        <album-grid-item v-for="album in galleryAlbums" @albumSelected="showAlbumGallery" :album="album"/>

        <media-browser ref="browser" />
    </div>
</template>


<script>
import {AlbumCollection} from '../models/Album.js'

import MediaGridItem from './MediaGridItem'
import AlbumGridItem from './AlbumGridItem'
import MediaBrowser from './MediaBrowser'
import Loading from './Loading'
import LaddaButton from './Gui/LaddaButton'
//import router from '../router/index.js'
import auth from '../auth.js'
// Dynamic gallery
export default {
    components: {
        MediaGridItem,
        AlbumGridItem,
        MediaBrowser,
        Loading,
        LaddaButton
    },
    data() {
        return {
            full: false,
            loading: false,
            isLoadingAlbums: false,
            currentAlbum: {},
            galleryAlbums: [],
            album: {
                id: null,
                title: "",
                description: ""
            }
        }
    },
    computed: {
        // info() {
        //     return {
        //         error: (this.infoBox.status === "error")
        //     }
        // },
        authError() {
            if (auth.hasActiveUser()) {
                return ""
            }
            else {
                return "Please sign in to view the media gallery."
            }
        }
    },
    methods: {
        showAlbums() {
            this.isLoadingAlbums = true
            AlbumCollection.searchAlbums().then((data) => {
                this.galleryAlbums = data
                this.isLoadingAlbums = false
            })
        },
        showAlbumGallery(album) {
            this.loading = true
            this.$refs.browser.selectAlbum(album)
            this.loading = false
            // router.replace({
            //     path: 'gallery/album',
            //     params: {
            //         id: album.id
            //     }
            // })
        }
    }
}
</script>

<style>
.media-content-box {
    animation-duration: 1s;
    animation-name: expand;
}
.gallery-horizontal-box {
    display: inline-block;
    vertical-align: top;
    margin-right: .5rem;
    border-radius: 4px / 5px;
    border: 2px solid rgba(52, 73, 94,1.0);
    background-color: rgba(221, 221, 221, 1);
    height: 6rem;
    width: 8rem;
}
</style>
