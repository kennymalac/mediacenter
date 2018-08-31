<template>
    <content-item v-bind="item.instance" @togglePin="$emit('togglePin')" :showMenu="showMenu" :showGroupTag="showGroupTag" :detailsUrl="detailsUrl" :commentsUrl="commentsUrl" :groupId="item.group_id" :groupName="item.group_name" :isPinned="item.is_pinned" :isLocal="item.is_local" :owner="item.owner.instance" :isAnonymous="item.is_anonymous" :lastChild="item.last_child" :postCount="item.post_count" postNoun="reply" postNounPlural="replies">
        <span slot="content-type" :class="{ 'content-type': true, [subtype.toLowerCase()]: true }">{{ subtype }}</span>
        <template slot="embed" slot-scope="{ slotProps }">
            <div class="default-preview topic">
                <blockquote v-html="slotProps.description">
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
    }
}
</script>

<style lang="scss">
.content-title {
    .content-type {
        width: 2.5rem;
        display: inline-flex;
        border-radius: 6px;
        background-color: #1F8DD6;
        color: white;
        font-weight: normal;
        height: 1.8rem;
        // align-self: flex-start;
        font-size: .8rem;
        &.poll {
            width: 2rem;
            background-color: #eb3636;
            background: linear-gradient(#eb3636 90%, #a73535);
        }
    }
}

.topic {
    blockquote {
        margin-top: 5px;
        width: 100%;
        font-size: 1rem;
        padding: 0 10px;
        height: 4.5rem;
        overflow-y: hidden;
        word-wrap: break-word;
    }
}
</style>
