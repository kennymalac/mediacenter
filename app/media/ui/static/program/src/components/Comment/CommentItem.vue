<template>
    <div class="comment">
        <div class="author">
            <div @click="minimize" v-if="!minimized" class="minimize">[-]</div>
            <div @click="maximize" v-if="minimized" class="minimize">[+]</div>
            <span class="display-name"><router-link :to="ownerProfile">{{ owner.profile.display_name }}</router-link></span>
            <span class="user-title">Sr. Poster</span>
            <span class="date">{{ created.format('LLLL') }}</span>
        </div>
        <p class="text">{{ text }}</p>
        <transition name="list">
            <div v-if="!minimized" class="nested-comments">
                <comment-list :contentObjectId="contentObjectId" :parentId="id" :items="visibleComments" />
            </div>
        </transition>
    </div>
</template>

<script>
export default {
    name: 'comment-item',
    props: {
        blacklist: [Array],
        contentObjectId: [Number, String],
        id: [Number],
        owner: [Object],
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
        ownerProfile() {
            return `/profile/${this.owner.profile.id}/details`
        },

        visibleComments() {
            return this.comments.filter((item) => {
                return !this.blacklist.includes(item.id)
            })
        }
    },
    methods: {
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
