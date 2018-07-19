<template>
    <div class="feed-list">
    <template v-for="item in contentItems">
        <feed-link v-if="item.content_type.name == 'link'" :showGroupTag="showGroupTag" :item="item" />
        <feed-discussion-topic v-if="item.content_type.name == 'topic'" :showGroupTag="showGroupTag" :item="item" />
        <feed-image v-if="item.content_type.name == 'img'" v-bind="item" />
    </template>
    </div>
</template>

<script>
import FeedLink from './FeedContentItems/Link'
import FeedImage from './FeedContentItems/Image'
import FeedDiscussionTopic from './FeedContentItems/DiscussionTopic'
// import {links} from '../store.js'
// import linkDeps from '../dependencies/Link.js'

export default {
    props: {
        items: [Array],
        enabledContentTypes: [Array],
        showGroupTag: {
            type: Boolean,
            default: true
        }
    },
    components: {
        FeedLink,
        FeedImage,
        FeedDiscussionTopic
    },
    computed: {
        contentItems() {
            return this.items.filter((item) => {
                return this.enabledContentTypes.includes(item.content_type.title)
            })
        }
    }
}
</script>

<style lang="scss">
</style>
