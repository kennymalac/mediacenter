<template>
  <div class="media-modal-view">
    <div class="modal-title">
      <div class="toolbar-icon ion-ios-skip-backward"><a></a></div>
      <div class="toolbar-icon ion-ios-play"><a></a></div>
      <div class="toolbar-icon ion-ios-skip-forward"><a></a></div>
      <div class="toolbar-icon ion-ios-color-wand-outline"><a></a></div>
      <label>Album title</label>
      <div class="toolbar-icon close-btn ion-md-close"><a></a></div>
      <hr>
    </div>
    <div class="modal-content">
      Nothing to show.

      <div class="gallery-preview">
        <div class="ion-ios-arrow-back"></div>
        <div class="preview-container">
        <media-grid-item v-for="mediaItem in mediaItems" :media="mediaItem"/>
        </div>
        <div class="ion-ios-arrow-forward"></div>
      </div>
    </div>
  </div>
</template>

<script>
import MediaGridItem from './MediaGridItem'

export default {
    name: 'media-browser',
    props: ['mediaItems'],
    components: {
        MediaGridItem
    }
}
</script>

<style scoped>
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
}
.media-modal-view .modal-title {
    width: 100%;
    height: 2.75rem;
    display: block;
    text-align: center;
    background: linear-gradient(180deg, #001f3f, rgba(52, 73, 94,1.0));
    color: #DDDDDD;
    // alternative color: rgba(52, 73, 94,1.0)
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

.modal-title .toolbar-icon {
    /*width: 32px;*/
    /*height: 32px;*/
    font-size: 1.5em;
    margin-right: .5em;
    text-align: center;
    display: inline-block;
    position: relative;
    cursor: pointer;
    color: rgb(127, 140, 141);
    top: .25em;
    width: 1.25em;
    height: 1.25em;
    background: linear-gradient(0deg, #001f3f, rgba(52, 73, 94,1.0));
}
.modal-title label {
    
}

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


.modal-title .close-btn {
    position: absolute;
    right: 0;
}

.toolbar-icon:active {
    background: linear-gradient(18deg, #001f3f, rgba(52, 73, 94,1.0));
}

.media-modal-view .modal-content {
    display: block;
    height: 94%;
    background-color: rgb(236, 240, 241)/*rgba(149, 165, 166,1.0)*/;
}

.gallery-preview .ion-ios-arrow-back, .ion-ios-arrow-forward {
    display: inline-block;
    position: absolute;
    text-align: center;
    top: 20%;
    width: 2.25rem;
    font-size: 3.5rem;
    cursor: pointer;
    color: rgba(52, 73, 94,1.0);/*rgb(127, 140, 141);*/
}

.gallery-preview .ion-ios-arrow-back {
    /*margin-right: 4rem;*/
    left: 2rem;
}
.gallery-preview .ion-ios-arrow-forward {
    /*margin-left: 4rem;*/
    right: 2rem;
}

.gallery-preview {
    display: block;
    position: relative;
    width: 90%;
    left: 5%;
    top: 82%;
    margin: 0;
}

.gallery-preview .preview-container {
    position: relative;
    display: inline-block;
    left: 5rem;
    right: 5rem;
    top: 0;
}

.media-modal-view hr {
    width: 90%;
    border: 0;
    margin-left: 5%;
    margin-top: 1rem;
    height: 1px;
    /* transparent gray to blueish light gray */
    background: linear-gradient(135deg, rgba(221, 221, 221, 0), rgba(236, 240, 241,1.0), rgba(221, 221, 221, 0));
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
