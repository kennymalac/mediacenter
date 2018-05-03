<template>
    <content-item :embed="embedProps" :title="title">
        <template slot="embed" slot-scope="{ slotProps }">
            <div class="default-preview" v-if="!embedProps.src">
                <i class="ion-ios-image"></i>
            </div>
        </template>
    </content-item>
</template>

<script>
import ContentItem from './ContentItem'
//import FeedImageCollection from '../../models/Image.js'

export default {
    name: 'feed-image',
    props: {
        title: {
            type: String,
            default: ""
        },
        description: {
            type: String,
            default: ""
        },
        owner: {
            type: Number
        }
    },
    components: {
        ContentItem
    },
    data() {
        return {
            embedProps: {
                src: null
            }
        }
    }
}
</script>

<style lang="scss">
</style>
