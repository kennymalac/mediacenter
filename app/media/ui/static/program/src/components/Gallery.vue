import MediaGridItem from 'MediaGridItem';

// The reason media-grid-item is hyphenated is because of lisp.
// This is a fact
<template>
    <div class="error info">Please sign in to view the media gallery.</div>

    <media-grid-item v-for="media-datum in galleryMediaList" v-bind:media="media">
    </media-grid-item>


    <media-browser>
        <media-grid-item>
        </media-grid-item>
    </media-browser>
</template>

<template>

</template>


<script>
 // Dynamic gallery

 function displayPhotos (sources) {
     var img = document.createElement('img');
     //img.src =

 }

 export default {
     data: () => {
         return {
             galleryMediaList: []
         }
     }
 }
</script>

<style scoped>
 .media-content-box {
     animation-duration: 1s;
     animation-name: expand;
 }

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

 .modal-title .ion-play,
 .modal-title .ion-ios-color-wand-outline,
 .modal-title .ion-skip-forward,
 .modal-title .ion-skip-backward {
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

 .gallery-preview .ion-arrow-left-b, .ion-arrow-right-b {
     display: inline-block;
     position: absolute;
     text-align: center;
     top: 20%;
     width: 2.25rem;
     font-size: 3.5rem;
     cursor: pointer;
     color: rgba(52, 73, 94,1.0);/*rgb(127, 140, 141);*/
 }

 .gallery-preview .ion-arrow-left-b {
     /*margin-right: 4rem;*/
     left: 2rem;
 }
 .gallery-preview .ion-arrow-right-b {
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

 .loading-container {
     position: absolute;
     z-index: 1000;
     top: 50%;
     left: 45%;
     height: 12rem;
     width: 10rem;
     background-color: #E4F1FE;
     border: 2px solid rgba(197, 239, 247, .75);
     border-radius: 5px / 7px;
     font-size: 1.2rem;
     text-align: center;
     color: #3591cf;
 }
 .loading-container label {
     display: block;
     margin-top: 10rem;
 }

 /* I gotta separate this loader into a component tho */
 .spinning-whirlpool,
 .spinning-whirlpool::before,
 .spinning-whirlpool::after {
     z-index: 1100;
	   position: absolute;
	   top: 50%;
	   left: 50%;
	   border: 2px solid rgba(204,204,204,0.19);
	   border-left-color: rgb(0,153,255);
	   border-radius: 1499px;
		 -o-border-radius: 1499px;
		 -ms-border-radius: 1499px;
		 -webkit-border-radius: 1499px;
		 -moz-border-radius: 1499px;
 }

 .spinning-whirlpool {
	   margin: -38px 0 0 -38px;
	   height: 75px;
	   width: 75px;
	   animation: cssload-rotate 1400ms linear infinite;
		 -o-animation: cssload-rotate 1400ms linear infinite;
		 -ms-animation: cssload-rotate 1400ms linear infinite;
		 -webkit-animation: cssload-rotate 1400ms linear infinite;
		 -moz-animation: cssload-rotate 1400ms linear infinite;
 }

 .spinning-whirlpool::before {
	   content: "";
	   margin: -35px 0 0 -35px;
	   height: 66px;
	   width: 66px;
	   animation: cssload-rotate 1700ms linear infinite;
		 -o-animation: cssload-rotate 1700ms linear infinite;
		 -ms-animation: cssload-rotate 1700ms linear infinite;
		 -webkit-animation: cssload-rotate 1700ms linear infinite;
		 -moz-animation: cssload-rotate 1700ms linear infinite;
 }

 .spinning-whirlpool::after {
	   content: "";
	   margin: -44px 0 0 -44px;
	   height: 84px;
	   width: 84px;
	   animation: cssload-rotate 2016ms linear infinite;
		 -o-animation: cssload-rotate 2016ms linear infinite;
		 -ms-animation: cssload-rotate 2016ms linear infinite;
		 -webkit-animation: cssload-rotate 2016ms linear infinite;
		 -moz-animation: cssload-rotate 2016ms linear infinite;
 }



 @keyframes cssload-rotate {
	   100% {
		     transform: rotate(360deg);
	   }
 }

 @-o-keyframes cssload-rotate {
	   100% {
		     -o-transform: rotate(360deg);
	   }
 }

 @-ms-keyframes cssload-rotate {
	   100% {
		     -ms-transform: rotate(360deg);
	   }
 }

 @-webkit-keyframes cssload-rotate {
	   100% {
		     -webkit-transform: rotate(360deg);
	   }
 }

 @-moz-keyframes cssload-rotate {
	   100% {
		     -moz-transform: rotate(360deg);
	   }
 }
</style>
