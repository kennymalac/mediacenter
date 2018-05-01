<template>
    <div>
        <feed-image item="{}" />
        <feed-image item="{}" />
        <feed-image item="{}" />
        <feed-image item="{}" />
    </div>
</template>

<script>
import FeedImage from './FeedItems/Image'

export default {
    name: 'feed',
    components: {
        FeedImage
    },
    data() {
        return {}
    }
}
</script>

<style scoped>
</style>
