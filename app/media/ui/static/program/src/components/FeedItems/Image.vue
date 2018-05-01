<template>
    <content-item :embed="embedProps">
        <div slot="embed" slot-scope="{ slotProps }">
        </div>
    </content-item>
</template>

<script>
import ContentItem from './ContentItem'
//import FeedImageCollection from '../../models/Image.js'

export default {
    name: 'feed-image',
    components: {
        ContentItem
    },
    data() {
        return {
            embedProps: {}
        }
    }
}
</script>

<style lang="scss">
</style>
