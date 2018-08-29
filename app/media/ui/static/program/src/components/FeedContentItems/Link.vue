<template>
    <content-item :embed="embedProps" v-bind="item.instance" @togglePin="$emit('togglePin')" :showMenu="showMenu" :showGroupTag="showGroupTag" :detailsUrl="detailsUrl" :commentsUrl="commentsUrl" :groupId="item.group_id" :groupName="item.group_name" :isPinned="item.is_pinned" :isLocal="item.is_local" :isAnonymous="item.is_anonymous" :owner="item.owner.instance">
        <span slot="content-type">
            <i class="ion-ios-link"></i>
        </span>
        <template slot="content-link">
            <a class="header external-link" :href="item.nested_object.link">{{ item.title }}</a>
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
import TagList from '../TagList'

export default {
    name: 'feed-link',
    props: {
        stashId: [Number],
        item: {
            type: Object
        },
        showGroupTag: {
            type: Boolean,
            default: true
        },
        showMenu: {
            type: Boolean,
            default: true
        }
    },
    components: {
        ContentItem,
        TagList
    },
    computed: {
        commentsUrl() {
            return `${this.detailsUrl}/comment/list`
        },
        detailsUrl() {
            if (this.item.group_id !== 0 && this.item.group_id !== null) {
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
    .ion-ios-link { margin-left: 8px; }
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
        max-height: 75%;
    }
}
</style>
