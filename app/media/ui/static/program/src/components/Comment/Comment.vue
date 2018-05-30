<template>
    <div class="feed-container">
        <template v-if="actions.list && contentObjectId">
            <section class="comments">
                <comment :contentObjectId="contentObjectId" action="create" />
                <comment-list :contentObjectId="contentObjectId" :items="comments" />
            </section>
        </template>
        <template v-if="actions.create || actions.manage">
            <form class="main-form" @submit.prevent="save">
                <fieldset>
                    <textarea class="stack" name="text" v-model="instanceForm.text" />

                    <input v-if="actions.create" class="stack" type="submit" value="Reply" />
                    <input v-if="actions.manage" class="stack" type="submit" value="Save changes" />
                </fieldset>
            </form>
        </template>
    </div>

</template>

<script>
import RestfulComponent from "../RestfulComponent"

import {comments} from "../../store.js"
import activeUserDeps from "../../dependencies/activeUser.js"
import commentDeps from "../../dependencies/Comment.js"
import {CommentModel} from "../../models/Comment.js"

import CommentItem from './CommentItem'
import CommentList from './CommentList'

import router from "../../router/index.js"

export default {
    name: 'comment',
    mixins: [RestfulComponent],
    props: ['contentObjectId', 'parentId'],
    components: {
        CommentItem,
        CommentList
    },
    computed: {
        comments() {
            return this.objects.filter((item) => {
                return item.parent === this.instance.id
            })
        }
    },
    data() {
        return {
            objectName: 'comment',
            instanceForm: { }
        }
    },
    methods: {
        initialState() {
            this.instance = { id: null, content_item: { feeds: [] } }
            this.instanceForm = { content_item: {}, text: "" }
        },

        editComment(id) {
            router.push(`../${id}/manage`)
        },

        showUserProfile(id) {
            router.push(`/profile/${id}/details`)
        },

        minimizeComment() {

        },

        async create() {
            await comments()
            if (this.parentTitle) {
                this.instanceForm = {...this.instanceForm, content_item: {...this.instanceForm.content_item, title: `Re: ${this.parentTitle}`}}
            }
        },

        async manage(params) {
            const fallthrough = this.parentId ? `/comment/${this.parentId}/detail` : `/feed/list`

            this.instance = await this.showInstance(params.id, fallthrough, comments, await commentDeps())
            this.instanceForm = this.instance.getForm()
        },

        async list(params) {
            const store = await comments()
            if (store.values.length === 0) {
                this.objects = await store.list(this.contentObjectId, {}, await commentDeps())
                return
            }
            this.objects = store.values
        },

        async manageComment() {
            return CommentModel.manage(this.instance, this.instanceForm, await commentDeps())
                .catch((error) => {
                    console.log(error)
                })
        },

        async createComment() {
            const ownerDeps = await activeUserDeps()
            const ownerAccount = ownerDeps.members.getInstance(ownerDeps.owner.details.id, ownerDeps)

            this.instanceForm.owner = ownerAccount

            if (this.parentId) {
                this.instanceForm.parent = this.parentId
            }

            try {
                const instance = await this.$store.comments.create(this.contentObjectId, this.instanceForm, await commentDeps())
                return instance
            }
            catch (error) {
                console.log(error)
            }
        },

        save() {
            if (this.actions.manage) {
                this.manageComment().then(() => {
                    router.go(-1)
                })
            }
            else if (this.actions.create) {
                this.createComment().then(data => this.$nextTick(() => {
                }))
            }
        }
    }
}
</script>

<style lang="scss">
.main-form textarea {
    min-height: 100px;
}
</style>
