<template>
    <div class="comment">
        <div class="author">
            <div @click="minimize" v-if="!minimized" class="minimize">[-]</div>
            <div @click="maximize" v-if="minimized" class="minimize">[+]</div>
            <span v-if="!is_anonymous" class="display-name"><router-link :to="ownerProfile">{{ owner.profile.display_name }}</router-link></span>
            <span v-if="is_anonymous" class="display-name">Anonymous</span>
            <span v-if="!is_anonymous" class="user-title">User</span>
            <span class="date">{{ created.format('LLLL') }}</span>
        </div>
        <a class="reply" @click.prevent="$emit('reply', {id, owner})">Reply</a>
        <router-link v-if="isActiveUser" :to="editCommentUrl">
            <i class="ion-md-create"></i> Edit
        </router-link>

        <p class="text">{{ text }}</p>
        <transition name="list">
            <div v-if="!minimized" class="nested-comments">
                <comment-list @reply="reply" :activeUserId="activeUserId" :contentObjectId="contentObjectId" :profileId="profileId" :parentId="id" :items="comments" />
            </div>
        </transition>
    </div>
</template>

<script>
export default {
    name: 'comment-item',
    props: {
        activeUserId: {
            type: Number,
            default: 0
        },
        blacklist: [Array],
        contentObjectId: {
            type: [Number, String],
            required: false
        },
        profileId: {
            type: [Number, String],
            required: false
        },
        id: [Number],
        owner: [Object],
        is_anonymous: {
            type: Boolean,
            default: false
        },
        created: [Object],
        text: [String],
        comments: [Array]
    },
    components: {
        CommentList: () => import('./CommentList')
    },
    data() {
        return {
            minimized: false
        }
    },
    computed: {
        editCommentUrl() {
            return `${this.id}/manage`
        },
        isActiveUser() {
            return this.activeUserId === this.owner.id
        },

        ownerProfile() {
            return `/profile/${this.owner.profile.id}/details`
        },

        visibleComments() {
            return this.comments.filter((item) => {
                return !this.blacklist.includes(item.id) && item.parent === this.id
            })
        }
    },
    methods: {
        reply(id) {
            this.$emit('reply', id)
        },
        minimize() {
            this.minimized = true
            this.$emit('minimizeComment')
        },
        maximize() {
            this.minimized = false
            this.$emit('maximizeComment')
        }
    }
}
</script>

<style lang="scss">
</style>
