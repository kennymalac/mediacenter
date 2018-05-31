<template>
    <div class="comments">
        <comment-item v-for="item in items" v-bind="item.instance" :comments="nestedComments(item.id)" />
    </div>
</template>

<script>
export default {
    name: 'comment-list',
    props: {
        items: [Array],
        parentId: {
            type: Number,
            default: 0
        },
        contentObjectId: [Number, String]
    },
    components: {
        CommentItem: () => import('./CommentItem')
    },
    methods: {
        nestedComments(id) {
            return this.items.filter((item) => {
                return item.parent === id
            })
        }
    }
}
</script>

<style lang="scss">
.nested-comments {
    border-left: 1px solid grey;
    .comment {
        padding-left: 5px;
        margin-left: 20px;
    }

    .list-enter-active, .list-leave-active {
        transition: all 1s;
    }
    .list-enter, .list-leave-to  {
        opacity: 0;
        transform: translateX(30px);
    }
}
.comment {
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
