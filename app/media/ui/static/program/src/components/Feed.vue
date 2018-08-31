<template>
    <div :style="feedStyle" class="grid feed-container">
        <template v-if="actions.list">
            <section>
                <action-list :actions="feedActions" />
            </section>

            <section class="feeds">
                <h1>Your Feeds</h1>

                <feed-item v-for="feed in objects" :image="feed.picture" :id="feed.id" :name="feed.name" />
            </section>
        </template>
        <template v-if="actions.details && instance.id">
            <feed-info-sidebar :instance="instance" @editFeed="editFeed" @details="viewFeed" :isActiveUserOwner="isActiveUserOwner" :showEdit="true" />
            <section class="feed" v-if="!params.stashId">
                <feed-content-item-list :query="query" @listChildren="listContentChildren" :enabledContentTypes="enabledContentTypes" :items="contentItems" />
            </section>
            <router-view v-if="params.stashId" :stashId="params.stashId" :feedId="params.feedId"></router-view>
        </template>
        <template v-if="actions.create || actions.manage">
            <feed-info-sidebar :instance="instance" @details="viewFeed" :isActiveUserOwner="isActiveUserOwner" :showDelete="actions.manage" @deleteFeed="deleteFeed" />
            <form class="main-form" @submit.prevent="save">
                <info-box :preErrorMessage="preErrorMessage" :message="infoBoxMessage" :errorData="infoBoxErrorData" :status="infoBoxStatus" />
                <fieldset>
                    <legend class="stack">Appearance</legend>
                    <background-select :colors.sync="colors" />
                    <label class="stack" for="picture">Picture (URL)</label>
                    <input class="stack" name="picture" v-model="instanceForm.picture" type="text" />
                </fieldset>
                <fieldset>
                    <legend class="stack">Details</legend>
                    <label class="stack" for="name">Name</label>
                    <input class="stack" name="name" v-model="instanceForm.name" type="text" />
                    <label class="stack" for="description">Description</label>
                    <textarea class="stack" name="description" v-model="instanceForm.description" />
                    <label class="stack" for="content-types">Content Types</label>
                    <feed-content-type-select v-model="instanceForm.content_types" />
                    <label class="stack" for="interests">Interests</label>
                    <interest-select v-if="!instance.default_owner_feed" v-model="instanceForm.interests" />
                    <div v-else class="stack" style="background-color: white; border: 1px solid #ccc; padding: 0.3em 0.6em;">
                        Your profile interests:
                        <tag-list :tags="instance.owner.profile.interests" tagType="interest" />
                    </div>

                    <!-- <label class="stack" for="">Tags</label> -->
                    <!-- <input class="stack" name="tags" v-model="instanceForm.tags_raw" type="text" /> -->
                    <input v-if="actions.create" class="stack" type="submit" value="Create" />
                    <input v-if="actions.manage" class="stack" type="submit" value="Save changes" />
                </fieldset>
            </form>
        </template>
    </div>
</template>

<script>
import RestfulComponent from "./RestfulComponent"
import PaginatedComponent from "./PaginatedComponent"

import {FeedModel} from "../models/Feed.js"
import {feeds, activeUser, profiles, accounts} from '../store.js'
import feedDeps from '../dependencies/Feed.js'

import InfoBox from './Gui/InfoBox'
import FeedInfoSidebar from './FeedInfoSidebar'
import FeedItem from './FeedItem'
import FeedContentItemList from './FeedContentItemList'
import FeedContentTypeSelect from './FeedContentTypeSelect'
import InterestSelect from './InterestSelect'
import BackgroundSelect from './Gui/BackgroundSelect'
import ActionList from './ActionList'
import FeedFilter from './FeedFilter'
import TagList from './TagList'

import PaginationControls from './PaginationControls'

import router from "../router/index.js"

export default {
    name: 'feed',
    mixins: [RestfulComponent, PaginatedComponent],
    components: {
        InfoBox,
        FeedInfoSidebar,
        FeedItem,
        FeedContentItemList,
        FeedContentTypeSelect,
        InterestSelect,
        ActionList,
        FeedFilter,
        PaginationControls,
        BackgroundSelect,
        TagList
    },
    computed: {
        feedStyle() {
            const defaults = { height: '100%' }
            if (!this.params ||
                (this.params &&
                 !(["details", "manage"].includes(this.params.feedAction)) &&
                 !(["details", "manage"].includes(this.params.action)))) {
                return Object.assign({}, defaults)
            }
            return Object.assign({}, defaults, {
                "background-color": this.colors.hex
            })
        },
        enabledContentTypes() {
            return this.filters.contentTypes.map((contentType) => {
                return contentType.enabled ? contentType.name : false
            })
        },
        preErrorMessage() {
            const feedAction = this.action || this.feedAction

            if (!['manage', 'create'].includes(feedAction)) {
                return ""
            }

            return feedAction === 'create' ? "The feed could not created" : "The feed could not be updated"
        }
    },
    data() {
        return {
            objectName: 'feed',
            colors: { hex: "" },
            isActiveUserOwner: false,
            instanceForm: { content_types: [] },
            instance: {
                content_types: []
            },
            feedActions: [
                {
                    icon: "ion-ios-list-box",
                    title: "Create a Feed",
                    extraIcon: "ion-md-add-circle",
                    link: "create"
                }
                // {
                //     icon: "ion-md-search",
                //     title: "Find a Feed"
                // }
            ],
            filters: {
                contentTypes: [
                    {
                        name: "Image",
                        enabled: true
                    },
                    {
                        name: "Link",
                        enabled: true
                    },
                    {
                        name: "Blog Posts",
                        enabled: true
                    },
                    {
                        name: "Topic",
                        enabled: true
                    },
                    {
                        name: "Poll",
                        enabled: true
                    }
                ],
                subjects: [],
                interests: [],
                tags: []
            },
            contentItems: {},
            infoBoxStatus: "",
            infoBoxMessage: "",
            infoBoxErrorData: {},
            contentSortOrder: "-updated",
            currentContentItemPage: 1
        }
    },
    methods: {
        initialState() {
            this.instance = { id: null, content_types: [] }
            this.contentItems = {}
            this.instanceForm = { content_types: [], interests: [], visibility: { value: '0', text: 'Public' } }
            this.infoBoxStatus = ""
            this.infoBoxMessage = ""
            this.infoBoxErrorData = {}
        },

        create() {
        },

        async manage(params) {
            const [feedCollection] = await Promise.all([feeds()])
            this.instance = await this.showInstance(params.id, 'feed/list', feeds, await feedDeps())
            const user = await activeUser()
            this.isActiveUserOwner = this.instance.owner.id === user.details.id

            await feedCollection.resolve(this.instance)
            if (this.instance.owner.instance._isFake || this.instance.owner.profile.interests.length === 0) {
                const accountCollection = await accounts()
                const profile = await profiles()
                await accountCollection.get(this.instance.owner.id, { profile })
                await profile.get(this.instance.owner.profile.id)
            }
            this.instanceForm = this.instance.getForm()
            this.colors.hex = this.instance.background_color ? `#${this.instance.background_color}` : ""
        },

        viewFeed() {
            router.push(`/feed/${this.instance.id}/details`)
        },

        editFeed() {
            router.push(`/feed/${this.instance.id}/manage`)
        },

        async listContentChildren(currentPage, _deps = null) {
            this.currentContentItemPage = currentPage || this.currentContentItemPage
            const deps = _deps || await feedDeps()

            const resp = await FeedModel.listItems(
                this.instance.id,
                { page: this.currentContentItemPage, order: this.contentSortOrder },
                deps,
                this.contentItems.length)
            this.contentItems = resp
        },

        async list(params) {
            const store = await feeds()
            this.objects = store.values.filter((feed) => {
                return !feed.has_group
            })
        },

        async details(params) {
            const user = await activeUser()
            const deps = await feedDeps()
            this.instance = await this.showInstance(params.id, 'feed/list', feeds, deps)
            this.isActiveUserOwner = this.instance.owner.id === user.details.id
            this.colors.hex = this.instance.background_color ? `#${this.instance.background_color}` : ""

            try {
                // TODO optimize
                await this.listContentChildren(this.query.page, {
                    content_type: deps.content_types,
                    comments: deps.comments,
                    places: deps.places,
                    interests: deps.interests,
                    owner: deps.owner
                })

                this.observers$.push(this.$store.$observe('feedContentItemListSortingOption', (val) => {
                    if (val) {
                        this.contentSortOrder = val
                        this.listContentChildren()
                    }
                }, 'contentSortOrder'))
            }
            catch (error) {
                console.log(error)
            }
        },

        toggle(event) {
            console.log(event)
        },

        async deleteFeed() {
            const feedsCollection = await feeds()
            await feedsCollection.destroy(this.instance, await feedDeps(this.stashId))
            router.replace('/feed/list')
        },

        async createFeed() {
            const feedCollection = await feeds()
            return feedCollection.create(this.instanceForm, await feedDeps())
                .then((data) => {
                    console.log(data)
                    return data
                })
        },

        async manageFeed() {
            const feedCollection = await feeds()
            this.instanceForm.background_color = this.colors.hex.slice(1)

            return feedCollection.manage(this.instance, this.instanceForm, await feedDeps())
                .then((data) => {
                    this.instance = data
                    return data
                })
        },

        save() {
            if (this.actions.manage) {
                this.manageFeed().then((data) => {
                    console.log(data)
                    router.push(`/feed/${this.instance.id}/details`)
                })
                    .catch(async (error) => {
                        console.log(error)
                        this.infoBoxStatus = "error"
                        this.infoBoxErrorData = await error.data
                    })
            }
            else if (this.actions.create) {
                this.createFeed()
                    .then(data => this.$nextTick(() => {
                        router.replace('/feed/' + data.id + '/manage')
                    }))
                    .catch(async (error) => {
                        console.log(error)
                        this.infoBoxStatus = "error"
                        this.infoBoxErrorData = await error.data
                    })
            }
        }
    }
}
</script>

<style lang="scss">
.feed-container {
    grid-template-columns: 1fr 3fr;
    .feed-content-item-list {
        height: calc(100vh - 80px) !important;
        overflow-y: scroll;
    }
    section.feeds {
        text-align: left;
        margin: 10px;
    }

    .main-form {
        width: 480px;
    }
}

section.sidebar {
}
</style>
