<template>
    <div class="media-upload-grid-item flex">
        <div class="media-item-header">
            {{media.title}} by {{media.owner.name}}
        </div>
        
        <div>
            <img v-if="media.src" width="230" height="230" :alt="media.title" :src="media.src" class="pure-img" />
            <div class="default-preview" v-if="!media.src">
                <i class="ion-ios-image"></i>
            </div>
        </div>

        <!-- <div class="pure-control-group">
             <label v-if="!media.src" for="file">File</label>
             <label v-if="media.src" for="file">Upload different file</label>
             <input name="file" type="file" />
             </div> -->

        <form>
            <fieldset class="flex one">
                <label for="title">Title</label>
                <input name="title" v-model="media.title" type="text" />
                <label for="description">Description</label>
                <input name="description" v-model="media.description" type="text" />
                <label for="tags">Tags</label>
                <input name="tags" v-model="media.tags_raw" type="text" />
            </fieldset>
        </form>
    </div>
</template>

<script>
export default {
    props: ["media"],
    name: 'album-media-item-upload-grid-item',
    // data() {
    //     return {
    //         media: {
    //             src: '',
    //             owner: {name: ''},
    //             title: '',
    //             description: '',
    //             tags: []
    //         }
    //     }
    // },
    // mounted() {
    //     this.media.src = this.media.src
    // },
    methods: {
        parseInputType() {
            // if (this.) {

            // }
        }
    }
}
</script>

<style lang="scss">
.media-upload-grid-item {
    display: inline-block;
    vertical-align: top;
    margin: 1rem;
    width: 340px;
    min-height: 415px;
    border: 2px solid #001f3f;
    border-radius: 3px/2px;

    .media-item-header {
        text-align: center;
        display: block;
        font-size: 1.5em;
    }
    input {
        width: 230px;
        margin: auto;
    }
    .default-preview {
        height: 230px;
        height: 230px;
        i { font-size: 10rem; }
    }
}
</style>
