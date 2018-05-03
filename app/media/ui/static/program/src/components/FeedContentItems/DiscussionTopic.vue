<template>
    <content-item :embed="embedProps" :title="title">
        <template slot="title" slot-scope="{ slotProps }">
            <div class="content-title">
                <span class="content-type">Topic</span>
                {{ title }}
            </div>
        </template>
        <template slot="embed" slot-scope="{ slotProps }">
            <div class="default-preview topic">
                <blockquote>
                    {{ description }}
                </blockquote>
            </div>
        </template>
    </content-item>
</template>

<script>
import ContentItem from './ContentItem'

export default {
    name: 'feed-discussion-topic',
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

<style scoped lang="scss">
.content-title {
    .content-type {
        display: inline-flex;
        border-radius: 6px;
        background-color: #1F8DD6;
        color: white;
        font-weight: normal;
        padding: 4px;
        font-size: 1rem;
    }
}

.topic {
    quote {
        font-style: oblique;
        overflow: hidden;
    }
}
</style>
