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
            <legend>Details</legend>

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

            <div class="pure-control-group">
                <input class="pure-button" type="submit" />
            </div>
            <!-- TODO drag and drop input -->

            <button class="pure-button" v-on:click="createMediaItem">
                Add media
            </button>
            OR
            <file-upload :multiple="true" @fileReady="addNewMediaItem" />


        </form>

        <form class="pure-form">
            <legend>Media Items</legend>
            <album-media-item-upload-grid-item v-for="file in mediaItems" :file="file" :key="file.id"/>
        </form>
    </div>
</template>

<script>
import AlbumMediaItemUploadGridItem from "./AlbumMediaItemUploadGridItem"
import FileUpload from "./FileUpload"
import router from "../router/index.js"

export default {
    components: {
        AlbumMediaItemUploadGridItem,
        FileUpload
    },
    data() {
        return {
            mediaItems: [],
            album: {
                id: null,
                title: '',
                description: '',
                tags_raw: '',
                tags: []
            }
        }
    },
    computed: {
        action() {
            return {
                list: router.action === "list",
                manage: router.action === "manage",
                create: router.action === "create"
            }
        }
    },
    methods: {
        createAlbum() {
            //router.replace('manage/:id')
        },
        addNewMediaItem(item) {
            console.log('adding media item', this.mediaItems)
            //this.$set(this.mediaItems, {id: this.mediaItems.length, file: item}, 0)
            this.mediaItems.push({id: this.mediaItems.length, file: item})
            // if (this.action.manage) {
            //     this.router.id
            // }
            // else if (this.action.create) {
            // }
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
