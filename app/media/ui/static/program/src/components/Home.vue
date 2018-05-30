<template>
    <div class="dashboard">
        <h1>Portal</h1>

        <!-- <select> -->
        <!--     <option selected>Your feeds</option> -->
        <!--     <option>Activity</option> -->
        <!-- </select> -->

        <!-- <action-button v-bind="uploadAction" /> -->
        <!-- <action-button v-bind="createContentItemAction" /> -->

        <content-item-form :contentTypes="allowedContentTypes" @contentTypeSelected="contentTypeSelected" />
        <feed-content-stash :feedId="resolvedFeedId" />

        <h2>Recent Activity</h2>
        <!-- <activity-feed /> -->
        <span class="author">Ken</span> replied to your post.
    </div>
</template>

// landing page for guests
// central hub/portal for users
<script>
import ActionButton from './ActionButton'
import ContentItemForm from './ContentItemForm'
import FeedContentStash from './FeedContentStash'
import feedDeps from '../dependencies/Feed.js'

import {feeds, activeUser} from '../store.js'

export default {
    name: "home",
    components: {
        ActionButton,
        ContentItemForm,
        FeedContentStash
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
            allowedContentTypes: ['Image', 'Video', 'Topic', 'Link'],
            resolvedFeedId: ''
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
                await feedCollection.list({ owner: userId }, await feedDeps())
            }

            this.resolvedFeedId = feedCollection.values.find((feed) => {
                return feed.owner.id === userId && feed.name === 'My Feed'
            }).id
        }
    }
}
</script>

<style scoped>
</style>
