<template>
    <div class="feed-container">
        <template v-if="actions.details && instance.id">
            <pagination-controls :currentPage="currentPage" :pageCount="pageCount" @selected="selectPage" />

            <section class="posts">
                <post v-if="currentPage === 1" v-bind="instance.instance" @editPost="editPost(instance.id)" @userProfile="showUserProfile(instance.content_item.owner.profile.id)" :isActiveUser="activeUserId === instance.content_item.owner.id" />
                <post v-for="post in posts" v-bind="post.instance" :isActiveUser="activeUserId === post.content_item.owner.id" @editPost="editPost(post.id)" @userProfile="showUserProfile(post.instance.content_item.owner.profile.id)" />

                <div class="reply">
                    <button @click="quickReplyActive = true" v-if="!quickReplyActive">Quick Reply</button>
                    <button @click="reply" v-if="!quickReplyActive">Reply</button>
                    <discussion @canceled="quickReplyActive = false" @replied="quickReplied" v-if="quickReplyActive" action="create" :quickReply="true" :params="quickReplyParams" />
                </div>
            </section>

            <pagination-controls :currentPage="currentPage" :pageCount="pageCount" @selected="selectPage" />
        </template>
        <template v-if="actions.create">
            <reply @canceled="quickReply ? $emit('canceled') : $router.go(-1)" :quick="quickReply" @save="save" :instance="instance" :instanceForm="instanceForm" :parentId="params.parentId" action="create" />
        </template>
        <template v-if="actions.manage">
            <reply @canceled="$router.go(-1)" :quick="quickReply" @save="save" :instance="instance" :instanceForm="instanceForm" :parentId="params.parentId" action="manage" />
        </template>
    </div>

</template>

<script>
import RestfulComponent from "../RestfulComponent"
import PaginatedComponent from "../PaginatedComponent"
import {activeUser, discussions, accounts, groups, interests, places, stashes, profiles, feedContentTypes, comments} from "../../store.js"
import activeUserDeps from "../../dependencies/activeUser.js"
import Post from './Post'
import Reply from './Reply'
import PaginationControls from '../PaginationControls'

import router from "../../router/index.js"

export default {
    name: 'discussion',
    mixins: [RestfulComponent, PaginatedComponent],
    props: {
        quickReply: {
            type: Boolean,
            default: false
        },
        feedId: {
            type: Number,
            required: false
        }
    },
    components: {
        Post,
        Reply,
        PaginationControls
    },
    computed: {
        discussionLink() {
        },
        posts() {
            return this.objects.filter((item) => {
                return item.parent === this.instance.id && this.isItemVisibleOnPage(item)
            })
        },
        quickReplyParams() {
            return {
                parentId: this.instance.id,
                parentTitle: this.instance.content_item.title,
                stashId: this.params.stashId,
                feedId: this.params.feedId
            }
        }
    },
    mounted() {
        console.log('remounted')
    },
    data() {
        return {
            objectName: 'discussion',
            quickReplyActive: false,
            activeUserId: 0,
            instanceForm: { content_item: {} }
        }
    },
    methods: {
        initialState() {
            this.instance = { id: null, content_item: { feeds: [] } }
            this.instanceForm = { content_item: {}, text: "" }
        },

        quickReplied() {
            this.quickReplyActive = false
            ++this.itemCount
            this.selectPage(this.pageCount)
        },

        editPost(id) {
            router.push(`../${id}/manage`)
        },

        showUserProfile(id) {
            router.push(`/profile/${id}/details`)
        },

        async create() {
            await discussions()
            if (this.params.parentTitle) {
                this.instanceForm = {...this.instanceForm, content_item: {...this.instanceForm.content_item, title: `Re: ${this.params.parentTitle}`}}
            }
        },

        async dependencies() {
            const [owner, stashCollection, contentTypeCollection, profileCollection, interestCollection, placeCollection, commentCollection, groupCollection] = await Promise.all(
                [accounts(), stashes(), feedContentTypes(), profiles(), interests(), places(), comments(), groups()]
            )
            const stash = await stashCollection.getInstance(parseInt(this.params.stashId))

            return {
                owner,
                content_item: stash.collections.content.collections.item,
                content_type: contentTypeCollection,
                content_types: contentTypeCollection,
                profile: profileCollection,
                member_groups: groupCollection,
                friends: owner,
                account: owner,
                comments: commentCollection,
                interests: interestCollection,
                places: placeCollection
            }
        },

        async manage(params) {
            const fallthrough = this.params.parentId ? `/discussion/${this.parentId}/detail` : `/feed/list`

            this.instance = await this.showInstance(params.id, fallthrough, discussions, await this.dependencies())
            this.instanceForm = this.instance.getForm()
        },

        async listChildren(deps = null) {
            const _deps = deps || await this.dependencies()
            const discussionCollection = await discussions()
            this.paginate(await discussionCollection.list({ parent: this.instance.id, page: this.currentPage }, _deps))
            if (this.query.last) {
                this.selectPage(this.pageCount)
            }
        },

        async details(params) {
            const deps = await this.dependencies()
            this.instance = await this.showInstance(params.id, '/feed/list', discussions, deps)

            const user = await activeUser()
            this.activeUserId = user.details.id

            this.listChildren(deps)
        },

        async manageDiscussion() {
            const discussionCollection = await discussions()
            return discussionCollection.manage(this.instance, this.instanceForm, await this.dependencies())
                .catch((error) => {
                    console.log(error)
                })
        },

        async createDiscussion() {
            const ownerDeps = await activeUserDeps()
            const ownerAccount = ownerDeps.members.getInstance(ownerDeps.owner.details.id, ownerDeps)

            this.instanceForm.content_item.owner = ownerAccount

            if (this.params.parentId) {
                this.instanceForm.parent = this.params.parentId
            }

            const stashCollection = await stashes()
            if (this.params.stashId) {
                // TODO replies can be stored on specific stashes
                // via pubsub
                this.instanceForm.stash = await stashCollection.getInstance(parseInt(this.params.stashId))
            }
            this.instanceForm.feed = this.feedId || this.params.feedId

            try {
                const discussionCollection = await discussions()
                const instance = await discussionCollection.create(this.instanceForm, {...await this.dependencies(), stashes: stashCollection})
                return instance
            }
            catch (error) {
                console.log(error)
            }
        },

        reply() {
            router.push({
                params: {
                    discussionAction: 'create',
                    parentId: this.instance.id,
                    parentTitle: this.instance.content_item.title,
                    stashId: this.params.stashId,
                    feedId: this.params.feedId
                }
            })
        },

        save() {
            if (this.actions.manage) {
                this.manageDiscussion().then(() => {
                    router.go(-1)
                })
            }
            else if (this.actions.create) {
                this.createDiscussion().then(data => this.$nextTick(() => {
                    if (!this.quickReply) {
                        router.replace({
                            params: {
                                discussionAction: 'details',
                                discussionId: this.params.parentId ? this.params.parentId : data.id,
                                id: this.params.parentId ? this.params.parentId : data.id
                            },
                            query: {
                                last: 1
                            }
                        })
                    }
                    else {
                        this.$emit('replied')
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
.reply {
    margin: 10px;
}
</style>
