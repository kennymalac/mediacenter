<template>
    <div class="album-interface">
        <div class="album-list" v-if="actions.list">
            <action-button link="/album/create" icon="ion-ios-albums" extraIcon="ion-md-add-circle" title="Create an Album" />
            <div class="album-item-list">
                <album-grid-item v-for="album in objects" @albumSelected="modifyAlbum" :album="album.instance" btnText="Edit" />
            </div>
        </div>

        <h1 v-if="actions.manage">
            Edit Album: {{instance.title }}
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
                <input class="stack" name="title" v-model="instanceForm.title" type="text" />
                <label class="stack" for="description">Description</label>
                <textarea class="stack" name="description" v-model="instanceForm.description" />
                <label class="stack" for="">Tags</label>
                <input class="stack" name="tags" v-model="instanceForm.tags_raw" type="text" />
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
import {AlbumModel} from "../models/Album.js"
import {albums, accounts, activeUser} from "../store.js"

import RestfulComponent from "./RestfulComponent"
import AlbumGridItem from "./AlbumGridItem"
import AlbumMediaItemUploadGridItem from "./AlbumMediaItemUploadGridItem"
import FileUpload from "./FileUpload"
import ActionButton from "./ActionButton"
import router from "../router/index.js"

export default {
    mixins: [RestfulComponent],
    components: {
        AlbumGridItem,
        AlbumMediaItemUploadGridItem,
        FileUpload,
        ActionButton
    },
    data() {
        return {
            instance: AlbumModel.initialState,
            instanceForm: { owner: {} },
            mediaItems: [],
            album_tags_raw: ''
        }
    },
    methods: {
        initialState() {
            this.instance = AlbumModel.initialState
            this.instanceForm = { owner: {} }
            this.mediaItems = []
        },

        async create() {
            this.instanceForm = AlbumModel.getNewInstance()

            const owner = await activeUser()
            this.instanceForm.owner = owner.details.id
        },

        async manage(params) {
            const owner = await accounts()
            this.instance = await this.showInstance(params.id, 'album/list', albums, { owner })
            this.instanceForm = this.instance.getForm()
        },

        async list(params) {
            const store = await albums()
            this.objects = store.values
        },

        async createAlbum() {
            // this won't add mediaitems, and it definetly will not
            // work for created items
            // createAlbum does not upload mediaitems
            const [owner, albumCollection] = await Promise.all(
                [accounts(), albums()]
            )

            try {
                this.instance = await albumCollection.create(this.instanceForm, { owner })
                return this.instance
            }
            catch (error) {
                console.log(error)
            }
        },
        async manageAlbum() {
            const owner = await accounts()

            return AlbumModel.manage(this.instance, this.instanceForm, {
                owner
            })
                .then((data) => {
                    this.instance = data
                })
                .catch((error) => {
                    console.log(error)
                })
        },
        modifyAlbum(album) {
            router.push('/album/' + album.id + "/manage")
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

            return AlbumModel.upload(this.instance.id, form)
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
                    this.instance.tags.push(tag)
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
                this.createAlbum().then(data => this.$nextTick(() => {
                    router.replace('/album/' + data.id + '/manage')
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
