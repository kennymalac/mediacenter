<template>
    <div v-if="isModalOpen" class="media-modal-view">
        <div class="modal-title">
            <!-- position="left" -->

            <modal-toolbar :buttons="leftToolbarButtons"/>

            <label v-if="album.title">
                {{album.title}}
            </label>

            <modal-toolbar-item class="close-btn" :icon-class="'ion-md-close'" :action="closeModal" />
            <hr/>
        </div>
        <div class="modal-content" @play="playSlideshow" @nextPhoto="nextPhoto" @prevPhoto="prevPhoto">
            <div class="gallery-photo-view">
                <div v-if="photo">Nothing to show.</div>
            </div>

            <div class="gallery-preview">
                <div v-on:click="goBack" v-bind:class="{ disabled: atBeginningOfRoster }" class="go-back ion-ios-arrow-back"></div>
                <div class="preview-container">
                    <media-grid-item v-for="mediaItem in currentRoster" :media="mediaItem"/>
                </div>
                <div v-on:click="goForward" v-bind:class="{ disabled: atEndOfRoster }" class="go-forward ion-ios-arrow-forward"></div>
            </div>
        </div>
    </div>
</template>

<script>
import MediaGridItem from './MediaGridItem'
import ModalToolbar from './Gui/Modal/ModalToolbar'
import ModalToolbarItem from './Gui/Modal/ModalToolbarItem'

export default {
    name: 'media-browser',
    components: {
        MediaGridItem,
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
        nextPhoto() {
            //t
            //this.currentPhoto = photo.next().value
        },
        prevPhoto() {
            //why don't js iterators do previous???
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

<style scoped lang="scss">
.media-modal-view {
    border-radius: 3px/2px;
    display: block;
    position: absolute;
    border: 2px solid #001f3f;
    width: 85%;
    height: 50rem;
    margin-left: 7.5%;
    margin-right: 7.5%;
    box-sizing: content-box; 
    animation-name: slideup;

    .modal-title {
        width: 100%;
        height: 2.75rem;
        display: block;
        text-align: center;
        background: linear-gradient(180deg, #001f3f, rgba(52, 73, 94,1.0));
        color: #DDDDDD;

        .toolbar {
            display: inline-block;
            position: absolute;
            left: 10rem;
        }
        /* &.label { */
        /* } */
        .close-btn {
            position: absolute;
            right: 0;
        }
    }
    /* alternative color: rgba(52, 73, 94,1.0)*/

    .go-back, .go-forward {
        &:active {
            color: #26619C; /*#34497d;*/
            /*linear-gradient(18deg, #001f3f, rgba(52, 73, 94,1.0));*/
        }

        &.disabled {
            color: rgb(127, 140, 141);
            cursor: default;
        }

        display: inline-block;
        position: absolute;
        text-align: center;
        top: 20%;
        width: 2.25rem;
        font-size: 3.5rem;
        cursor: pointer;
        color: rgb(52, 73, 94);
    }

    .go-back {
        /*margin-right: 4rem;*/
        left: 2rem;
    }

    .go-forward {
        /*margin-left: 4rem;*/
        right: 2rem;
    }
}
/* .media-modal-view .modal-title label { */
/*     // silver */
/*     // alternative color: rgba(236, 240, 241,1.0); */
/* } */

/* /\* pictogram.type *\/ */
/* pictogram.photo { */
/*  /\* icon = photo *\/ */
/* } */

/* pictogram.video { */
/*  /\* icon = camcorder *\/ */
/* } */




.media-modal-view {
    .modal-content {
        display: block;
        height: 94%;
        background-color: rgb(236, 240, 241)/*rgba(149, 165, 166,1.0)*/;
    }
    hr {
        width: 90%;
        border: 0;
        margin-left: 5%;
        margin-top: 1rem;
        height: 1px;
        /* transparent gray to blueish light gray */
        background: linear-gradient(135deg, rgba(221, 221, 221, 0), rgba(236, 240, 241,1.0), rgba(221, 221, 221, 0));
    }
}

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
