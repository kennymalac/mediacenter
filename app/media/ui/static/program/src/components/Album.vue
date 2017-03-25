<template>
    <div class="pure-u-1-1">
        <h1 v-if="action.manage">
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
    props: ['id', 'action'],
    components: {
        AlbumMediaItemUploadGridItem,
        FileUpload
    },
    data() {
        return {
            actions: {
                list: this.action === "list",
                manage: this.action === "manage",
                create: this.action === "create"
            },
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
    // computed: {
    //     actions() {
    //         return {
    //             list: this.action === "list",
    //             manage: this.action === "manage",
    //             create: this.action === "create"
    //         }
    //     }
    // },
    mounted() {
        //router.replace('manage/:id')
        if (this.id !== null) {
            this.album.id = this.id
        }
    },
    methods: {
        createAlbum() {
            // this won't add mediaitems, and it defnitely will not
            // work for created items
            // createAtlbum does not upload mediaitems
            return fetch("/api/album/create/", {
                method: "POST",
                data: this.album
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
        manageAlbum() {
            return fetch("/api/album/" + this.album.id + "/", {
                method: "PUT",
                data: this.album
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
        addNewMediaItem(item) {
            console.log('adding media item', this.mediaItems)
            this.mediaItems.push({id: this.mediaItems.length, file: item})
        },
        save() {
            for (let tag of this.album.tags_raw.split(',')) {
                if (tag.length > 0) {
                    this.album.tags.push(tag)
                }
            }

            if (this.actions.manage) {
                this.manageAlbum().then((data) => {
                    console.log(data)
                })
            }
            else if (this.actions.create) {
                this.createAlbum().then((data) => {
                    console.log(data)
                    router.replace('/album/' + data.id + '/manage')
                    // Ready to upload media items
                })
            }
        }
    }
}
</script>
