<template>
    <div class="feed-list">
        <feed-discussion-topic v-for="topic in topics" v-if="enabledContentTypes.includes('Topics')" :item="topic" />
        <feed-discussion-topic v-for="post in posts" v-if="enabledContentTypes.includes('Posts')" :item="post" />
        <feed-image v-for="image in images" v-if="enabledContentTypes.includes('Images')" v-bind="image" />
    </div>
</template>

<script>
import FeedImage from './FeedContentItems/Image'
import FeedDiscussionTopic from './FeedContentItems/DiscussionTopic'

export default {
    props: {
        items: [Array],
        enabledContentTypes: [Array]
    },
    components: {
        FeedImage,
        FeedDiscussionTopic
    },
    computed: {
        images() {
            return this.listContent("img")
        },
        videos() {
            return this.listContent("vid")
        },
        topics() {
            return this.listContent("topic")
        },
        posts() {
            return this.listContent("post")
        },
        links() {
            return this.listContent("link")
        },
        blogPosts() {
            return this.listContent("blgpst")
        }
    },
    methods: {
        listContent(contentType) {
            return this.items.filter((item) => {
                return item.content_type.name === contentType ? item : false
            })
        }
    }
}
</script>

<style lang="scss">
</style>
