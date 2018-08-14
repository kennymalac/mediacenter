<template>
    <div class="dashboard">
        <h1>Portal</h1>

        <!-- <select> -->
        <!--     <option selected>Your feeds</option> -->
        <!--     <option>Activity</option> -->
        <!-- </select> -->

        <!-- <action-button v-bind="uploadAction" /> -->
        <!-- <action-button v-bind="createContentItemAction" /> -->

        <content-item-form :stash="resolvedStash" :feedId="resolvedFeedId" :contentTypes="allowedContentTypes" @contentTypeSelected="contentTypeSelected" />
        <feed-content-stash :feedId="resolvedFeedId" />

        <h2>Recent Activity</h2>
        <activity-feed action="list" />
    </div>
</template>

// landing page for guests
// central hub/portal for users
<script>
import ActionButton from './ActionButton'
import ContentItemForm from './ContentItemForm'
import FeedContentStash from './FeedContentStash'
import ActivityFeed from './ActivityFeed/ActivityFeed'

import feedDeps from '../dependencies/Feed.js'

import {feeds, activeUser} from '../store.js'

export default {
    name: "home",
    components: {
        ActionButton,
        ContentItemForm,
        FeedContentStash,
        ActivityFeed
    },
    data() {
        return {
            createContentItemAction: {
                icon: "ion-md-list-box",
                title: "Create a Post",
                link: "/",
                extraIcon: "ion-md-add-circle"
            },
            uploadAction: {
                icon: "ion-md-list-box",
                title: "Upload content",
                link: "/",
                extraIcon: "ion-md-add-circle"
            },
            allowedContentTypes: ['Image', 'Topic', 'Poll', 'Link'],
            resolvedFeedId: '',
            resolvedStash: {}
        }
    },
    methods: {
        async contentTypeSelected(ctype) {
            const [user, feedCollection] = await Promise.all(
                [activeUser(), feeds()]
            )
            const userId = user.details.id

            if (feedCollection.values.length === 0) {
                // User feeds have not been fetched yet
                await feedCollection.list({ owner: userId }, await feedDeps(this.stashId))
            }

            const feed = feedCollection.values.find((feed) => {
                return feed.owner.id === userId && feed.name === 'My Feed'
            })
            this.resolvedFeedId = feed.id
            this.resolvedStash = feed.stashes.find((stash) => {
                return stash.name === 'My Content'
            })
        }
    }
}
</script>

<style scoped>
</style>
