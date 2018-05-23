<template>
    <div class="group-list">
    <group-item v-for="group in items" :id="group.id" :name="group.name" :image="group.image" :stashId="justStashId(group.feed)" />
    </div>
</template>

<script>
import GroupItem from './GroupItem'

export default {
    props: ['items'],
    components: {
        GroupItem
    },
    methods: {
        justStashId(feed) {
            return feed.stashes[0].id
        }
    }
}
</script>

<style lang="scss">
</style>
