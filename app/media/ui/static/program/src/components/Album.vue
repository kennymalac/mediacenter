<template>
    <div class="pure-u-1-1">
        <h1 v-if="isManage">
            Edit Album: {{album.title }}
        </h1>

        <form class="pure-form pure-form-stacked">
           <legend>Settings</legend>

           <div class="pure-control-group">
               <label for="visibility">Visibility (not working)</label>
               <select name="visibility">
                   <option>Public</option>
                   <option>Private</option>
                   <option>Unlisted</option>
               </select>
           </div>

           <button v-if="isManage" class="pure-button-error pure-button">
               <i class="ion-md-close"></i>
               Delete Album
           </button>
        </form>

        <form v-on:submit.prevent="save" class="pure-form pure-form-aligned">
            <legend>Media Items</legend>

            <div class="pure-control-group">
                <label for="title">Title</label>
                <input name="title" v-model="album.title" type="text" />
            </div>
            <div class="pure-control-group">
                <label for="description">Description</label>
                <input name="description" v-model="album.description" type="text" />
            </div>
            <div class="pure-control-group">
                <label for="">Tags</label>
                <input name="tags" v-model="album.tags_raw" type="text" />
            </div>

            <!-- TODO drag and drop input -->

            <button class="pure-button" v-on:click="createMediaItem">
                Add media
            </button>
            OR
            <input v-on:upload="uploadMediaItems" type="file" multiple />

    <album-media-item-upload-grid-item v-for="mediaItem in album.media" />

            <input class="pure-button" type="submit" />
        </form>
    </div>
</template>

<script>
import AlbumMediaItemUploadGridItem from "./AlbumMediaItemUploadGridItem"
//import router from "../router/index.js"

export default {
    components: {
        AlbumMediaItemUploadGridItem
    },
    data() {
        return {
            isManage: true, // router.props.action === 'manage',
            album: {
                id: null,
                title: '',
                description: '',
                tags_raw: '',
                tags: []
            }
        }
    },
    methods: {
        createAlbum() {
            //router.replace('manage/:id')
        },
        createMediaItem() {
            // TODO refactor this!!!
            // createElement(AlbumMediaItemUploadGridItem, {
            //     attrs: [
            //         class: ['pure-control-group']
            //     ],
            // });
        },
        uploadMediaItems() {
            
        },
        save() {
            for (let tag of this.album.tags_raw.split(',')) {
                if (tag.length > 0) {
                    this.album.tags.push(tag)
                }
            }
        }
    }
}
</script>
