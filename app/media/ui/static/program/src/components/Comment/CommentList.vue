<template>
        <transition-group name="list" tag="div" class="comments">
            <comment-item :activeUserId="activeUserId" @reply="reply" :contentObjectId="contentObjectId" :profileId="profileId" :blacklist="blacklist" @minimizeComment="minimize(item.id)" @maximizeComment="maximize(item.id)" v-for="item in visibleItems" :key="item.id" v-bind="item.instance" :comments="nestedComments(item.id)" />
        </transition-group>
    </div>
</template>

<script>
import {serializeIds} from '../../models/serializers.js'

export default {
    name: 'comment-list',
    props: {
        items: [Array],
        activeUserId: {
            type: Number,
            default: 0
        },
        parentId: {
            type: Number,
            default: 0
        },
        contentObjectId: {
            type: [Number, String],
            required: false
        },
        profileId: {
            type: [Number, String],
            required: false
        }
    },
    data() {
        return {
            blacklist: []
        }
    },
    computed: {
        visibleItems() {
            return this.items.filter((item) => {
                return !this.blacklist.includes(item.id) && (!item.parent || item.parent === this.parentId)
            })
        }
    },
    components: {
        CommentItem: () => import('./CommentItem')
    },
    methods: {
        reply(id) {
            this.$emit('reply', id)
        },
        minimize(id) {
            for (const comment of this.nestedComments(id)) {
                this.blacklist.push(comment.id)
            }
        },
        maximize(id) {
            const nested = serializeIds(this.nestedComments(id))
            this.blacklist = this.blacklist.filter((bid) => {
                return !nested.includes(bid)
            })
        },
        nestedComments(id) {
            let n1 = this.items.filter((item) => {
                return item.parent === id
            })

            return [].concat.apply(n1, serializeIds(n1).map(this.nestedComments.bind(this)))
        }
    }
}
</script>

<style lang="scss">
.nested-comments {
    background-color: white;
    border-left: 1px solid grey;

    .comment {
        padding-left: 5px;
        margin-left: 20px;
        a.reply {
            padding-right: 5px;
        }
    }

    &.list-enter-active, &.list-leave-active,
    .list-enter-active, .list-leave-active {
        transition: all .5s;
    }
    &.list-enter, &.list-leave-to,
    .list-enter, .list-leave-to  {
        border-left-color: white;
        opacity: 0;
        transform: translateY(-30px);
    }
}
div.comments {
    background-color: white;
    padding: 10px;
}
.comment {
    padding: 5px;
    width: 450px;
    font-size: 1rem;
    text-align: left;

    .author {
        border-bottom: 1px solid grey;
        padding: 2px;
        .display-name, .user-title {
            padding-right: 4px;
        }
        .date {
            color: grey;
            font-size: .8rem;
        }
    }

    .minimize {
        display: inline;
        font-weight: bold;
        color: orange;
        user-select: none;
        &:hover {
            cursor: pointer;
        }
    }
}
</style>
