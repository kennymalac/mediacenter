<template>
    <content-item :embed="embedProps" v-bind="item.instance" :commentsUrl="commentsUrl">
        <template slot="title" slot-scope="{ slotProps }">
            <div class="content-title">
                <i class="ion-ios-link"></i> <a class="external-link" :href="item.nested_object.link">{{ item.title }}</a>
            </div>
            <span class="date">
                {{ item.created.fromNow() }}
                <span class="local-tag" v-if="item.is_local"><i class="ion-ios-pin"></i> Local</span>
                <span v-if="item.group_id && showGroupTag">
                    <span v-html="'&nbsp;in'"></span>
                    <tag-list className="tag-box" :tags="[{name: item.group_name, id: item.group_id}]" tagType="group" />
                </span>
            </span>
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
    .ion-ios-link { padding-right: 5px; }
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
        max-height: 55%;
    }
}
</style>
