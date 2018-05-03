<template>
    <div class="feed-container">
        <template v-if="actions.list">
            <section>
                <action-list :actions="feedActions" />
            </section>
            
            <section class="feeds">
                <h1>Your Feeds</h1>
                
                <feed-item v-for="feed in objects" v-bind="feed" />
            </section>
        </template>
        <template v-if="actions.details && instance.id">
            <section class="sidebar">
                <div class="group-info">
                    <div class="icon-container">
                        <i v-if="instance.icon" :class="instance.icon"></i>
                    </div>
                    <h2>{{ instance.name }}</h2>
                    <p class="description">{{ instance.description }}</p>
                    
                    <h3>Filters</h3>
                    <feed-filter :specifiers="filters.contentTypes" :filterToggled="toggle" />
                    <feed-filter :specifiers="filters.subjects" :filterToggled="toggle" />
                    <feed-filter :specifiers="filters.interests" :filterToggled="toggle" />
                    <feed-filter :specifiers="filters.tags" :filterToggled="toggle" />
                </div>
            </section>
            
            <section class="feeds">
                <feed-discussion-topic v-for="topic in topics" v-if="enabledContentTypes.includes('Topics')" v-bind="topic" />
                <feed-image v-for="image in images" v-if="enabledContentTypes.includes('Images')" v-bind="image" />
            </section>
        </template>
        <template v-if="actions.create || actions.manage">
            <form class="main-form" @submit.prevent="save" v-if="actions.manage || actions.create">
                <fieldset>
                    <legend class="stack">Details</legend>
                    <label class="stack" for="name">Name</label>
                    <input class="stack" name="name" v-model="instance.name" type="text" />
                    <label class="stack" for="description">Description</label>
                    <textarea class="stack" name="description" v-model="instance.description" />
                    <!-- <label class="stack" for="">Tags</label> -->
                    <!-- <input class="stack" name="tags" v-model="instance.tags_raw" type="text" /> -->
                    <input v-if="actions.create" class="stack" type="submit" value="Create" />
                    <input v-if="actions.manage" class="stack" type="submit" value="Save changes" />
                </fieldset>
            </form>
        </template>
    </div>
</template>

<script>
import RestfulComponent from "./RestfulComponent"
import {FeedCollection, FeedModel} from "../models/Feed.js"

import FeedItem from './FeedItem'
import FeedImage from './FeedContentItems/Image'
import FeedDiscussionTopic from './FeedContentItems/DiscussionTopic'
import ActionList from './ActionList'
import FeedFilter from './FeedFilter'

import router from "../router/index.js"

export default {
    name: 'feed',
    mixins: [RestfulComponent],
    components: {
        FeedItem,
        FeedImage,
        FeedDiscussionTopic,
        ActionList,
        FeedFilter
    },
    computed: {
        enabledContentTypes() {
            return this.filters.contentTypes.map((contentType) => {
                return contentType.enabled ? contentType.name : false
            })
        },
        images() {
            return this.listContent("img")
        },
        videos() {
            return this.listContent("vid")
        },
        topics() {
            return this.listContent("topic")
        },
        links() {
            return this.listContent("link")
        },
        blogPosts() {
            return this.listContent("blgpst")
        }
    },
    data() {
        return {
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
                        name: "Images",
                        enabled: true
                    },
                    {
                        name: "Hyperlinks",
                        enabled: true
                    },
                    {
                        name: "Blog Posts",
                        enabled: true
                    },
                    {
                        name: "Topics",
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
            this.instance = { id: null }
            this.contentItems = []
        },
        
        create() {
            this.instance = {}
        },
        
        list(params) {
            FeedCollection.searchFeeds().then((data) => {
                this.objects = data
            })
        },
        
        details(params) {
            this.instance = this.objects.find((item) => {
                return item.id === parseInt(params.id)
            })
            FeedCollection.get(this.instance.id)
                .then((data) => {
                    this.instance = data
                    // TODO filtering
                    FeedModel.listItems(data.id, {})
                        .then((contentData) => {
                            this.contentItems = contentData
                        })
                })
        },
        
        toggle(event) {
            console.log(event)
        },
        
        createFeed() {
            return FeedCollection.create({
                name: this.instance.name,
                description: this.instance.description
            })
                .then((data) => {
                    this.instance = data
                })
                .catch((error) => {
                    console.log(error)
                })
        },
        
        listContent(contentType) {
            return this.contentItems.filter((item) => {
                return item.content_type === contentType ? item : false
            })
        },
        
        save() {
            if (this.actions.create) {
                this.createFeed().then(this.$nextTick(() => {
                    router.replace('/feed/' + this.instance.id + '/manage')
                    // Ready to upload media items
                }))
            }
        }
    }
}
</script>

<style lang="scss">
.feed-container {
    display: flex;
    flex-direction: row;
    justify-content: center;
    // flex-basis: 3;
    section.feeds {
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
