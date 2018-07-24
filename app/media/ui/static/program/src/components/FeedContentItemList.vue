<template>
    <div class="feed-list">
    <template v-for="item in contentItems">
        <feed-link @togglePin="() => togglePin(item)" v-if="item.content_type.name == 'link'" :showGroupTag="showGroupTag" :showMenu="showMenu" :item="item" />
        <feed-discussion-topic @togglePin="() => togglePin(item)" v-if="item.content_type.name == 'topic'" :showGroupTag="showGroupTag" :showMenu="showMenu" :item="item" />
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
        },
        showMenu: {
            type: Boolean,
            default: false
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
                console.log(item.content_type.title)
                return this.enabledContentTypes.includes(item.content_type.title)
            })
        }
    },
    methods: {
        togglePin(item) {
            this.$emit('togglePin', item)
        }
    }
}
</script>

<style lang="scss">
    .feed-list {
height: calc(100vh - 220px);
overflow: scroll;
}
</style>
