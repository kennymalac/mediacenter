<template>
    <div class="comment">
        <div class="author">
            <div @click="$emit('minimizeComment')" class="minimize">[-]</div>
            <span class="display-name"><a>{{ owner.profile.display_name }}</a></span>
            <span class="user-title">Sr. Poster</span>
            <span class="date">{{ created.format('LLLL') }}</span>
        </div>
        <p class="text">{{ text }}</p>
        <div class="nested-comments">
            <comment-list :contentObjectId="contentObjectId" :parentId="id" :items="comments" />
        </div>
    </div>
</template>

<script>
export default {
    name: 'comment-item',
    props: {
        contentObjectId: [Number, String],
        id: [Number],
        owner: [Object],
        created: [Object],
        text: [String],
        comments: [Array]
    },
    components: {
        CommentList: () => import('./CommentList')
    }
}
</script>

<style lang="scss">
</style>
