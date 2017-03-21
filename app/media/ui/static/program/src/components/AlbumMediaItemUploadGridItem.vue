<template>
    <div class="media-upload-grid-item pure-grid">
        <div class="media-item-header">
            {{media.title}} by {{media.owner.name}}
        </div>

        <div class="pure-u-1-2">
            <img width="230" height="230" :alt="media.title" :src="media.src" class="pure-img" />
        </div>

        <!-- <div class="pure-control-group">
             <label v-if="!media.src" for="file">File</label>
             <label v-if="media.src" for="file">Upload different file</label>
             <input name="file" type="file" />
             </div> -->

        <form class="pure-u-1-2 pure-form pure-form-stacked">
            <div class="pure-control-group">
                <label for="title">Title</label>
                <input class="pure-input" v-model="media.title" type="text" />
            </div>
            <div class="pure-control-group">
                <label for="description">Description</label>
                <input class="pure-input" v-model="media.description" type="text" />
            </div>
            <div class="pure-control-group">
                <label for="tags">Tags</label>
                <input class="pure-input" name="tags" v-model="media.tags_raw" type="text" />
            </div>
        </form>
    </div>
</template>

<script>
export default {
    props: ["file"],
    name: 'album-media-item-upload-grid-item',
    data() {
        return {
            media: {
                src: '',
                owner: {name: ''},
                title: '',
                description: '',
                tags: []
            }
        }
    },
    mounted() {
        console.log('test')
        this.media.src = this.file.file
    },
    methods: {
        parseInputType() {
            // if (this.) {

            // }
        }
    }
}
</script>

<style scoped lang="scss">
.media-upload-grid-item {
    display: inline-block;
    margin: 10px;
    width: 340px;
    height: 415px;
    border: 2px solid #001f3f;
    border-radius: 3px/2px;

    .media-item-header {
        text-align: center;
        display: block;
        font-size: 1.5em;
    }
    .pure-input {
        width: 230px;
    }
}
</style>
