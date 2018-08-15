<template>
    <div class="image-container">
        <template v-if="actions.details && instance.id">
            <div class="image post">
                <div class="post-header">
                    <div @click="showUserProfile(instance.content_item.owner.profile.id)" class="author">
                        <div class="profile-picture icon-container">
                            <img v-if="instance.content_item.owner.profile.picture" :src="instance.content_item.owner.profile.picture" />
                            <i v-if="!instance.content_item.owner.profile.picture" class="ion-md-person"></i>
                        </div>
                        <div class="author-details">
                            <span class="display-name">{{ instance.content_item.owner.profile.display_name }}</span>
                            <span class="user-title">Sr. Poster</span>
                        </div>
                    </div>
                    <div class="post-details">
                        <span class="title">{{ instance.content_item.title }}</span>
                        <span class="date">{{ instance.content_item.created.format('LLLL') }}</span>
                    </div>
                </div>
                <p class="text">
                    <a :href="instance.image">{{ instance.image }}</a><br />
                    <span v-if="instance.content_item.interests.length">Interests:</span>
                    <tag-list :tags="instance.content_item.interests" tagType="interest" /><br />
                    <p>{{ instance.content_item.description }}</p>

                    <img v-if="instance.src" :src="instance.src" />
                </p>
                <div class="actions" v-if="isActiveUser">
                    <button type="button" @click="editImage">
                        <i class="ion-md-create"></i> Edit
                    </button>
                    <button type="button" class="error">
                        <i class="ion-md-close"></i> Delete
                    </button>
                </div>
            </div>
            <h2 class="align-left">Comments</h2>
            <router-view :contentObjectId="instance.content_item.id" />
        </template>
        <template v-if="actions.manage">
            <form class="main-form" @submit.prevent="save">
                <fieldset>
                    <label class="stack" for="title">Title</label>
                    <input v-model="instanceForm.content_item.title" type="text" name="title" placeholder="Image title" />
                    <label class="stack" for="title">Description</label>
                    <textarea class="stack" v-model="instanceForm.content_item.description" name="description" placeholder="Image description" />
                    <label class="stack" for="image">Image</label>
                    <div v-if="instanceForm.src">
                        <div class="icon-container">
                            <img height="100%" width="100%" :src="instanceForm.src" />
                        </div>
                        <br />
                        <button @click="instanceForm.src = ''" type="button"><i class="ion ion-ios-camera"></i> Reupload</button>
                    </div>
                    <div v-if="!instanceForm.src">
                        <file-upload-container @uploaded="(val) => instanceForm.src = val" :instance="instance" mediaType="image" logUploadUri="" :uploader="uploader" :contentForm="instanceForm" :stashId="stashId" />
                    </div>

                    <label class="stack" for="interests">Interests</label>
                    <interest-select v-model="instanceForm.content_item.interests" />

                    <label class="stack" for="places">Places</label>
                    <place-select v-model="instanceForm.content_item.places" />

                    <input type="submit" class="stack" value="Save changes" />
                </fieldset>
            </form>
        </template>
    </div>
</template>

<script>
import RestfulComponent from "./RestfulComponent"
import {activeUser, images} from '../store.js'
//import {ImageModel} from '../models/Image.js'
import imageDeps from '../dependencies/Link.js'

import Comment from './Comment/Comment'
import InterestSelect from './InterestSelect'
import PlaceSelect from './PlaceSelect'
import TagList from './TagList'
import FileUploadContainer from './FileUploadContainer'
import Uploader from '../fileUpload.js'

import router from "../router/index.js"

export default {
    name: 'content-image',
    mixins: [RestfulComponent],
    props: ['stashId', 'feedId'],
    components: {
        Comment,
        InterestSelect,
        PlaceSelect,
        TagList,
        FileUploadContainer
    },
    data() {
        return {
            objectName: 'image',
            isActiveUser: false,
            instanceForm: { content_item: {} },
            uploader: new Uploader({ baseUrl: "http://localhost:4242" })
        }
    },
    methods: {
        initialState() {
            this.instance = { id: null, content_item: { feeds: [] } }
            this.instanceForm = { content_item: { interests: [] } }
        },

        showUserProfile(id) {
            router.push(`/profile/${id}/details`)
        },

        editImage() {
            router.push(`../../manage`)
        },

        async manage(params) {
            const fallthrough = this.parentId ? `/image/${this.parentId}/details` : `/feed/list`

            this.instance = await this.showInstance(params.id, fallthrough, images, await imageDeps(this.stashId))
            this.instanceForm = this.instance.getForm()
        },

        async details(params) {
            if (!this.params.commentAction) {
                router.replace({
                    path: 'details/comment/list',
                    ...this.params
                })
            }

            this.instance = await this.showInstance(params.id, '/feed/list', images, await imageDeps(this.stashId))
            const user = await activeUser()
            this.isActiveUser = this.instance.content_item.owner.id === user.details.id
        },

        async manageImage() {
            const imagesCollection = await images()
            return imagesCollection.manage(this.instance, this.instanceForm, await imageDeps(this.stashId))
                .catch((error) => {
                    console.log(error)
                })
        },

        save() {
            if (this.actions.manage) {
                this.manageImage().then(() => {
                    router.push(`details`)
                })
            }
        }
    }
}
</script>

<style lang="scss">
.post-details {
    span.title a {
        color: white;
    }
}
.image-container {
    height: calc(100vh - 60px);
    overflow: scroll;
}
</style>
