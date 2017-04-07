<template>
    <div class="pure-u-1-1">

        <album-grid-item v-if="actions.list" v-for="album in albums" @albumSelected="modifyAlbum" :album="album"/>

        <h1 v-if="actions.manage">
            Edit Album: {{album.title }}
        </h1>

        <form class="pure-form pure-form-stacked" v-if="actions.manage || actions.create">
           <legend>Settings</legend>

           <div class="pure-control-group">
               <label for="visibility">Visibility (not working)</label>
               <select name="visibility">
                   <option>Public</option>
                   <option>Private</option>
                   <option>Unlisted</option>
               </select>
           </div>

           <button v-if="actions.manage" class="pure-button-error pure-button">
               <i class="ion-md-close"></i>
               Delete Album
           </button>
        </form>

        <form v-on:submit.prevent="save" class="pure-form pure-form-aligned" v-if="actions.manage || actions.create">
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

        <form class="pure-form" v-if="actions.manage || actions.create">
            <legend>Media Items</legend>
            <album-media-item-upload-grid-item v-for="item in mediaItems" :media="item" :key="item.id"/>
        </form>
    </div>
</template>

<script>
import {AlbumCollection} from '../models/Album.js'

import AlbumGridItem from "./AlbumGridItem.vue"
import AlbumMediaItemUploadGridItem from "./AlbumMediaItemUploadGridItem"
import FileUpload from "./FileUpload"
import router from "../router/index.js"
import auth from "../auth.js"

export default {
    props: ['id', 'action'],
    components: {
        AlbumGridItem,
        AlbumMediaItemUploadGridItem,
        FileUpload
    },
    data() {
        return {
            // actions: {
            //     list: this.action === "list",
            //     manage: this.action === "manage",
            //     create: this.action === "create"
            // },
            albums: [],
            mediaItems: [],
            album_tags_raw: '',
            album: {
                id: null,
                title: '',
                description: '',
                tags: []
            }
        }
    },
    computed: {
        actions() {
            return {
                list: this.action === "list",
                manage: this.action === "manage",
                create: this.action === "create"
            }
        }
    },
    watch: {
        '$route'(to, from) {
            this.restAction(to)
        }
    },
    mounted() {
        this.restAction()
    },
    methods: {
        restAction(to) {
            if (!to) {
                to = {params: {action: this.action, id: this.id}}
            }
            if (to.params.action === "create") {
                this.album = {}
            }
            if (to.params.action === "manage") {
                AlbumCollection.get(to.params.id).then((data) => {
                    this.album = data
                })
            }
            else if (to.params.action === "list") {
                AlbumCollection.searchAlbums().then((data) => {
                    this.albums = data
                })
            }
        },
        createAlbum() {
            let headers = {
                "Content-Type": "application/json"
            }
            auth.authenticate(headers)
            // this won't add mediaitems, and it definetly will not
            // work for created items
            // createAtlbum does not upload mediaitems
            return fetch("/api/album/", {
                method: "POST",
                headers: headers,
                body: JSON.stringify({
                    title: this.album.title,
                    description: this.album.description,
                    owner: auth.getActiveUser().details.id
                })
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
            let headers = {
                "Content-Type": "application/json"
            }
            auth.authenticate(headers)
            return fetch("/api/album/" + this.album.id + "/", {
                method: "PUT",
                headers: headers,
                body: JSON.stringify(this.album)
            })
                .then((response) => {
                    if (response.status >= 200 && response.status < 300) {
                        return response.json()
                    }
                    else {
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
        modifyAlbum(album) {
            console.log(album)
            console.log(album.id)
            router.replace('/album/' + album.id + "/manage")
        },
        uploadMediaItems() {
            let headers = {}
            auth.authenticate(headers)

            // Encode the source file as a form
            let form = new FormData()
            for (let media of this.mediaItems) {
                console.log(media.src)
                console.log(media.title)
                console.log(media.description)
                console.log(media.tags)

                form.append("src", media.src)
                form.append("title", media.title)
                form.append("description", media.description)
                form.append("tags", media.tags)
            }

            return fetch("/api/album/" + this.album.id + "/upload/", {
                method: "POST",
                headers: headers,
                body: form
            })
        },
        addNewMediaItem(item) {
            console.log('adding media item', item)
            this.mediaItems.push({
                id: this.mediaItems.length,
                src: item,
                owner: {name: ''},
                title: '',
                description: '',
                tags: []
            })
        },
        save() {
            for (let tag of this.album_tags_raw.split(',')) {
                if (tag.length > 0) {
                    this.album.tags.push(tag)
                }
            }

            if (this.actions.manage) {
                this.manageAlbum().then((data) => {
                    console.log(data)
                })
                // Upload media items after updating album metadata
                this.uploadMediaItems().then((data) => {
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
