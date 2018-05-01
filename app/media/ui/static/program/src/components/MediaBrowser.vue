<template>
    <Modal :isOpen="isModalOpen" :onClose="closeModal" :titleProps="titleProps"> <!-- position="left" -->
        <div slot="title" slot-scope="{ slotProps }">
            <modal-toolbar :buttons="leftToolbarButtons" />
            <label class="modal-title-text">
                {{slotProps.title}}
            </label>
        </div>

        <div class="gallery-photo-view">
            <div v-if="!currentMediaItem.id">Nothing to show.</div>
        </div>

        <div class="gallery-preview" @play="playSlideshow" @nextPhoto="nextPhoto" @prevPhoto="prevPhoto">
            <div @click="goBack" :class="{ disabled: atBeginningOfRoster }" class="go-back ion-ios-arrow-back"></div>
            <div class="preview-container">
                <media-grid-item v-for="mediaItem in currentRoster" :media="mediaItem"/>
            </div>
            <div @click="goForward" :class="{ disabled: atEndOfRoster }" class="go-forward ion-ios-arrow-forward"></div>
        </div>
    </Modal>
</template>

<script>
import MediaGridItem from './MediaGridItem'
import Modal from './Gui/Modal/Modal'
import ModalToolbar from './Gui/Modal/ModalToolbar'
import ModalToolbarItem from './Gui/Modal/ModalToolbarItem'
import {AlbumCollection, AlbumModel} from '../models/Album.js'

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
            album: {
                title: ""
            },
            mediaItems: [],
            // TODO put this in a Store
            pageCache: {},
            gallery: {},
            currentMediaItem: {
                id: null
            },
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
    computed: {
        titleProps() {
            return {
                title: this.album.title
            }
        }
    },
    methods: {
        initialState() {
            this.mediaItems = []
            this.currentRoster = []
            this.pageCache = {}
        },
        nextPhoto() {

        },
        prevPhoto() {

        },
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
                this.listMediaItems()
            }
        },
        goBack() {
            if (!this.atBeginningOfRoster && !this.isActive) {
                this.isActive = true
                this.currentPage--
                this.listMediaItems()
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
            return AlbumCollection.get(album.id)
                .then((data) => {
                    this.album = data
                })
                .catch((error) => {
                    console.log(error)
                })
        },
        listMediaItems() {
            let cachedPage = this.pageCache[this.currentPage]
            if (cachedPage) {
                this.currentRoster = cachedPage
                // TODO: fix this to not rerun requests
            }

            AlbumModel.listItems(this.album.id, this.currentPage)
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

.gallery-photo-view {
    height: 85%;
}

.gallery-preview {
    display: flex;
    position: relative;
    margin: 0;
    min-height: 100px;

    .preview-container {
        position: relative;
        display: flex;
        justify-content: space-between;
        //left: 6rem;
        width: calc(100% - 12rem);
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
