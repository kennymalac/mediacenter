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
                <feed-discussion-topic v-if="enabledContentTypes.includes('Topics')" item="{}" />
                <feed-image v-if="enabledContentTypes.includes('Images')" item="{}" />
                <feed-image v-if="enabledContentTypes.includes('Images')" item="{}" />
                <feed-image v-if="enabledContentTypes.includes('Images')" item="{}" />
            </section>
        </template>
    </div>
</template>

<script>
import RestfulComponent from "./RestfulComponent"
import FeedItem from './FeedItem'
import FeedImage from './FeedContentItems/Image'
import FeedDiscussionTopic from './FeedContentItems/DiscussionTopic'
import ActionList from './ActionList'
import FeedFilter from './FeedFilter'

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
        }
    },
    data() {
        return {
            objects: [
                {
                    id: 1,
                    icon: "ion-ios-flask",
                    name: "Dank Meme Lab",
                    description: ""
                }
            ],
            feedActions: [
                {
                    icon: "ion-ios-list-box",
                    title: "Create a Feed",
                    extraIcon: "ion-md-add-circle"
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
            }
        }
    },
    methods: {
        initialState() {
            
        },

        list() {

        },

        details(params) {
            this.instance = this.objects.find((item) => {
                return item.id === parseInt(params.id)
            })
        },

        toggle(event) {
            console.log(event)
        }
    }
}
</script>

<style scoped lang="scss">
.feed-container {
    display: flex;
    flex-basis: 3;
    section.feeds {
        margin: 10px;
        flex: 2;
    }
}
section.sidebar {
}
</style>
