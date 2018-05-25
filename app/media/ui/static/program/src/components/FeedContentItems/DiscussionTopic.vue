<template>
    <content-item :embed="embedProps" v-bind="item.instance">
        <template slot="title" slot-scope="{ slotProps }">
            <div class="content-title">
                <span class="content-type">Topic</span>
                <router-link :to="detailsUrl"> {{ item.title }}</router-link>
            </div>
            <span class="date">{{ item.created.fromNow() }}</span>
        </template>
        <template slot="embed" slot-scope="{ slotProps }">
            <div class="default-preview topic">
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
    name: 'feed-discussion-topic',
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
        detailsUrl() {
            if (this.item.group_stash_ids.length > 0) {
                const [groupId, stashId] = this.item.group_stash_ids
                return `/group/${groupId}/details/stash/${stashId}/details/discussion/${this.item.object_id}/details`
            }
            return `details/discussion/${this.item.object_id}/details`
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

.topic {
    blockquote {
        overflow: hidden;
        max-height: 50%;
    }
}
</style>
