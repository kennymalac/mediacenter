<template>
    <content-item :embed="embedProps" v-bind="item.instance" :commentsUrl="commentsUrl">
        <template slot="title" slot-scope="{ slotProps }">
            <div class="content-title">
                <a :href="item.nested_object.link">{{ item.title }}</a>
            </div>
            <span class="date">{{ item.created.fromNow() }} <span class="local-tag" v-if="item.is_local">(Local)</span></span>
        </template>
        <template slot="embed" slot-scope="{ slotProps }">
            <div class="default-preview">
                <blockquote>
                    {{ item.description }}
                </blockquote>
            </div>
        </template>
    </content-item>
</template>

<script>
import ContentItem from './ContentItem'

export default {
    name: 'feed-link',
    props: {
        stashId: [Number],
        item: {
            type: Object
        }
    },
    components: {
        ContentItem
    },
    computed: {
        commentsUrl() {
            return `${this.detailsUrl}/comment/list`
        },
        detailsUrl() {
            if (this.item.group_id !== 0) {
                return `/group/${this.item.group_id}/details/stash/${this.item.origin_stash_id}/details/link/${this.item.object_id}/details`
            }
            return `/feed/${this.item.feed_id}/details/stash/${this.item.origin_stash_id}/details/link/${this.item.object_id}/details`
        }
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

span.local-tag {
    padding-left: 5px;
    font-weight: bold;
    color: green;
}

.topic {
    blockquote {
        overflow: hidden;
        max-height: 55%;
    }
}
</style>
