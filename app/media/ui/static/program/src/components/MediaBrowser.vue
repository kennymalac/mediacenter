<template>
    <div class="media-modal-view">
        <div class="modal-title">
            <!-- position="left" -->

            <modal-toolbar :buttons="leftToolbarButtons"/>

            <label>
                Album title
            </label>

            <modal-toolbar-item class="close-btn" :icon-class="'ion-md-close'" />
            <hr/>
        </div>
        <div class="modal-content">
            Nothing to show.

            <div class="gallery-preview">
                <div class="go-back ion-ios-arrow-back"></div>
                <div class="preview-container">
                    <media-grid-item v-for="mediaItem in currentRoster" :media="mediaItem"/>
                </div>
                <div class="go-forward ion-ios-arrow-forward"></div>
            </div>
        </div>
    </div>
</template>

<script>
import _ from 'lodash'
import MediaGridItem from './MediaGridItem'
import ModalToolbar from './Gui/Modal/ModalToolbar'
import ModalToolbarItem from './Gui/Modal/ModalToolbarItem'

export default {
    name: 'media-browser',
    props: ['mediaItems'],
    components: {
        MediaGridItem,
        ModalToolbar,
        ModalToolbarItem
    },
    data() {
        return {
            // 
            mediaItems: [],
            currentRoster: [],
            currentPage: 0,
            leftToolbarButtons: [
                {
                    icon: "ion-ios-skip-backward",
                    action() {
                        // Go back a photo
                    }
                },
                {
                    icon: "ion-ios-play",
                    action() {
                        // Play a slideshow
                    }
                },
                {
                    icon: "ion-ios-skip-forward",
                    action() {
                        // Go forward in the album
                    }
                },
                {
                    icon: "ion-ios-color-wand-outline",
                    action() {
                        // Apply effects to this photo
                        // Slideshow has to be paused
                    }
                }
            ]
        }
    },
    methods: {
        // playSlideshow
        // goBack
        // goForward
        // applyEffects
        searchMedia(media) {
            var params = {}
            // Fetches available media
            if (!this.auth.privilegeLevel === "guest") {
                params.accessLevel = "public"
            }
            // TODO this is an authorized request
            fetch("/api/album/media/", {
                method: "GET",
                data: _.extend({
                    user: this.auth.user.id
                }, params)
            })
            .then(() => {
                // 
            })
        },
        getMedia(media) {
            // Returns a detailed graph for media items

            fetch("/api/album/media/" + media.id + "?page=" + this.currentPage, {
                method: "GET",
                data: {
                    id: media.id
                }
            })
            .then((data) => {
                this.availableMedia = data.json()
                //this.
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
        /* &.label { */
        /* } */
        .close-btn {
            position: absolute;
            right: 0;
        }
    }
    /* alternative color: rgba(52, 73, 94,1.0)*/
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


.modal-title .ion-ios-play,
.modal-title .ion-ios-color-wand-outline,
.modal-title .ion-ios-skip-forward,
.modal-title .ion-ios-skip-backward {
    color: white;
}

/* .ion-play { */
/*     left: 3.5em; */
/* } */

/* .ion-ios-color-wand-outline { */
/*     left: 5.25em; */
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

    .ion-ios-arrow-back, .ion-ios-arrow-forward {
        display: inline-block;
        position: absolute;
        text-align: center;
        top: 20%;
        width: 2.25rem;
        font-size: 3.5rem;
        cursor: pointer;
        color: rgba(52, 73, 94,1.0);/*rgb(127, 140, 141);*/
    }

    .ion-ios-arrow-back {
        /*margin-right: 4rem;*/
        left: 2rem;
    }

    .ion-ios-arrow-forward {
        /*margin-left: 4rem;*/
        right: 2rem;
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
