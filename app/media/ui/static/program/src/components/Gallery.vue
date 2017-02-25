// The reason media-grid-item is hyphenated is because of lisp.
// This is a fact
<template>
    <div class="pure-u-1-1">
        <loading v-if="loading"/>

        <div v-if="info.error" class="info error">
            {{authError}}
        </div>

        <div class="debug-controls">
            <button class="pure-btn" v-on:click="showAlbums">
                Show Albums
            </button>
        </div>

        <album-grid-item v-for="album in galleryAlbums" :album="album"/>

        <media-browser :media-items="galleryMediaList"/>
    </div>
</template>


<script>
import MediaGridItem from './MediaGridItem'
import AlbumGridItem from './AlbumGridItem'
import MediaBrowser from './MediaBrowser'
import Loading from './Loading'
// Dynamic gallery

export default {
    components: {
        MediaGridItem,
        AlbumGridItem,
        MediaBrowser,
        Loading
    },
    data() {
        return {
            full: false,
            loading: false,
            galleryAlbums: [],
            galleryMediaList: [{}, {}, {}],
            authError: "Please sign in to view the media gallery.",
            infoBox: {
                status: "error"
            },
            auth: {
                privilegeLevel: "guest",
                user: {
                    id: 0
                }
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
    methods: {
        showAlbums() {
            this.searchAlbums().then(() => {
                //bam! data
            })
        },
        searchAlbums() {
            var params = {}
            // Fetches available media
            if (!this.auth.privilegeLevel === "guest") {
                params.accessLevel = "public"
            }
            // TODO this is an authorized request
            return fetch("/api/album/", {
                method: "GET",
                data: params
            })
                .then((response) => {
                    if (response.status >= 200 && response.status < 300) {
                        return response.json()
                    } else {
                        var error = new Error(response.statusText)
                        error.response = response
                        throw error
                    }
                })

                .then((data) => {
                    console.log(data)
                    // this.albums = galleryAlbums
                })
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
    margin-right: .5rem;
    border-radius: 4px / 5px;
    border: 2px solid rgba(52, 73, 94,1.0);
    background-color: rgba(221, 221, 221, 1);
    height: 6rem;
    width: 8rem;
}
</style>
