<template>
    <div class="feed-container">
        <template v-if="actions.details && instance.id">
            <pagination-controls :currentPage="currentPage" :pageCount="pageCount" @selected="selectPage" />

            <section class="posts">
                <poll-results v-if="instance.poll" :title="instance.content_item.title" :options="instance.poll.options" :userVotes="instance.poll.user_votes" :isOwner="activeUserId === instance.content_item.owner.id" @vote="votePoll" @editPoll="editPoll" />

                <post v-if="currentPage === 1" v-bind="instance.instance" @editPost="editPost(instance.id)" @deletePost="deletePost(instance)" @userProfile="showUserProfile(instance.content_item.owner.profile.id)" :isActiveUser="activeUserId === instance.content_item.owner.id" />
                <transition-group name="list" tag="div" class="posts">
                    <post :key="post.id" v-for="post in posts" v-bind="post.instance" :isActiveUser="activeUserId === post.content_item.owner.id" @editPost="editPost(post.id)" @deletePost="deletePost(post.instance)" @userProfile="showUserProfile(post.instance.content_item.owner.profile.id)" />
                </transition-group>

                <div class="reply">
                    <button @click="activateQuickReply">Quick Reply</button>
                    <button @click="reply">Reply</button>
                    <discussion @canceled="quickReplyActive = false" @replied="quickReplied" :show="quickReplyActive" action="create" :quickReply="true" :params="quickReplyParams" />
                </div>
            </section>

            <pagination-controls :currentPage="currentPage" :pageCount="pageCount" @selected="selectPage" />
        </template>
        <template v-if="actions.create">
            <reply v-if="!creatingPoll" @canceled="quickReply ? $emit('canceled') : $router.go(-1)" :show="show" :quick="quickReply" @save="save" :instance="instance" :instanceForm="instanceForm" :parentId="params.parentId" action="create" />
            <reply v-if="creatingPoll && query.step !== 2" @canceled="quickReply ? $emit('canceled') : $router.go(-1)" :show="show" :quick="quickReply" @save="save" :instance="instance" :instanceForm="instanceForm" :parentId="params.parentId" action="create" replyBtnText="Continue" />
            <poll-form v-if="creatingPoll && query.step === 2" :title="instanceForm.content_item.title" @save="savePoll" />
        </template>
        <template v-if="actions.manage">
            <poll-form v-if="creatingPoll" :options="instance.poll.options" @save="savePoll" />
            <reply v-else @canceled="$router.go(-1)" :quick="quickReply" @save="save" :instance="instance" :instanceForm="instanceForm" :parentId="params.parentId" action="manage" />
        </template>
    </div>

</template>

<script>
import {from} from 'rxjs'
import {map} from 'rxjs/operators'

import RestfulComponent from "../RestfulComponent"
import PaginatedComponent from "../PaginatedComponent"
import {activeUser, discussions, accounts, groups, interests, places, stashes, profiles, feedContentTypes, comments} from "../../store.js"
import activeUserDeps from "../../dependencies/activeUser.js"
import Post from './Post'
import Reply from './Reply'
import PollResults from './PollResults'
import PollForm from './PollForm'

import PaginationControls from '../PaginationControls'

import router from "../../router/index.js"

export default {
    name: 'discussion',
    mixins: [RestfulComponent, PaginatedComponent],
    props: {
        show: {
            type: Boolean,
            default: true
        },
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
        PollResults,
        PollForm,
        PaginationControls
    },
    computed: {
        creatingPoll() {
            return this.query && ['true', true].includes(this.query.poll)
        },
        discussionLink() {
        },
        quickReplyParams() {
            return {
                parentId: this.instance.id,
                parentTitle: this.instance.content_item.title,
                stashId: this.params.stashId,
                groupId: this.params.groupId,
                feedId: this.feedId
            }
        }
    },
    data() {
        return {
            objectName: 'discussion',
            quickReplyActive: false,
            activeUserId: 0,
            pollOptions: [],
            posts: [],
            instanceForm: { content_item: {} }
        }
    },
    mounted() {
        if (this.quickReply) {
            this.$watch('params', (params) => {
                this.instanceForm = {...this.instanceForm, content_item: {...this.instanceForm.content_item, title: `Re: ${this.params.parentTitle}`}}
            }, { deep: true, immediate: true })
        }
    },
    methods: {
        initialState() {
            this.instance = { id: null, content_item: { feeds: [] } }
            this.instanceForm = { content_item: { interests: [] }, text: "" }
        },

        scrollBottom() {
            const postsContainer = this.$el.querySelector("section.posts")
            postsContainer.scrollTop = postsContainer.scrollHeight
        },

        activateQuickReply() {
            this.quickReplyActive = true

            this.instanceForm.content_item.interests = []
            this.$nextTick(this.scrollBottom)
        },

        quickReplied() {
            this.quickReplyActive = false
            ++this.itemCount
            this.selectPage(this.pageCount)
            this.$nextTick(this.scrollBottom)
        },

        editPost(id) {
            router.push(`../${id}/manage`)
        },

        async deletePost(instance) {
            const discussionCollection = await discussions()
            await discussionCollection.destroy(instance, await this.dependencies())
            if (instance.id === this.instance.id) {
                // The topic was deleted, so redirect out of here
                router.replace(`..`)
            }
        },

        editPoll() {
            router.push(`../${this.instance.id}/manage?poll=true`)
        },

        showUserProfile(id) {
            router.push(`/profile/${id}/details`)
        },

        setCurrentPosts() {
            return map(items => {
                items = items.filter((item) => {
                    return item.parent === this.instance.id && this.isItemVisibleOnPage(item)
                })

                this.posts = items
                return items
            })
        },

        async create() {
            if (this.query && this.query.step && this.query.step !== 2) {
                // Prevent lack of redirect to step 2 when user reloads on poll creation screen
                router.replace({
                    query: {
                        poll: true
                    }
                })
            }

            await discussions()
            if (this.params && this.params.parentId) {
                this.instanceForm = {...this.instanceForm, content_item: {...this.instanceForm.content_item, title: `Re: ${this.params.parentTitle}`}}
            }

            if (this.params && this.params.groupId) {
                const groupCollection = await groups()
                // Default to using Group's interests
                const group = await groupCollection.fetchInstance({id: parseInt(this.params.groupId)})
                this.instanceForm.content_item.interests = group.feed.interests.slice()
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
            from(discussionCollection.list({ parent: this.instance.id, page: this.currentPage }, _deps))
                .pipe(
                    map(resp => {
                        this.paginate(resp)
                        if (this.query.last) {
                            this.selectPage(this.pageCount)
                            if (this.query.created) {
                                this.$nextTick(() => {
                                    this.scrollBottom()
                                })
                            }
                        }
                        resp = resp.results
                        return resp
                    }),
                    this.setCurrentPosts()
                )
                .subscribe()
        },

        async details(params) {
            const deps = await this.dependencies()
            this.instance = await this.showInstance(params.id, '/feed/list', discussions, deps)
            const discussionCollection = await discussions()
            discussionCollection.resolve(this.instance)

            const user = await activeUser()
            this.activeUserId = user.details.id
            await this.listChildren(deps)

            if (this.query && this.query.created) {
                this.scrollBottom()
            }

            this.$subscribeTo(this.objects$.pipe(
                this.setCurrentPosts()
            ))
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

        async votePoll(selectedOption) {
            const discussionCollection = await discussions()
            discussionCollection.votePoll(this.instance, selectedOption, await this.dependencies())
        },

        savePoll(_options) {
            let options = _options
            if (this.actions.manage) {
                // TODO
            }
            if (this.actions.create) {
                // don't use the ids here, because the ids are not real
                options = _options.map((item) => {
                    const {order, title} = item
                    return {order, title}
                })
            }
            this.instanceForm.poll = { options }

            this.save()
        },

        save() {
            if (this.actions.manage) {
                this.manageDiscussion().then(() => {
                    router.go(-1)
                })
            }
            else if (this.actions.create) {
                if (!this.params.parentId && this.query && this.query.step !== 2 && this.creatingPoll) {
                    // Redirect to the poll creation screen
                    router.push({
                        query: {
                            poll: true,
                            step: 2
                        }
                    })
                    return
                }
                this.createDiscussion().then(data => this.$nextTick(() => {
                    if (!this.quickReply) {
                        router.replace({
                            params: {
                                discussionAction: 'details',
                                discussionId: this.params.parentId ? this.params.parentId : data.id,
                                id: this.params.parentId ? this.params.parentId : data.id
                            },
                            query: {
                                last: 1,
                                created: true
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
section.posts {
    height: calc(100vh - 220px);
    overflow: scroll;
    &.list-enter-active, &.list-leave-active,
    .list-enter-active, .list-leave-active {
        transition: all .5s;
    }
    &.list-enter, &.list-leave-to,
    .list-enter, .list-leave-to  {
        border-left-color: white;
        opacity: 0;
        transform: translateY(-30px);
    }
}
.reply {
    margin: 10px;
}
</style>
