<template>
    <div class="pure-u-1-1">
        <loading v-if="loading"/>

        <div v-if="info.error" class="info error">
            {{authError}}
        </div>

        <div class="debug-controls pure-form">
            <button class="pure-button" v-on:click="showAlbums">
                Show Albums
            </button>
            <button class="pure-button" v-on:click="showCreateAlbum">
                Create Album
            </button>

            <input type="text" v-model="album.id" />
            <button class="pure-button" v-on:click="showAlbumDetails">
                Album Details
            </button>
        </div>

        <album-grid-item v-for="album in galleryAlbums" @albumSelected="showAlbumGallery" :album="album"/>

        <media-browser ref="browser" />
    </div>
</template>


<script>
import MediaGridItem from './MediaGridItem'
import AlbumGridItem from './AlbumGridItem'
import MediaBrowser from './MediaBrowser'
import Loading from './Loading'
import router from '../router/index.js'
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
            currentAlbum: {},
            galleryAlbums: [],
            authError: "Please sign in to view the media gallery.",
            infoBox: {
                status: "error"
            },
            auth: {
                privilegeLevel: "guest",
                user: {
                    id: 0
                }
            },
            album: {
                id: null,
                title: "",
                description: ""
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
            this.searchAlbums().then((data) => {
                this.galleryAlbums = data
            })
        },
        showAlbumGallery(album) {
            this.loading = true
            console.log(album)
            this.$refs.browser.selectAlbum(album)
            this.loading = false
            // router.replace({
            //     path: 'gallery/album',
            //     params: {
            //         id: album.id
            //     }
            // })
        },
        showAlbumDetails() {
            // TODO verify privilege
            router.push({
                path: 'album',
                params: {
                    id: this.album.id
                }
            })
        },
        showCreateAlbum() {
            // TODO verify privilege
            router.push('album/create')
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
