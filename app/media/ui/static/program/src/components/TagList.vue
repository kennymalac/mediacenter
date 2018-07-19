<template>
    <div :class="className">
        <span v-for="tag in tags" :class="tagClass" @click="clickTag(tag.id)">{{ tag.name }}</span>
    </div>
</template>

<script>
import router from "../router/index.js"

export default {
    props: {
        id: [Number],
        name: [String],
        tags: [Array],
        className: {
            type: [String, Array],
            default: "tag-list"
        },
        tagType: {
            type: String,
            default: ""
        }
    },
    computed: {
        tagClass() {
            return `category-tag ${this.tagType}-tag`
        }
    },
    methods: {
        clickTag(id) {
            router.push(`/${this.tagType}/${id}/details`)
        }
    }
}
</script>

<style lang="scss">
</style>
