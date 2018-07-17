<template>
    <div class="feed-container">
        <template v-if="actions.list">
            <section>
                <action-list :actions="feedActions" />
            </section>

            <section class="feeds">
                <h1>Your Feeds</h1>

                <feed-item v-for="feed in objects" :id="feed.id" :name="feed.name" />
            </section>
        </template>
        <template v-if="actions.details && instance.id">
            <section class="sidebar">
                <div class="group-info">
                    <div class="icon-container">
                        <i v-if="instance.icon" :class="instance.icon"></i>
                    </div>
                    <h2>{{ instance.name }}</h2>
                    <button type="button" v-if="isActiveUserOwner" @click="editFeed">
                        <i class="ion-md-create"></i> Edit
                    </button>
                    <p class="description">{{ instance.description }}</p>

                    <h3>Filters</h3>
                    <feed-filter :specifiers="filters.contentTypes" :filterToggled="toggle" />
                    <feed-filter :specifiers="filters.subjects" :filterToggled="toggle" />
                    <feed-filter :specifiers="filters.interests" :filterToggled="toggle" />
                    <feed-filter :specifiers="filters.tags" :filterToggled="toggle" />
                </div>
            </section>

            <section class="feed" v-if="!params.stashId">
                <feed-content-item-list :enabledContentTypes="enabledContentTypes" :items="contentItems" />
            </section>
            <router-view v-if="params.stashId" :stashId="params.stashId" :feedId="params.feedId"></router-view>
        </template>
        <template v-if="actions.create || actions.manage">
            <form class="main-form" @submit.prevent="save">
                <fieldset>
                    <legend class="stack">Details</legend>
                    <label class="stack" for="name">Name</label>
                    <input class="stack" name="name" v-model="instanceForm.name" type="text" />
                    <label class="stack" for="description">Description</label>
                    <textarea class="stack" name="description" v-model="instanceForm.description" />
                    <label class="stack" for="content-types">Content Types</label>
                    <feed-content-type-select v-model="instanceForm.content_types" />
                    <label class="stack" for="interests">Interests</label>
                    <interest-select v-model="instanceForm.interests" />

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
import {FeedModel} from "../models/Feed.js"
import {feeds, activeUser} from '../store.js'
import feedDeps from '../dependencies/Feed.js'

import FeedItem from './FeedItem'
import FeedContentItemList from './FeedContentItemList'
import FeedContentTypeSelect from './FeedContentTypeSelect'
import InterestSelect from './InterestSelect'
import ActionList from './ActionList'
import FeedFilter from './FeedFilter'

import router from "../router/index.js"

export default {
    name: 'feed',
    mixins: [RestfulComponent],
    components: {
        FeedItem,
        FeedContentItemList,
        FeedContentTypeSelect,
        InterestSelect,
        ActionList,
        FeedFilter
    },
    computed: {
        enabledContentTypes() {
            return this.filters.contentTypes.map((contentType) => {
                return contentType.enabled ? contentType.name : false
            })
        }
    },
    data() {
        return {
            objectName: 'feed',
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
                    }
                ],
                subjects: [],
                interests: [],
                tags: []
            },
            contentItems: []
        }
    },
    methods: {
        initialState() {
            this.instance = { id: null, content_types: [] }
            this.contentItems = []
            this.instanceForm = { content_types: [], interests: [], visibility: { value: '0', text: 'Public' } }
        },

        create() {
        },

        async manage(params) {
            this.instance = await this.showInstance(params.id, 'feed/list', feeds, await feedDeps())
            this.instanceForm = this.instance.getForm()
        },

        editFeed() {
            router.push(`/feed/${this.instance.id}/manage`)
        },

        async list(params) {
            const store = await feeds()
            this.objects = store.values.filter((feed) => {
                return feed.name !== ''
            })
        },

        async details(params) {
            const user = await activeUser()
            const deps = await feedDeps()
            this.instance = await this.showInstance(params.id, 'feed/list', feeds, deps)
            this.isActiveUserOwner = this.instance.owner.id === user.details.id

            try {
                // TODO optimize
                this.contentItems = await FeedModel.listItems(this.instance.id, {}, {
                    content_type: deps.content_types,
                    comments: deps.comments,
                    places: deps.places,
                    interests: deps.interests,
                    owner: deps.owner
                })
            }
            catch (error) {
                console.log(error)
            }
        },

        toggle(event) {
            console.log(event)
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
            return feedCollection.manage(this.instance, this.instanceForm, await feedDeps())
                .then((data) => {
                    this.instance = data
                    return data
                })
                .catch((error) => {
                    console.log(error)
                })
        },

        save() {
            if (this.actions.manage) {
                this.manageFeed().then((data) => {
                    console.log(data)
                    router.push(`/feed/${this.instance.id}/details`)
                })
            }
            else if (this.actions.create) {
                this.createFeed()
                    .then(data => this.$nextTick(() => {
                        router.replace('/feed/' + data.id + '/manage')
                    }))
                    .catch((error) => {
                        console.log(error)
                    })
            }
        }
    }
}
</script>

<style lang="scss">
.feed-container {
    display: flex;
    flex-direction: row;
    flex-flow: wrap;
    justify-content: center;
    // flex-basis: 3;
    section.feed .feed-list {
        margin: 10px;
        flex: 2;
    }

    .main-form {
        width: 480px;
    }
}

section.sidebar {
}
</style>
