<template>
    <content-item :embed="embedProps" v-bind="item.instance" @togglePin="$emit('togglePin')" :showMenu="showMenu" :showGroupTag="showGroupTag" :detailsUrl="detailsUrl" :commentsUrl="commentsUrl" :groupId="item.group_id" :groupName="item.group_name" :isPinned="item.is_pinned" :isLocal="item.is_local" :isAnonymous="item.is_anonymous" :postCount="item.post_count" :owner="item.owner.instance">
        <span slot="content-type">
            <i class="ion-ios-image"></i>
        </span>
        <template slot="content-link">
            <router-link class="header" :to="detailsUrl">{{ item.title }}</router-link>
        </template>

        <template slot="embed" slot-scope="{ slotProps }">
            <!-- <div :style="imageBg" v-if="item.nested_object.src"> -->
                <!-- </div> -->
            <div class="default-preview">
                <blockquote v-html="slotProps.description">
                </blockquote>
           </div>
        </template>
    </content-item>
</template>

<script>
import ContentItem from './ContentItem'
import TagList from '../TagList'

export default {
    name: 'feed-image',
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
                return `/group/${this.item.group_id}/details/stash/${this.item.origin_stash_id}/details/image/${this.item.object_id}/details`
            }
            return `/feed/${this.item.feed_id}/details/stash/${this.item.origin_stash_id}/details/image/${this.item.object_id}/details`
        },
        imageBg() {
            // TODO generate thumbnails
            return {
                opacity: 0.5,
                'z-index': '-1',
                top: '46px',
                left: 0,
                bottom: 0,
                right: 0,
                height: 'calc(100% - 46px)',
                position: 'absolute',
                "background-image": `url(${this.item.nested_object.src})`,
                "background-size": 'cover'
            }
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
    .ion-ios-image { margin-left: 8px; }
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
