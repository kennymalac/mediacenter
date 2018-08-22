<template>
    <div class="feed-content-item-list">
        <pagination-controls :currentPage="currentPage" :pageCount="pageCount" @selected="selectPage" />
        <transition-group name="list" tag="div">
            <div style="display: inline-block" v-for="item in pageContent" :key="item.id">
                <feed-link @togglePin="() => togglePin(item)" v-if="item.content_type.name == 'link'" :showGroupTag="showGroupTag" :showMenu="showMenu" :item="item" />
                <feed-discussion-topic @togglePin="() => togglePin(item)" v-if="item.content_type.name == 'topic'" :showGroupTag="showGroupTag" :showMenu="showMenu" :item="item" />
                <feed-discussion-topic @togglePin="() => togglePin(item)" v-if="item.content_type.name == 'poll'" subtype="Poll" :showGroupTag="showGroupTag" :showMenu="showMenu" :item="item" />
                <feed-image @togglePin="() => togglePin(item)" v-if="item.content_type.name == 'img'" :showGroupTag="showGroupTag" :showMenu="showMenu" :item="item" />
            </div>
        </transition-group>
        <div v-if="pageContent.length == 0">
            There are no posts here! Check back later.
        </div>
    </div>
</template>

<script>
import PaginatedComponent from "./PaginatedComponent"

import FeedLink from './FeedContentItems/Link'
import FeedImage from './FeedContentItems/Image'
import FeedDiscussionTopic from './FeedContentItems/DiscussionTopic'
// import {links} from '../store.js'
// import linkDeps from '../dependencies/Link.js'

import PaginationControls from './PaginationControls'

export default {
    mixins: [PaginatedComponent],
    props: {
        query: {
            type: Object
        },
        stashId: {
            type: [String, Number],
            required: false
        },
        items: [Object],
        enabledContentTypes: [Array],
        showGroupTag: {
            type: Boolean,
            default: true
        },
        showMenu: {
            type: Boolean,
            default: false
        }
    },
    components: {
        FeedLink,
        FeedImage,
        FeedDiscussionTopic,
        PaginatedComponent,
        PaginationControls
    },
    data() {
        return {
            pageSize: 20,
            content: []
        }
    },
    computed: {
        pageContent() {
            let items = this.content.filter((item) => {
                return this.isItemVisibleOnPage(item)
            })
            if (this.stashId) {
                items = items.filter((item) => {
                    return this.enabledContentTypes.includes(item.item.content_type.title)
                })

                const pinned = items.filter((instance) => {
                    return instance.is_pinned
                })
                const regular = items.filter((instance) => {
                    return !instance.is_pinned
                })

                return pinned.concat(regular).map((instance) => {
                    // TODO refactor
                    return {
                        is_pinned: instance.is_pinned,
                        order: instance.order,
                        ...instance.item.instance,
                        instance: {
                            is_pinned: instance.is_pinned,
                            order: instance.order,
                            ...instance.item.instance
                        }
                    }
                })
            }
            return items.filter((item) => {
                return this.enabledContentTypes.includes(item.content_type.title)
            })
        }
    },
    mounted() {
        this.paginate(this.items)
        if (this.query.last) {
            this.selectPage(this.pageCount)
        }
    },
    watch: {
        items(newVal) {
            this.content = newVal.results
            this.paginate(newVal)
            if (this.query.last) {
                this.selectPage(this.pageCount)
            }
        }
    },
    methods: {
        listChildren() {
            this.isPaginating = true
            this.$emit('listChildren', this.currentPage)
        },
        togglePin(item) {
            this.$emit('togglePin', item)
        }
    }
}
</script>

<style lang="scss">
.feed-content-item-list {
    height: calc(100vh - 220px);
    overflow: scroll;
    .list-item {
        display: inline-block;
        margin-right: 10px;
    }
    .list-enter-active, .list-leave-active {
        transition: all .6s;
    }
    .list-enter, .list-leave-to /* .list-leave-active below version 2.1.8 */ {
        opacity: 0;
        transform: translateY(10px);
    }
}

</style>
