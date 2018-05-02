<template>
    <div>
        <feed-discussion-topic item="{}" />
        <feed-image item="{}" />
        <feed-image item="{}" />
        <feed-image item="{}" />
    </div>
</template>

<script>
import FeedImage from './FeedItems/Image'
import FeedDiscussionTopic from './FeedItems/DiscussionTopic'

export default {
    name: 'feed',
    components: {
        FeedImage,
        FeedDiscussionTopic
    },
    data() {
        return {}
    }
}
</script>

<style scoped>
</style>
