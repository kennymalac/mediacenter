<template>
    <content-item :embed="embedProps" v-bind="item.instance" @togglePin="$emit('togglePin')" :showMenu="showMenu" :showGroupTag="showGroupTag" :detailsUrl="detailsUrl" :commentsUrl="commentsUrl" :groupId="item.group_id" :groupName="item.group_name" :isPinned="item.is_pinned" :owner="item.owner.instance">
        <span slot="content-type" class="content-type">Topic</span>
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

import ContextMenu from '../Gui/ContextMenu'

export default {
    name: 'feed-discussion-topic',
    props: {
        item: {
            type: Object
        },
        showMenu: {
            type: Boolean,
            default: false
        },
        showGroupTag: {
            type: Boolean,
            default: true
        }
    },
    components: {
        ContentItem,
        ContextMenu
    },
    computed: {
        commentsUrl() {
            // TODO should jump to bottom
            return `${this.detailsUrl}`
        },
        detailsUrl() {
            if (this.item.group_id !== 0) {
                return `/group/${this.item.group_id}/details/stash/${this.item.origin_stash_id}/details/discussion/${this.item.object_id}/details`
            }
            return `/feed/${this.item.feed_id}/details/stash/${this.item.origin_stash_id}/details/discussion/${this.item.object_id}/details`
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
        height: 2rem;
        // align-self: flex-start;
        font-size: .8rem;
    }
}

.topic {
    blockquote {
        overflow: hidden;
        max-height: 75%;
    }
}
</style>
