<template>
    <Modal :isOpen="isModalOpen" :onClose="closeModal"> <!-- position="left" -->
        <div slot="title">
            <modal-toolbar :buttons="leftToolbarButtons" />
            <label>
                {{album.title}}
            </label>
        </div>

        <div class="gallery-photo-view">
            <div v-if="photo">Nothing to show.</div>
        </div>

        <div class="gallery-preview" @play="playSlideshow" @nextPhoto="nextPhoto" @prevPhoto="prevPhoto">
            <div v-on:click="goBack" v-bind:class="{ disabled: atBeginningOfRoster }" class="go-back ion-ios-arrow-back"></div>
            <div class="preview-container">
                <media-grid-item v-for="mediaItem in currentRoster" :media="mediaItem"/>
            </div>
            <div v-on:click="goForward" v-bind:class="{ disabled: atEndOfRoster }" class="go-forward ion-ios-arrow-forward"></div>
        </div>
    </Modal>
</template>

<script>
import MediaGridItem from './MediaGridItem'
import Modal from './Gui/Modal/Modal'
import ModalToolbar from './Gui/Modal/ModalToolbar'
import ModalToolbarItem from './Gui/Modal/ModalToolbarItem'

// import SmartPager from '../pager'

export default {
    name: 'media-browser',
    components: {
        MediaGridItem,
        Modal,
        ModalToolbar,
        ModalToolbarItem
    },
    data() {
        return {
            //
            isActive: false,
            album: {},
            mediaItems: [],
            pageCache: {},
            gallery: {},
            currentMediaItem: {},
            currentRoster: [],
            atBeginningOfRoster: false,
            atEndOfRoster: false,
            currentPage: 1,
            isModalOpen: true,
            leftToolbarButtons: [
                {
                    icon: "ion-ios-skip-backward",
                    action() {
                        // Go back a photo
                        this.$emit('prevPhoto')
                    }
                },
                {
                    icon: "ion-ios-play",
                    action() {
                        // Play a slideshow
                        this.$emit('play')
                    }
                },
                {
                    icon: "ion-ios-skip-forward",
                    action() {
                        // Go forward in the album
                        this.$emit('nextPhoto')
                    }
                },
                {
                    icon: "ion-ios-color-wand-outline",
                    action() {
                        // Apply effects to this photo
                        // Slideshow has to be paused
                        this.$emit('applyEffect')
                    }
                }
            ]
        }
    },
    methods: {
        prevMedia() {
            //TODO why don't js iterators do previous???
        },
        playSlideshow() {
            //t
        },
        // Toolbar item icons
        goForward() {
            if (!this.atEndOfRoster && !this.isActive) {
                this.isActive = true
                this.currentPage++
                this.listMediaItems(this.album)
            }
        },
        goBack() {
            if (!this.atBeginningOfRoster && !this.isActive) {
                this.isActive = true
                this.currentPage--
                this.listMediaItems(this.album)
            }
        },
        closeModal() {
            this.isModalOpen = false
        },
        // playSlideshow
        // applyEffects
        selectAlbum(album) {
            this.getAlbum(album)
                .then(this.listMediaItems)
        },
        getAlbum(album) {
            // Returns a detailed graph for media items
            // TODO repair cache by moving initialization parameters to a Store

            return fetch("/api/album/" + album.id + "/", {
                method: "GET"
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
                    this.album = data
                    return this.album
                })
                .catch((error) => {
                    console.log(error)
                })
        },
        listMediaItems(album) {
            let cachedPage = this.pageCache[this.currentPage]
            if (cachedPage) {
                this.currentRoster = cachedPage
                // TODO: fix this to not rerun requests
            }

            fetch("/api/album/" + album.id + "/media/?page=" + this.currentPage, {
                method: "GET"
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
                    // NOTE insert Store here
                    this.pageCache[this.currentPage] = data.results
                    this.currentRoster = this.pageCache[this.currentPage]
                    this.atBeginningOfRoster = (data.previous === null)
                    this.atEndOfRoster = (data.next === null)
                    this.isActive = false
                })

                .catch((error) => {
                    console.log(error)
                    this.isActive = false
                })
        }
    }
}
</script>

<style lang="scss">
@import "../classicTheme.scss";


.gallery-preview {
    display: block;
    position: relative;
    width: 90%;
    left: 5%;
    top: 82%;
    margin: 0;

    .preview-container {
        position: relative;
        display: inline-block;
        left: 5rem;
        right: 5rem;
        top: 0;
    }
}

// This animation doesn't work
@keyframes slideup {
    from {
        margin-bottom: 100%; 
    }
    
    to {
        margin-bottom: 30%;
    }
}

/* @keyframes expand { */
/*     from { */

/*     } */

/*     to { */

/*     } */

/* } */

</style>
