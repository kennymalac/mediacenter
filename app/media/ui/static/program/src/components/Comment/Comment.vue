<template>
    <div class="comment-container">
        <template v-if="actions.list && (contentObjectId || profileId)">
            <section class="comments">
                <div class="comment-list">
                    <comment @created="created" :parent="resolvedParent" :contentObjectId="contentObjectId" :profileId="profileId" action="create" />
                    <comment-list @reply="reply" :activeUserId="activeUserId" :contentObjectId="contentObjectId" :profileId="profileId" :items="objects" />
                </div>
            </section>
        </template>
        <template v-if="actions.create || actions.manage">
            <form class="main-form" @submit.prevent="save">
                <fieldset>
                    <label v-if="parent.id && parent.owner.id !== -1">Reply to: {{ parent.owner.profile.display_name }}</label>
                    <label v-if="parent.id && parent.owner.id === -1">Reply to: Anonymous</label>

                    <textarea class="stack" name="text" v-model="instanceForm.text" />

                    <label class="stack">
                        <input v-model="instanceForm.is_anonymous" name="is_anonymous" type="checkbox">
                        <span class="checkable">Post Anonymously</span>
                    </label>

                    <input v-if="actions.create && parent.id" class="stack" type="submit" value="Reply" />
                    <input v-if="actions.create && !parent.id" class="stack" type="submit" value="Create" />
                    <input v-if="actions.manage" class="stack" type="submit" value="Save changes" />
                </fieldset>
            </form>
        </template>
    </div>
</template>

<script>
import RestfulComponent from "../RestfulComponent"

import {comments, profileComments, activeUser} from "../../store.js"
import activeUserDeps from "../../dependencies/activeUser.js"
import commentDeps from "../../dependencies/Comment.js"
// import {CommentModel, ProfileCommentModel} from "../../models/Comment.js"

import CommentItem from './CommentItem'
import CommentList from './CommentList'

import router from "../../router/index.js"

export default {
    name: 'comment',
    mixins: [RestfulComponent],
    props: {
        contentObjectId: {
            type: [Number, String],
            required: false
        },
        profileId: {
            type: [Number, String],
            required: false
        },
        parent: {
            type: Object,
            default: () => { return { id: null } }
        }
    },
    components: {
        CommentItem,
        CommentList
    },
    data() {
        return {
            objectName: 'comment',
            instanceForm: { },
            resolvedParent: { id: null },
            activeUserId: 0
        }
    },
    computed: {
        collection() {
            return this.profileId
                ? profileComments
                : comments
        },
        parentNestedId() {
            return this.profileId
                ? this.profileId
                : this.contentObjectId
        }
    },
    methods: {
        initialState() {
            this.instance = { id: null, content_item: { feeds: [] } }
            this.instanceForm = { text: "" }
        },

        showUserProfile(id) {
            router.push(`/profile/${id}/details`)
        },

        reply(comment) {
            this.resolvedParent = comment
        },

        async create() {
            await this.collection()
            if (!this.profileId) {
                this.instanceForm.content_item = {}
            }
        },

        async manage(params) {
            const fallthrough = this.parent.id ? `/comment/${this.parent.id}/details` : `/feed/list`

            this.instance = await this.showInstance(params.id, fallthrough, this.collection, await commentDeps())
            this.instanceForm = this.instance.getForm()
        },

        async list(params) {
            const user = await activeUser()
            this.activeUserId = user.details.id

            const store = await this.collection()
            this.objects = store.values.filter((item) => {
                return this.parent.id ? item.parent === this.parent.id : item.content_item === this.contentObjectId || item.user_profile === this.profileId
            })
            if (this.objects.length === 0) {
                this.objects = await store.list(this.parentNestedId, {}, await commentDeps())
            }
        },

        async manageComment() {
            const collection = await this.collection()
            return collection.manage(this.instance, this.instanceForm, await commentDeps())
                .catch((error) => {
                    console.log(error)
                })
        },

        async createComment() {
            const ownerDeps = await activeUserDeps()
            const ownerAccount = ownerDeps.members.getInstance(ownerDeps.owner.details.id, ownerDeps)

            this.instanceForm.owner = ownerAccount

            if (this.parent.id) {
                this.instanceForm.parent = this.parent.id
            }

            try {
                const store = await this.collection()
                const instance = await store.create(this.parentNestedId, this.instanceForm, await commentDeps())
                return instance
            }
            catch (error) {
                console.log(error)
            }
        },

        created(comment) {
            this.objects.push(comment)
        },

        save() {
            if (this.actions.manage) {
                this.manageComment().then(() => {
                    router.go(-1)
                })
            }
            else if (this.actions.create) {
                this.createComment().then(data => this.$nextTick(() => {
                    console.log(data)
                    this.$emit('created', data)
                }))
            }
        }
    }
}
</script>

<style lang="scss">
.comment-container {
    .main-form textarea {
        min-height: 100px;
    }
    section.comments {
        .comment-list {
            height: calc(100vh - 320px);
            overflow: scroll;
        }
    }
}
</style>
