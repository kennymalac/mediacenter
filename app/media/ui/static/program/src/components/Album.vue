<template>
    <div class="album-interface">
        <div class="album-item-list">
            <album-grid-item v-if="actions.list" v-for="album in albums" @albumSelected="modifyAlbum" :album="album"/>
        </div>
        
        <h1 v-if="actions.manage">
            Edit Album: {{album.title }}
        </h1>
        
        <form class="main-form" v-if="actions.manage || actions.create">
            <button type="button" v-if="actions.manage" class="error">
                <i class="ion-md-close"></i>
                Delete Album
            </button>
            
            <fieldset>
                <legend class="stack">Settings</legend>

                <label class="stack" for="visibility">Visibility (not working)</label>
                <select class="stack" name="visibility">
                    <option>Public</option>
                    <option>Private</option>
                    <option>Unlisted</option>
                </select>
            </fieldset>
        </form>
        
        <form class="main-form" @submit.prevent="save" v-if="actions.manage || actions.create">
            <fieldset>
                <legend class="stack">Details</legend>
                <label class="stack" for="title">Title</label>
                <input class="stack" name="title" v-model="album.title" type="text" />
                <label class="stack" for="description">Description</label>
                <textarea class="stack" name="description" v-model="album.description" />
                <label class="stack" for="">Tags</label>
                <input class="stack" name="tags" v-model="album.tags_raw" type="text" />
                <input v-if="actions.create" class="stack" type="submit" value="Create" />
                <input v-if="actions.manage" class="stack" type="submit" value="Save changes" />
            </fieldset>
            <!-- TODO drag and drop input -->
            
            <button type="button" @click="addMediaItem">
                Add media
            </button>
            OR
            <file-upload :multiple="true" @fileReady="uploadMediaItem" />
        </form>
        
        <form v-if="actions.manage || actions.create" class="album-item-editor">
            <fieldset>
                <legend>Media Items</legend>
                <div class="album-item-list">
                    <album-media-item-upload-grid-item v-for="item in mediaItems" :media="item" :key="item.id" />
                </div>
            </fieldset>
        </form>
    </div>
</template>

<script>
import {AlbumCollection, AlbumModel} from '../models/Album.js'

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
            album: AlbumModel.initialState,
            albums: [],
            mediaItems: [],
            album_tags_raw: ''
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
        initialState() {
            this.album = AlbumModel.initialState
            this.mediaItems = []
        },
        restAction(to) {
            this.initialState()
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
            // this won't add mediaitems, and it definetly will not
            // work for created items
            // createAlbum does not upload mediaitems
            return AlbumCollection.create({
                title: this.album.title,
                description: this.album.description,
                owner: auth.getActiveUser().details.id
            })
                .then((data) => {
                    this.album = data
                })
                .catch((error) => {
                    console.log(error)
                })
        },
        manageAlbum() {
            return AlbumModel.manage(this.album)
                .then((data) => {
                    this.album = data
                })
                .catch((error) => {
                    console.log(error)
                })
        },
        modifyAlbum(album) {
            router.replace('/album/' + album.id + "/manage")
        },
        uploadMediaItems() {
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
            
            return AlbumModel.upload(this.album.id, form)
        },
        addMediaItem() {
            // console.log('adding media item', item)
            this.mediaItems.push({
                id: this.mediaItems.length,
                owner: {name: ''},
                title: '',
                description: '',
                tags: []
            })
        },
        uploadMediaItem(item) {
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
                this.createAlbum().then(this.$nextTick(() => {
                    router.replace('/album/' + this.album.id + '/manage')
                    // Ready to upload media items
                }))
            }
        }
    }
}
</script>

<style lang="scss">
.album-interface {
    display: flex;
    flex-direction: column;
    align-items: center;
    
    .main-form {
        width: 480px;
    }
    
    .album-item-list {
        display: flex;
        margin-top: 10px;
    }
    .album-item-editor {
        width: auto;
        max-width: 1024px;
        fieldset {
            width: 100%;
        }
        .album-item-list {
            display: block;
        }
    }
}
</style>
