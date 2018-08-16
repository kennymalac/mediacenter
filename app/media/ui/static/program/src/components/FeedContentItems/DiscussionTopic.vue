<template>
    <content-item :embed="embedProps" v-bind="item.instance" @togglePin="$emit('togglePin')" :showMenu="showMenu" :showGroupTag="showGroupTag" :detailsUrl="detailsUrl" :commentsUrl="commentsUrl" :groupId="item.group_id" :groupName="item.group_name" :isPinned="item.is_pinned" :isLocal="item.is_local" :owner="item.owner.instance">
        <span slot="content-type" :class="{ 'content-type': true, [subtype.toLowerCase()]: true }">{{ subtype }}</span>
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
        subtype: {
            type: String,
            default: "Topic"
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
            if (this.item.group_id !== 0 && this.item.group_id !== null) {
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

<style lang="scss">
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
        &.poll {
            background-color: #eb3636;
            background: linear-gradient(#eb3636 90%, #a73535);
        }
    }
}

.topic {
    blockquote {
        overflow: hidden;
        max-height: 75%;
    }
}
</style>
