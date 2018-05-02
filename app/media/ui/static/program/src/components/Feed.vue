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
                </div>
            </section>
            
            <section class="feeds">
                <feed-discussion-topic item="{}" />
                <feed-image item="{}" />
                <feed-image item="{}" />
                <feed-image item="{}" />
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

export default {
    name: 'feed',
    mixins: [RestfulComponent],
    components: {
        FeedItem,
        FeedImage,
        FeedDiscussionTopic,
        ActionList
    },
    data() {
        return {
            objects: [
                {
                    id: 1,
                    icon: "ion-ios-flask",
                    name: "Memes",
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
            ]
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
        }
    }
}
</script>

<style lang="scss">
.feed-container {
    display: flex;
    flex-basis: 3;
    section.feeds {
        margin: 10px;
        text-align: left;
        flex: 2;
    }
}
</style>
