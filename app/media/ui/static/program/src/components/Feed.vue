<template>
    <div class="feed-container">
        <template v-if="actions.list">
            <section>
                <action-list :actions="feedActions" />
            </section>
            
            <section class="feeds">
                <h1>Your Feeds</h1>
                
                <feed-image item="{}" />
            </section>
        </template>
        <template v-if="actions.details && instance.id">
            <section class="sidebar">
                <div class="group-info">
                    <div class="icon-container">
                        <img height="100%" width="100%" :src="instance.image" />
                    </div>
                    <h2>{{ instance.name }}</h2>
                    <p class="description">{{ instance.description }}</p>
                    <div class="rules" v-if="instance.rules.length > 0">
                        <h3>Rules</h3>
                        <ol>
                            <li v-for="rule in instance.rules">{{ rule }}</li>
                        </ol>
                    </div>
                    <div class="who-is-online">
                        <h3><div class="online-circle"></div> {{ onlineMembers.length }} User(s) online now</h3>
                    </div>
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
import FeedImage from './FeedContentItems/Image'
import FeedDiscussionTopic from './FeedContentItems/DiscussionTopic'
import ActionList from './ActionList'

export default {
    name: 'feed',
    mixins: [RestfulComponent],
    components: {
        FeedImage,
        FeedDiscussionTopic,
        ActionList
    },
    data() {
        return {
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
