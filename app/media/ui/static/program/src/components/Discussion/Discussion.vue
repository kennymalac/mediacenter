<template>
    <div class="feed-container">
        <template v-if="actions.details && instance.id">
            <section class="posts">

                <post v-bind="instance.instance" @editPost="editPost(instance.id)" @userProfile="showUserProfile(instance.content_item.owner.profile.id)" />
                <post v-for="post in posts" v-bind="post.instance" @editPost="editPost(post.id)" @userProfile="showUserProfile(instance.content_item.owner.profile.id)" />

                <h3>Quick Reply</h3>
                <discussion :stashId="stashId" :feedId="feedId" :parentId="instance.id" :parentTitle="instance.content_item.title" action="create" />
            </section>
        </template>
        <template v-if="actions.create || actions.manage">
            <form class="main-form" @submit.prevent="save">
                <fieldset>
                    <label class="stack" for="title">Title</label>
                    <input class="stack" name="title" v-model="instanceForm.content_item.title" type="text" />
                    <label v-if="!parentId && !instance.parent" class="stack" for="description">Description</label>
                    <textarea v-if="!parentId && !instance.parent" class="stack" name="description" v-model="instanceForm.content_item.description" />

                    <label class="stack" for="text">Contents</label>
                    <textarea class="stack" name="text" v-model="instanceForm.text" />

                    <!-- <label class="stack" for="">Tags</label> -->
                    <!-- <input class="stack" name="tags" v-model="instance.tags_raw" type="text" /> -->
                    <input v-if="actions.create && !parentId" class="stack" type="submit" value="Create" />
                    <input v-if="actions.create && parentId" class="stack" type="submit" value="Reply" />
                    <input v-if="actions.manage" class="stack" type="submit" value="Save changes" />
                </fieldset>
            </form>
        </template>
    </div>

</template>

<script>
import RestfulComponent from "../RestfulComponent"
import {activeUser, discussions, accounts, stashes, profiles, feedContentTypes} from "../../store.js"
import {DiscussionModel} from "../../models/Discussion.js"
import Post from './Post'

import router from "../../router/index.js"

export default {
    name: 'discussion',
    mixins: [RestfulComponent],
    props: ['stashId', 'feedId', 'parentId', 'parentTitle'],
    components: {
        Post
    },
    computed: {
        discussionLink() {
        },
        posts() {
            return this.objects.filter((item) => {
                return item.parent === this.instance.id
            })
        }
    },
    data() {
        return {
            objectName: 'discussion',
            instanceForm: { content_item: {} }
        }
    },
    methods: {
        initialState() {
            this.instance = { id: null, content_item: { feeds: [] } }
            this.instanceForm = { content_item: {} }
        },

        editPost(id) {
            router.push(`../${id}/manage`)
        },

        showUserProfile(id) {
            router.push(`/profile/${id}/details`)
        },

        async create() {
            await discussions()
            if (this.parentTitle) {
                this.instanceForm.content_item.title = `Re: ${this.parentTitle}`
            }
        },

        async dependencies() {
            const [owner, stashCollection, contentTypeCollection, profileCollection] = await Promise.all(
                [accounts(), stashes(), feedContentTypes(), profiles()]
            )
            const stash = await stashCollection.getInstance(this.stashId)

            return {
                owner,
                content_item: stash.collections.content,
                content_type: contentTypeCollection,
                content_types: contentTypeCollection,
                profile: profileCollection
            }
        },

        async manage(params) {
            const fallthrough = this.parentId ? `/discussion/${this.parentId}/detail` : `/feed/list`

            this.instance = await this.showInstance(params.id, fallthrough, discussions, await this.dependencies())
            this.instanceForm = this.instance.getForm()
        },

        async details(params) {
            this.instance = await this.showInstance(params.id, '/feed/list', discussions, await this.dependencies())
        },

        async manageDiscussion() {
            return DiscussionModel.manage(this.instance, this.instanceForm, await this.dependencies())
                .catch((error) => {
                    console.log(error)
                })
        },

        async createDiscussion() {
            const user = await activeUser()
            this.instanceForm.content_item.owner = user.details.id
            if (this.parentId) {
                this.instanceForm.parent = this.parentId
            }

            const stashCollection = await stashes()
            if (this.stashId) {
                // TODO replies can be stored on specific stashes
                // via pubsub
                this.instanceForm.stash = await stashCollection.getInstance(this.stashId)
            }
            this.instanceForm.feed = this.feedId

            try {
                const instance = await this.$store.discussions.create(this.instanceForm, await this.dependencies())
                // TODO owner model??
                instance.content_item.owner = user.details
                return instance
            }
            catch (error) {
                console.log(error)
            }
        },

        save() {
            if (this.actions.manage) {
                this.manageDiscussion().then(() => {
                    router.go(-1)
                })
            }
            else if (this.actions.create) {
                this.createDiscussion().then(data => this.$nextTick(() => {
                    if (!this.parentId) {
                        router.replace('../discussion/' + data.id + '/details')
                    }
                }))
            }
        }
    }
}
</script>

<style lang="scss">
    textarea {
    min-height: 200px;
}
</style>
